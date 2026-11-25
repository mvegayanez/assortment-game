// =====================================================================
//  JUEGO · Primer día en el súper «La Despensa»
// =====================================================================
(function () {
  const B = BANCO, C = window.CONFIG || {};
  const factor = Math.min(1, parseFloat(U.param("tiempo")) || 1); // solo permite acortar (para pruebas)
  const TIEMPOS = (C.TIEMPOS || [300, 180, 360, 300, 360]).map(t => Math.max(5, Math.round(t * factor)));
  const MAX_PISTAS = 2, COSTE_PISTA = 10, MAX_BONUS = 10, NRONDAS = 5;
  const app = document.getElementById("app");

  const S = {
    lang: null, screen: "lang",
    nombre: U.ls.get("surtido_nombre", ""),
    grupo: U.param("grupo") || U.ls.get("surtido_grupo", ""),
    grupoFijo: !!U.param("grupo"),
    r: 0, res: [], fallos: [], cur: null, deadline: 0, timer: null,
    modal: null, timeout: false, ini: ["A", "A", "A"], iniPos: 0,
    saveState: "idle", saved: null, top: null, scope: "grupo", myPos: 0, rankTotal: 0, mine: null, startedAt: 0, feedback: null
  };
  const T = () => TXT[S.lang || "es"];
  const L = () => S.lang || "es";
  const E = U.esc;
  const lbl = o => o[L()];                    // objetos con .es/.en
  const pair = (a) => a[L() === "es" ? 0 : 1]; // pares [es, en]

  // ------------------------------------------------------------------
  //  Preparación de cada ronda
  // ------------------------------------------------------------------
  function setupR1() {
    const bySec = {}; B.PRODUCTOS.forEach(p => (bySec[p.sec] = bySec[p.sec] || []).push(p));
    let chosen = B.SECCIONES.map(s => U.pick(bySec[s.id]));               // 1 por pasillo
    const traps = U.shuffle(B.PRODUCTOS.filter(p => p.dif === "T" && !chosen.includes(p)));
    chosen = chosen.concat(traps.slice(0, Math.max(0, 2 - chosen.filter(p => p.dif === "T").length)));
    const rest = U.shuffle(B.PRODUCTOS.filter(p => !chosen.includes(p)));
    chosen = chosen.concat(rest.slice(0, 14 - chosen.length));
    return { kind: "board", items: U.shuffle(chosen.map(p => p.id)), place: {}, locked: {}, sel: null, hints: 0 };
  }
  function pickChainsR3() {
    const alim = U.shuffle(B.CADENAS.filter(c => c.t[0][0] === "Alimentación"));
    const drog = U.shuffle(B.CADENAS.filter(c => c.t[0][0] !== "Alimentación"));
    return U.shuffle([alim[0], alim[1], drog[0]]).map(c => c.id);
  }
  function setupR2(r3chains) {
    const pool = B.CADENAS.filter(c => !r3chains.includes(c.id));
    const levels = U.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 3, 4]); // los niveles clave Sección y Categoría salen dos veces
    const used = new Set(), qs = [];
    levels.forEach(n => {
      let c, tries = 0;
      do { c = U.pick(pool); tries++; } while (used.has(c.id + "-" + n) && tries < 20);
      used.add(c.id + "-" + n); qs.push({ cid: c.id, n });
    });
    return { kind: "quiz", qs, idx: 0, answers: [], elim: {}, hints: 0 };
  }
  function trapFor(cid) {
    const ch = B.CADENAS.find(c => c.id === cid);
    const own = new Set(ch.t.map(t => t[0]));
    const same = B.CADENAS.filter(c => c.id !== cid && c.t[0][0] === ch.t[0][0]);
    const cands = [];
    (same.length ? same : B.CADENAS.filter(c => c.id !== cid)).forEach(c => {
      for (let n = 3; n <= 6; n++) if (!own.has(c.t[n - 1][0])) cands.push(c.id + "-" + n);
    });
    return U.pick(cands);
  }
  function setupR3(chains) {
    return {
      kind: "board", multi: true, idx: 0, sel: null, hints: 0,
      boards: chains.map(cid => {
        const trap = trapFor(cid);
        const cards = [1, 2, 3, 4, 5, 6, 7, 8].map(n => cid + "-" + n).concat([trap]);
        return { cid, trap, items: U.shuffle(cards), place: {}, locked: {}, trapShown: false };
      })
    };
  }
  function setupR4() {
    const out = [];
    B.CRITERIOS.forEach(c => out.push(U.pick(B.LINEALES.filter(l => l.crit === c.id))));
    out.push(U.pick(B.LINEALES.filter(l => !out.includes(l))));
    return { kind: "quiz", qs: U.shuffle(out).map(l => l.id), idx: 0, answers: [], elim: {}, hints: 0 };
  }
  function setupR5() {
    const e1 = U.pick(B.ENCARGOS);
    const e2 = U.pick(B.ENCARGOS.filter(e => e.crit !== e1.crit));
    return {
      kind: "board", multi: true, idx: 0, sel: null, hints: 0,
      boards: [e1, e2].map(e => ({ eid: e.id, items: U.shuffle(e.productos.map(p => p[0])), place: {}, locked: {} }))
    };
  }
  function setupGame() {
    S.res = []; S.fallos = []; S.saved = null; S.top = null; S.saveState = "idle";
    const r3 = pickChainsR3();
    S.plan = { r3, r2: setupR2(r3) };
    S.startedAt = Date.now();
  }
  function setupRound(r) {
    S.timeout = false; S.feedback = null;
    S.cur = r === 1 ? setupR1() : r === 2 ? S.plan.r2 : r === 3 ? setupR3(S.plan.r3) : r === 4 ? setupR4() : setupR5();
  }

  // ------------------------------------------------------------------
  //  Tablero genérico (rondas 1, 3 y 5)
  // ------------------------------------------------------------------
  function board() { return S.cur.multi ? S.cur.boards[S.cur.idx] : S.cur; }
  function zoneCap(zid) { return S.r === 3 ? 1 : 99; }
  function correctZone(itemId) {
    if (S.r === 1) return B.PRODUCTOS.find(p => p.id === itemId).sec;
    if (S.r === 3) { const b = board(); const [cid, n] = itemId.split("-"); return cid === b.cid ? "L" + n : null; }
    if (S.r === 5) { const e = B.ENCARGOS.find(x => x.id === board().eid); return e.productos.find(p => p[0] === itemId)[4]; }
  }
  function moveItem(itemId, zid) {
    const b = board();
    if (b.locked[itemId]) return;
    if (S.r === 3 && b.trapShown && itemId === b.trap && zid) return;
    if (zid) {
      const inZone = Object.keys(b.place).filter(k => b.place[k] === zid && k !== itemId);
      if (inZone.length >= zoneCap(zid)) {
        const occ = inZone[0];
        if (b.locked[occ]) return;
        if (b.place[itemId]) b.place[occ] = b.place[itemId]; else delete b.place[occ]; // intercambio
      }
      b.place[itemId] = zid;
    } else delete b.place[itemId];
  }
  function itemView(id) {
    if (S.r === 1) { const p = B.PRODUCTOS.find(x => x.id === id); return { icon: p.icon, label: lbl(p) }; }
    if (S.r === 3) { const [cid, n] = id.split("-"); const c = B.CADENAS.find(x => x.id === cid); return { icon: "🏷️", label: pair(c.t[+n - 1]) }; }
    if (S.r === 5) { const e = B.ENCARGOS.find(x => x.id === board().eid); const p = e.productos.find(x => x[0] === id); return { icon: p[1], label: L() === "es" ? p[2] : p[3] }; }
  }
  function zonesView() {
    if (S.r === 1) return B.SECCIONES.map((s, i) => ({ id: s.id, icon: s.icon, label: lbl(s), sub: `${T().pasillo} ${i + 1}` }));
    if (S.r === 3) return B.NIVELES.map(n => ({ id: "L" + n.n, icon: "", label: lbl(n), sub: `${T().nivel} ${n.n}`, w: 52 + n.n * 6 }));
    if (S.r === 5) { const e = B.ENCARGOS.find(x => x.id === board().eid); return e.baldas.map((b, i) => ({ id: b[0], icon: "", label: L() === "es" ? b[1] : b[2], sub: `${T().balda} ${i + 1}` })); }
  }
  function chip(id, inZone) {
    const b = board(), v = itemView(id);
    const cls = ["item", inZone ? "in-zone" : "", S.cur.sel === id ? "sel" : "", b.locked[id] ? "locked" : "",
      (S.r === 3 && b.trapShown && id === b.trap) ? "trap" : ""].join(" ");
    return `<button class="${cls}" data-item="${E(id)}" type="button">${v.icon ? `<span class="ic">${v.icon}</span>` : ""}<span class="tx">${E(v.label)}</span>${b.locked[id] ? '<span class="lk">🔒</span>' : ""}</button>`;
  }
  function renderBoard() {
    const b = board(), zones = zonesView();
    const tray = b.items.filter(id => !b.place[id]);
    const zoneHtml = zones.map(z => {
      const inside = b.items.filter(id => b.place[id] === z.id);
      return `<div class="zone zone-r${S.r}" data-zone="${z.id}" ${z.w ? `style="width:${z.w}%"` : ""}>
        <div class="zone-h"><span class="zone-sub">${E(z.sub)}</span>${z.icon ? `<span class="zone-ic">${z.icon}</span>` : ""}<span class="zone-t">${E(z.label)}</span></div>
        <div class="zone-items">${inside.map(id => chip(id, true)).join("")}</div></div>`;
    }).join("");
    return `<p class="mobile-help">${T().instrSeleccion}</p><div class="board board-r${S.r}">
      <div class="tray" data-tray="1">
        <div class="tray-h">${S.r === 3 ? T().tarjetas : T().bandeja} <span class="count">${tray.length}</span></div>
        <div class="tray-items">${tray.length ? tray.map(id => chip(id, false)).join("") : `<p class="muted">${T().bandejaVacia}</p>`}</div>
        <p class="hint-line">${T().instrSeleccion}</p>
      </div>
      <div class="zones zones-r${S.r}">${zoneHtml}</div>
    </div>`;
  }

  // ------------------------------------------------------------------
  //  Pantallas
  // ------------------------------------------------------------------
  function ramon(text, extra) {
    return `<div class="ramon"><div class="ramon-face" aria-hidden="true">👨🏻‍🦳<span>Don Ramón</span></div>
      <div class="bubble">${text}${extra || ""}</div></div>`;
  }
  function header() {
    const inPlay = S.screen === "play";
    const total = S.res.reduce((a, x) => a + x.puntos, 0);
    const h = S.cur ? S.cur.hints : 0;
    return `<header class="hud">
      <div class="logo">🛒 LA DESPENSA</div>
      ${S.r ? `<div class="hud-r">${T().ronda} <b>${S.r}</b>/5</div>` : ""}
      ${inPlay ? `<div class="hud-t" id="timer">${U.mmss((S.deadline - Date.now()) / 1000)}</div>` : ""}
      ${S.r ? `<div class="hud-p">${T().puntos} <b>${total}</b></div>` : ""}
      ${inPlay ? `<button class="btn-hint" data-action="hint" ${h >= MAX_PISTAS ? "disabled" : ""}>💡 ${h >= MAX_PISTAS ? `<span class="hint-long">${T().sinPistas}</span><span class="hint-short">0</span>` : `<span class="hint-long">${T().pista} (${T().pistasQuedan(MAX_PISTAS - h)})</span><span class="hint-short">${MAX_PISTAS - h}</span>`}</button>` : ""}
      <div class="langs">${["es", "en"].map(l => `<button data-action="lang" data-l="${l}" class="${L() === l ? "on" : ""}">${l.toUpperCase()}</button>`).join("")}</div>
    </header>`;
  }

  function scrLang() {
    return `<main class="center">
      <div class="title-card">
        <div class="pixel big">🛒 LA DESPENSA</div>
        <p class="sub">Primer día en el súper · First day at the supermarket</p>
        <p class="by-title pixel">by @profesormariovega</p>
        <p class="pixel small blink">${"ELIGE IDIOMA · CHOOSE LANGUAGE"}</p>
        <div class="row">
          <button class="btn big" data-action="setlang" data-l="es">🇪🇸 Español</button>
          <button class="btn big" data-action="setlang" data-l="en">🇬🇧 English</button>
        </div>
      </div></main>`;
  }
  function scrWelcome() {
    const t = T();
    return `<main class="center"><div class="card narrow">
      ${ramon(L() === "es" ? "¡Hola! Soy Don Ramón, el dueño de «La Despensa». Hoy empiezas como <b>category manager junior</b>. ¿Cómo te llamas?" : "Hi! I'm Don Ramón, owner of 'La Despensa'. Today you start as a <b>junior category manager</b>. What's your name?")}
      <form data-form="welcome" class="form">
        <label>${t.tuNombre}<input name="nombre" required maxlength="60" autocomplete="name" value="${E(S.nombre)}"></label>
        ${S.grupoFijo ? `<p class="muted">${t.tuGrupo}: <b>${E(S.grupo)}</b></p>` : `<label>${t.tuGrupo}<input name="grupo" maxlength="30" value="${E(S.grupo)}" placeholder="MKT-2A"></label>`}
        <div class="rules"><h3>${t.reglasTitulo}</h3><ul>${t.reglas.map(x => `<li>${x}</li>`).join("")}</ul></div>
        <button class="btn big primary" type="submit">${t.empezarJuego} ▶</button>
      </form>
      ${DB.enabled ? "" : `<p class="warn">${t.modoPrueba}</p>`}
    </div></main>`;
  }
  function scrBrief() {
    const t = T(), b = t.briefing[S.r - 1];
    return `<main class="center"><div class="card narrow">
      <div class="pixel round-title">${t.ronda} ${S.r} · ${E(t.rondaNombres[S.r - 1])}</div>
      ${ramon(E(b.t))}
      <ul class="facts"><li>🎯 ${E(b.a)}</li><li>⏱️ ${U.mmss(TIEMPOS[S.r - 1])}</li><li>💡 ${MAX_PISTAS} × −${COSTE_PISTA}</li></ul>
      <button class="btn big primary" data-action="start">${t.empezar}</button>
    </div></main>`;
  }

  function scrPlay() {
    const t = T(); let body = "";
    if (S.r === 1) {
      body = renderBoard() + `<div class="actions"><button class="btn primary" data-action="finish">${t.listo}</button></div>`;
    } else if (S.r === 2) {
      const q = S.cur.qs[S.cur.idx], c = B.CADENAS.find(x => x.id === q.cid);
      const elim = S.cur.elim[S.cur.idx] || [], fb = S.feedback;
      body = `<div class="quiz card">
        <div class="qcount">${S.cur.idx + 1} / ${S.cur.qs.length}</div>
        <p class="muted">${t.producto}</p><div class="ref">${c.icon} ${E(L() === "es" ? c.refEs : c.refEn)}</div>
        <p class="muted">${t.termino}</p><div class="term">«${E(pair(c.t[q.n - 1]))}»</div>
        <p class="ask">${t.queNivel}</p>
        <div class="opts opts8">${B.NIVELES.map(n => {
          let cls = "opt"; if (elim.includes(n.n)) cls += " elim";
          if (fb) { if (n.n === q.n) cls += " ok"; else if (n.n === fb.chosen) cls += " ko"; }
          return `<button class="${cls}" data-action="answer" data-v="${n.n}" ${elim.includes(n.n) || fb ? "disabled" : ""}><b>${n.n}</b> ${E(lbl(n))}</button>`;
        }).join("")}</div></div>`;
    } else if (S.r === 3) {
      const b = board(), c = B.CADENAS.find(x => x.id === b.cid), n = S.cur.boards.length;
      body = `<div class="subhead"><span class="pill">${t.referenciaN(S.cur.idx + 1, n)}</span> <span class="ref">${c.icon} ${E(L() === "es" ? c.refEs : c.refEn)}</span></div>`
        + renderBoard()
        + `<div class="actions">${S.cur.idx < n - 1 ? `<button class="btn primary" data-action="nextboard">${t.siguiente} ▶</button>` : `<button class="btn primary" data-action="finish">${t.listo}</button>`}</div>`;
    } else if (S.r === 4) {
      const l = B.LINEALES.find(x => x.id === S.cur.qs[S.cur.idx]);
      const elim = S.cur.elim[S.cur.idx] || [], fb = S.feedback;
      body = `<div class="quiz card">
        <div class="qcount">${t.lineal(S.cur.idx + 1, S.cur.qs.length)}</div>
        <div class="shelf">
          <div class="shelf-top">${l.icon} ${E(L() === "es" ? l.catEs : l.catEn)}</div>
          ${l.baldas.map((bb, i) => `<div class="shelf-row"><span class="shelf-n">${i + 1}</span><span class="shelf-goods">${l.icon.repeat(3)}</span><span class="shelf-l">${E(pair(bb))}</span></div>`).join("")}
        </div>
        <p class="ask">${t.queCriterio}</p>
        <div class="opts opts4">${B.CRITERIOS.map(c => {
          let cls = "opt"; if (elim.includes(c.id)) cls += " elim";
          if (fb) { if (c.id === l.crit) cls += " ok"; else if (c.id === fb.chosen) cls += " ko"; }
          return `<button class="${cls}" data-action="answer" data-v="${c.id}" ${elim.includes(c.id) || fb ? "disabled" : ""}>${c.icon} ${E(lbl(c))}</button>`;
        }).join("")}</div></div>`;
    } else if (S.r === 5) {
      const b = board(), e = B.ENCARGOS.find(x => x.id === b.eid), cr = B.CRITERIOS.find(x => x.id === e.crit), n = S.cur.boards.length;
      const order = L() === "es"
        ? `Organiza la categoría <b>${E(e.catEs.toLowerCase())}</b> <b>${E(cr.es.toLowerCase())}</b> (${E(e.varEs)}).`
        : `Organise the <b>${E(e.catEn.toLowerCase())}</b> category <b>${E(cr.en.toLowerCase())}</b> (${E(e.varEn)}).`;
      body = `<div class="subhead"><span class="pill">${t.encargo(S.cur.idx + 1, n)}</span></div>`
        + ramon(order)
        + renderBoard()
        + `<div class="actions">${S.cur.idx < n - 1 ? `<button class="btn primary" data-action="nextboard">${t.siguiente} ▶</button>` : `<button class="btn primary" data-action="finish">${t.listo}</button>`}</div>`;
    }
    return `<main class="play play-r${S.r}">${body}</main>`;
  }

  function scrRoundEnd() {
    const t = T(), x = S.res[S.r - 1], pct = Math.round(100 * x.aciertos / x.total);
    return `<main class="center"><div class="card narrow">
      ${S.timeout ? `<div class="pixel alert">${t.seAcaboTiempo}</div>` : ""}
      <div class="pixel round-title">${t.ronda} ${S.r} · ${E(t.rondaNombres[S.r - 1])}</div>
      <table class="score-t">
        <tr><td>${t.aciertos}</td><td>${x.aciertos} / ${x.total}</td></tr>
        <tr><td>${t.base}</td><td>${x.base}</td></tr>
        <tr><td>${t.penalizacion} (${x.pistas})</td><td>−${x.pistas * COSTE_PISTA}</td></tr>
        <tr><td>${t.bonus}</td><td>+${x.bonus}</td></tr>
        <tr class="tot"><td>${t.totalRonda}</td><td>${x.puntos}</td></tr>
      </table>
      ${ramon(E(t.comentario(pct)))}
      <button class="btn big primary" data-action="nextround">${S.r < NRONDAS ? t.siguienteRonda : t.verResultados} ▶</button>
    </div></main>`;
  }

  function totals() {
    const total = S.res.reduce((a, x) => a + x.puntos, 0);
    const pct = Math.min(100, Math.round(total / 5));
    return { total, pct };
  }
  function topTable(list, highlightKey) {
    if (!list) return `<p class="muted pixel small blink">LOADING…</p>`;
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const x = list[i];
      const me = x && (U.normName(x.nombre) + "|" + (x.grupo || "")) === highlightKey;
      rows.push(`<tr class="${me ? "me" : ""} c${i % 5}"><td>${String(i + 1).padStart(2, "0")}</td><td>${x ? E(x.iniciales) : "---"}</td><td>${x ? String(x.puntos).padStart(3, "0") : "000"}</td></tr>`);
    }
    if (S.mine) rows.push(`<tr><td colspan="3">· · ·</td></tr>`, `<tr class="me"><td>${String(S.myPos).padStart(2, "0")}</td><td>${E(S.mine.iniciales)}</td><td>${String(S.mine.puntos).padStart(3, "0")}</td></tr>`);
    return `<table class="arcade-t"><thead><tr><th>RANK</th><th>NAME</th><th>SCORE</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
  }
  function scrFinal() {
    const t = T(), { total, pct } = totals(), rg = U.rango(pct, L());
    const key = U.normName(S.nombre) + "|" + (S.grupo || "");
    const review = [1, 2, 3, 4, 5].map(r => {
      const fs = S.fallos.filter(f => f.r === r);
      return `<details class="rev" ${r === 1 ? "open" : ""}><summary>${t.ronda} ${r} · ${E(t.rondaNombres[r - 1])} <span class="pill ${fs.length ? "bad" : "good"}">${fs.length}</span></summary>
        ${fs.length ? fs.map(f => { const d = describeFallo(f, L()); return `<div class="fallo"><div class="fq">${E(d.q)}</div>
          <div class="fa"><span class="ko">✗ ${t.tuRespuesta}: ${E(d.dada)}</span><span class="ok">✓ ${t.correcta}: ${E(d.ok)}</span></div>
          ${d.exp ? `<div class="fe">💬 ${E(d.exp)}</div>` : ""}</div>`; }).join("") : `<p class="muted">${t.sinFallos}</p>`}
      </details>`;
    }).join("");
    const initials = S.saveState === "saved" ? "" : `
      <div class="ini-box">
        <div class="pixel small">${t.iniciales}</div>
        <div class="ini">${S.ini.map((c, i) => `<div class="ini-slot ${i === S.iniPos ? "on" : ""}" data-action="inipos" data-i="${i}">
          <button data-action="iniup" data-i="${i}" aria-label="up">▲</button><span>${c}</span><button data-action="inidown" data-i="${i}" aria-label="down">▼</button></div>`).join("")}</div>
        <button class="btn primary" data-action="save" ${S.saveState === "saving" ? "disabled" : ""}>${S.saveState === "saving" ? t.guardando : t.guardar}</button>
        ${S.saveState === "error" ? `<p class="warn">${t.errorGuardar}<br><small style="word-break:break-all">${E(S.saveErr || "")}</small></p>` : ""}
      </div>`;
    return `<main class="final">
      <section class="card final-score">
        <div class="pixel round-title">${t.resultadoFinal}</div>
        <div class="big-score pixel">${total}</div>
        <div class="muted">${pct} %</div>
        <div class="rank-badge">${rg[2]} <b>${E(rg[1])}</b></div>
        ${ramon(E(rg[3]))}
        <div class="bars">${S.res.map((x, i) => `<div class="bar"><span>${t.ronda} ${i + 1}</span><div class="bar-bg"><div class="bar-fg" style="width:${Math.min(100, x.puntos)}%"></div></div><b>${x.puntos}</b></div>`).join("")}</div>
      </section>
      <section class="arcade">
        <div class="pixel arcade-title blink">${t.ranking}${S.grupo ? " · " + E(S.grupo) : ""}</div>
        ${initials}
        ${S.saveState === "saved" ? `${S.grupo ? `<div class="scope">${[["grupo", t.miGrupo], ["todos", t.todos]].map(([v, l]) => `<button data-action="scope" data-s="${v}" class="${S.scope === v ? "on" : ""}">${l}</button>`).join("")}</div>` : ""}
          ${topTable(S.top, key)}
          ${S.myPos ? `<p class="pixel small" style="color:#39ff14">${t.tuPos(S.myPos, S.rankTotal)}</p>` : ""}
          <a class="btn" style="display:inline-block;margin-top:8px;text-decoration:none" target="_blank" rel="noopener" href="ranking.html${S.scope === "grupo" && S.grupo ? "?grupo=" + encodeURIComponent(S.grupo) : ""}">${t.verRanking}</a>` : `<p class="pixel small muted-a">INSERT COIN ▶ ${t.guardar.toUpperCase()}</p>`}
        ${DB.enabled ? "" : `<p class="warn">${t.modoPrueba}</p>`}
      </section>
      <section class="card review"><h2>${t.revision}</h2>${review}
        <button class="btn big" data-action="again">↻ ${t.jugarOtraVez}</button></section>
    </main>`;
  }

  function modal() {
    if (!S.modal) return "";
    return `<div class="modal-bg" data-action="closemodal"><div class="modal" role="dialog">
      <div class="pixel small">💡 ${T().pistaDe} (${S.modal.n}/${MAX_PISTAS})</div>
      ${ramon(E(S.modal.text).replace(/\n/g, "<br>"))}
      <button class="btn primary" data-action="closemodal">${T().cerrar}</button></div></div>`;
  }

  function render() {
    const scr = { lang: scrLang, welcome: scrWelcome, brief: scrBrief, play: scrPlay, roundEnd: scrRoundEnd, final: scrFinal }[S.screen];
    app.innerHTML = (S.screen === "lang" ? "" : header()) + scr() + `<footer class="credit">by <b>@profesormariovega</b></footer>` + modal();
    document.documentElement.lang = L();
    const hud = app.querySelector(".hud");
    document.documentElement.style.setProperty("--hud-h", (hud ? hud.offsetHeight : 0) + "px");
  }

  // ------------------------------------------------------------------
  //  Lógica de rondas
  // ------------------------------------------------------------------
  function startRound() {
    S.screen = "play";
    S.deadline = Date.now() + TIEMPOS[S.r - 1] * 1000;
    S.roundStart = Date.now();
    clearInterval(S.timer);
    S.timer = setInterval(tick, 250);
    render();
  }
  function tick() {
    const left = (S.deadline - Date.now()) / 1000;
    const el = document.getElementById("timer");
    if (el) { el.textContent = U.mmss(left); el.classList.toggle("warn", left <= 30); }
    if (left <= 0) finishRound(true);
  }

  function grade() {
    const r = S.r, fallos = [], seen = []; let ok = 0, total = 0;
    if (r === 1) {
      S.cur.items.forEach(id => { total++; seen.push(id); const c = correctZone(id); const d = S.cur.place[id] || null; if (d === c) ok++; else fallos.push({ r, item: id, dada: d, correcta: c }); });
    } else if (r === 2) {
      S.cur.qs.forEach((q, i) => { total++; seen.push(q.cid + "-" + q.n); const a = S.cur.answers[i]; if (a === q.n) ok++; else fallos.push({ r, item: q.cid + "-" + q.n, dada: a ? String(a) : null, correcta: String(q.n) }); });
    } else if (r === 3) {
      S.cur.boards.forEach(b => {
        for (let n = 1; n <= 8; n++) {
          total++; const want = b.cid + "-" + n; seen.push(want);
          const got = Object.keys(b.place).find(k => b.place[k] === "L" + n) || null;
          if (got === want) ok++; else fallos.push({ r, item: want, dada: got, correcta: want });
        }
      });
    } else if (r === 4) {
      S.cur.qs.forEach((id, i) => { total++; seen.push(id); const l = B.LINEALES.find(x => x.id === id); const a = S.cur.answers[i] || null; if (a === l.crit) ok++; else fallos.push({ r, item: id, dada: a, correcta: l.crit }); });
    } else if (r === 5) {
      S.cur.boards.forEach(b => {
        const e = B.ENCARGOS.find(x => x.id === b.eid);
        e.productos.forEach(p => { total++; seen.push(p[0]); const d = b.place[p[0]] || null; if (d === p[4]) ok++; else fallos.push({ r, item: p[0], dada: d, correcta: p[4] }); });
      });
    }
    return { ok, total, fallos, seen };
  }

  function finishRound(timeout) {
    if (S.screen !== "play") return;
    clearInterval(S.timer);
    S.timeout = !!timeout; S.modal = null; S.feedback = null;
    const g = grade();
    const base = Math.round(100 * g.ok / g.total);
    const leftFrac = timeout ? 0 : Math.max(0, (S.deadline - Date.now()) / (TIEMPOS[S.r - 1] * 1000));
    const bonus = Math.round(MAX_BONUS * leftFrac * g.ok / g.total);
    const pistas = S.cur.hints;
    const puntos = Math.max(0, base - pistas * COSTE_PISTA) + bonus;
    S.res[S.r - 1] = { r: S.r, aciertos: g.ok, total: g.total, base, bonus, pistas, puntos, seg: Math.round((Date.now() - S.roundStart) / 1000), items: g.seen };
    S.fallos = S.fallos.filter(f => f.r !== S.r).concat(g.fallos);
    S.screen = "roundEnd";
    render();
  }

  function answer(v) {
    if (S.feedback) return;
    const q = S.cur.idx;
    const val = S.r === 2 ? +v : v;
    S.cur.answers[q] = val;
    S.feedback = { chosen: val };
    render();
    setTimeout(() => {
      if (S.screen !== "play") return;
      S.feedback = null;
      if (S.cur.idx < S.cur.qs.length - 1) { S.cur.idx++; render(); } else finishRound(false);
    }, 900);
  }

  function useHint() {
    if (!S.cur || S.cur.hints >= MAX_PISTAS) return;
    S.cur.hints++;
    const n = S.cur.hints, t = T();
    let text;
    if (n === 1) {
      if (S.r === 5) { const e = B.ENCARGOS.find(x => x.id === board().eid); text = t.teoria[5](B.CRITERIOS.find(c => c.id === e.crit)); }
      else text = t.teoria[S.r];
    } else {
      text = t.pista2Hecha[S.r];
      if (S.r === 1 || S.r === 5) {
        const b = board();
        const wrong = b.items.filter(id => !b.locked[id] && b.place[id] !== correctZone(id));
        const pool = wrong.filter(id => !b.place[id]).length ? wrong.filter(id => !b.place[id]) : wrong;
        if (pool.length) { const id = U.pick(pool); b.place[id] = correctZone(id); b.locked[id] = true; }
      } else if (S.r === 3) {
        const b = board(); b.trapShown = true; delete b.place[b.trap];
        if (S.cur.sel === b.trap) S.cur.sel = null;
      } else if (S.r === 2) {
        const q = S.cur.qs[S.cur.idx];
        S.cur.elim[S.cur.idx] = U.shuffle([1, 2, 3, 4, 5, 6, 7, 8].filter(x => x !== q.n)).slice(0, 4);
      } else if (S.r === 4) {
        const l = B.LINEALES.find(x => x.id === S.cur.qs[S.cur.idx]);
        S.cur.elim[S.cur.idx] = U.shuffle(B.CRITERIOS.map(c => c.id).filter(x => x !== l.crit)).slice(0, 2);
      }
    }
    S.modal = { n, text };
    render();
  }

  async function loadRank() {
    S.top = null; render();
    try {
      const all = await DB.ranking({ grupo: (S.scope === "grupo" && S.grupo) ? S.grupo : undefined });
      const key = U.normName(S.nombre) + "|" + (S.grupo || "");
      S.rankTotal = all.length;
      S.myPos = all.findIndex(x => (U.normName(x.nombre) + "|" + (x.grupo || "")) === key) + 1;
      S.top = all.slice(0, 10);
      S.mine = S.myPos > 10 ? all[S.myPos - 1] : null;
    } catch (e) { console.error(e); S.top = []; }
    render();
  }

  async function save() {
    if (S.saveState === "saving" || S.saveState === "saved") return;
    S.saveState = "saving"; render();
    const { total, pct } = totals(), rg = U.rango(pct, "es");
    const row = {
      nombre: S.nombre, grupo: S.grupo || "", iniciales: S.ini.join(""), idioma: L(),
      puntos: total, porcentaje: pct, rango: rg[1],
      pistas: S.res.reduce((a, x) => a + x.pistas, 0),
      duracion_seg: Math.round((Date.now() - S.startedAt) / 1000),
      rondas: S.res, fallos: S.fallos
    };
    try {
      S.saved = await DB.save(row);
      S.saveState = "saved"; render();
      await loadRank(); return;
    } catch (e) {
      console.error(e); S.saveErr = String((e && e.message) || e).slice(0, 400); S.saveState = "error";
    }
    render();
  }

  // ------------------------------------------------------------------
  //  Eventos
  // ------------------------------------------------------------------
  const drag = { id: null, x: 0, y: 0, on: false, ghost: null, suppress: false };

  app.addEventListener("click", e => {
    if (drag.suppress) { drag.suppress = false; return; }
    const it = e.target.closest("[data-item]");
    const act = e.target.closest("[data-action]");
    if (it && S.screen === "play" && !act) {
      e.stopPropagation();
      const id = it.dataset.item, b = board();
      const zoneEl = it.closest("[data-zone]");
      // Con un producto seleccionado, tocar otro que ya está en un pasillo/balda = colocarlo ahí
      if (S.cur.sel && S.cur.sel !== id && zoneEl) { moveItem(S.cur.sel, zoneEl.dataset.zone); S.cur.sel = null; render(); return; }
      if (b.locked[id] || (S.r === 3 && b.trapShown && id === b.trap)) return;
      S.cur.sel = S.cur.sel === id ? null : id; render(); return;
    }
    if (act) { onAction(act.dataset.action, act, e); return; }
    const z = e.target.closest("[data-zone]"), tr = e.target.closest("[data-tray]");
    if (S.screen === "play" && S.cur && S.cur.sel) {
      if (z) { moveItem(S.cur.sel, z.dataset.zone); S.cur.sel = null; render(); }
      else if (tr) { moveItem(S.cur.sel, null); S.cur.sel = null; render(); }
    }
  });

  function onAction(a, el, e) {
    if (a === "setlang") { S.lang = el.dataset.l; U.ls.set("surtido_lang", S.lang); S.screen = "welcome"; render(); }
    else if (a === "lang") { S.lang = el.dataset.l; U.ls.set("surtido_lang", S.lang); render(); }
    else if (a === "start") startRound();
    else if (a === "finish") finishRound(false);
    else if (a === "answer") answer(el.dataset.v);
    else if (a === "hint") useHint();
    else if (a === "closemodal") { if (e.target === el || el.tagName === "BUTTON") { S.modal = null; render(); } }
    else if (a === "nextboard") { S.cur.sel = null; S.cur.idx++; render(); window.scrollTo(0, 0); }
    else if (a === "nextround") {
      if (S.r < NRONDAS) { S.r++; setupRound(S.r); S.screen = "brief"; }
      else { S.screen = "final"; }
      render(); window.scrollTo(0, 0);
    }
    else if (a === "inipos") { S.iniPos = +el.dataset.i; render(); }
    else if (a === "iniup" || a === "inidown") {
      e.stopPropagation();
      const i = +el.dataset.i, A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const k = A.indexOf(S.ini[i]); S.ini[i] = A[(k + (a === "iniup" ? 1 : -1) + A.length) % A.length]; S.iniPos = i; render();
    }
    else if (a === "save") save();
    else if (a === "scope") { S.scope = el.dataset.s; loadRank(); }
    else if (a === "again") { setupGame(); S.r = 1; setupRound(1); S.screen = "brief"; render(); window.scrollTo(0, 0); }
  }

  app.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    S.nombre = String(f.get("nombre") || "").trim().slice(0, 60);
    if (!S.grupoFijo) S.grupo = String(f.get("grupo") || "").trim().toUpperCase().slice(0, 30);
    if (!S.nombre) return;
    U.ls.set("surtido_nombre", S.nombre); if (!S.grupoFijo) U.ls.set("surtido_grupo", S.grupo);
    const parts = U.normName(S.nombre).toUpperCase().replace(/[^A-Z ]/g, "").split(" ").filter(Boolean);
    const last = parts[parts.length - 1] || "XXX";
    const ini = (parts.slice(0, 3).map(p => p[0]).join("") + last.slice(1)).slice(0, 3).padEnd(3, "X");
    S.ini = ini.split(""); S.iniPos = 0;
    setupGame(); S.r = 1; setupRound(1); S.screen = "brief"; render();
  });

  // Teclado para iniciales
  document.addEventListener("keydown", e => {
    if (S.screen === "final" && S.saveState !== "saved" && !e.target.closest("input,textarea")) {
      const k = e.key.toUpperCase();
      if (/^[A-Z0-9]$/.test(k)) { S.ini[S.iniPos] = k; S.iniPos = Math.min(2, S.iniPos + 1); render(); }
      else if (e.key === "Backspace") { S.iniPos = Math.max(0, S.iniPos - 1); render(); }
      else if (e.key === "Enter") save();
    }
    if (S.modal && e.key === "Escape") { S.modal = null; render(); }
  });

  // Arrastrar con ratón o dedo (Pointer Events)
  app.addEventListener("pointerdown", e => {
    const it = e.target.closest("[data-item]");
    if (!it || S.screen !== "play") return;
    drag.suppress = false;
    drag.id = it.dataset.item; drag.x = e.clientX; drag.y = e.clientY; drag.on = false; drag.src = it;
  });
  window.addEventListener("pointermove", e => {
    if (!drag.id) return;
    if (!drag.on) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
      const b = board();
      if (b.locked[drag.id] || (S.r === 3 && b.trapShown && drag.id === b.trap)) { drag.id = null; return; }
      drag.on = true;
      drag.ghost = drag.src.cloneNode(true); drag.ghost.classList.add("ghost"); document.body.appendChild(drag.ghost);
      drag.src.classList.add("dragging");
    }
    e.preventDefault();
    drag.ghost.style.left = e.clientX + "px"; drag.ghost.style.top = e.clientY + "px";
    document.querySelectorAll(".zone.over,.tray.over").forEach(z => z.classList.remove("over"));
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const tgt = under && (under.closest("[data-zone]") || under.closest("[data-tray]"));
    if (tgt) tgt.classList.add("over");
  }, { passive: false });
  window.addEventListener("pointerup", e => {
    if (!drag.id) return;
    if (drag.on) {
      drag.ghost.remove();
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const z = under && under.closest("[data-zone]"), tr = under && under.closest("[data-tray]");
      if (z) moveItem(drag.id, z.dataset.zone); else if (tr) moveItem(drag.id, null);
      S.cur.sel = null; drag.suppress = true;
      render();
    }
    drag.id = null; drag.on = false;
  });
  window.addEventListener("pointercancel", () => { if (drag.ghost) drag.ghost.remove(); drag.id = null; drag.on = false; render(); });

  // Inicio
  const saved = U.ls.get("surtido_lang", null);
  if (saved && U.param("lang") !== "choose") { S.lang = saved; }
  if (U.param("lang") === "es" || U.param("lang") === "en") { S.lang = U.param("lang"); S.screen = "welcome"; }
  render();
  window.__S = S; // para depuración
})();
