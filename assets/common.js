// =====================================================================
//  Textos de interfaz (ES/EN), utilidades y conexión a Supabase
// =====================================================================

window.TXT = {
  es: {
    titulo: "Primer día en el súper",
    elegirIdioma: "Elige idioma",
    tuNombre: "Tu nombre y apellido",
    tuGrupo: "Tu grupo",
    empezarJuego: "Entrar a trabajar",
    reglasTitulo: "Cómo funciona",
    reglas: [
      "5 rondas cronometradas, de menos a más difícil.",
      "Cada ronda vale 100 puntos. Si terminas antes de tiempo ganas hasta +10 de bonus.",
      "Tienes 2 pistas por ronda. Cada pista cuesta 10 puntos.",
      "Si se acaba el tiempo, lo que no hayas colocado cuenta como fallo.",
      "Al final verás tus fallos explicados y entrarás en el ranking."
    ],
    ronda: "Ronda",
    pista: "Pista",
    pistasQuedan: n => (n === 1 ? "queda 1" : `quedan ${n}`),
    sinPistas: "Sin pistas",
    empezar: "¡Empezar!",
    listo: "¡Listo, he terminado!",
    siguiente: "Siguiente",
    siguienteRonda: "Siguiente ronda",
    verResultados: "Ver resultados",
    tiempo: "Tiempo",
    puntos: "Puntos",
    aciertos: "Aciertos",
    base: "Puntos por aciertos",
    bonus: "Bonus de tiempo",
    penalizacion: "Pistas usadas",
    totalRonda: "Total de la ronda",
    seAcaboTiempo: "¡Se acabó el tiempo!",
    bandeja: "Productos por colocar",
    bandejaVacia: "¡Todo colocado! Revisa y pulsa «Listo».",
    instrSeleccion: "Arrastra cada producto o tócalo y luego toca su destino. Para devolverlo, tócalo y toca esta bandeja.",
    pasillo: "Pasillo",
    producto: "Producto",
    termino: "Término",
    queNivel: "¿A qué nivel pertenece este término?",
    nivel: "Nivel",
    referenciaN: (i, n) => `Referencia ${i} de ${n}`,
    tarjetas: "Tarjetas",
    lineal: (i, n) => `Lineal ${i} de ${n}`,
    queCriterio: "¿Con qué criterio está organizado este lineal?",
    encargo: (i, n) => `Encargo ${i} de ${n}`,
    criterioPedido: "Criterio",
    balda: "Balda",
    cerrar: "Entendido",
    pistaDe: "Pista de Don Ramón",
    pista2Hecha: {
      1: "Don Ramón ha colocado un producto por ti (marcado con 🔒).",
      2: "Don Ramón ha tachado 4 opciones incorrectas.",
      3: "Don Ramón ha señalado la tarjeta intrusa: no pertenece a este producto.",
      4: "Don Ramón ha tachado 2 opciones incorrectas.",
      5: "Don Ramón ha colocado un producto por ti (marcado con 🔒)."
    },
    resultadoFinal: "Fin de la jornada",
    puntuacion: "Puntuación",
    tuPuesto: "Tu puesto en el súper",
    porRonda: "Puntos por ronda",
    iniciales: "Escribe tus iniciales",
    guardar: "Guardar en el ranking",
    guardando: "Guardando…",
    guardado: "¡Guardado!",
    errorGuardar: "No se ha podido guardar la partida. Avisa al profesor.",
    modoPrueba: "Modo prueba: sin conexión a Supabase, las partidas se guardan solo en este navegador.",
    ranking: "TOP 10",
    revision: "Revisa tus fallos",
    sinFallos: "¡Ni un solo fallo en esta ronda!",
    tuRespuesta: "Tu respuesta",
    correcta: "Correcta",
    sinColocar: "Sin colocar",
    jugarOtraVez: "Jugar otra vez",
    rondaNombres: ["Descarga el camión", "¿Qué nivel es?", "Ficha de la referencia", "Lee el lineal", "El encargo del jefe"],
    rangos: [
      [90, "Category Manager del mes", "🏆", "¡Increíble! Te voy a poner la foto en la entrada del súper."],
      [75, "Category Manager", "🥇", "Muy buen trabajo. Mañana te dejo una categoría entera a tu cargo."],
      [60, "Jefe de sección", "🥈", "Bien hecho. Algún despiste, pero el súper puede abrir."],
      [40, "Reponedor", "🥉", "Vamos mejorando, pero los clientes van a buscar algunas cosas por todo el súper."],
      [0, "Reponedor en prácticas", "📦", "Hoy ha sido duro. Repasa los fallos y vuelve a intentarlo."]
    ],
    comentario: p => p >= 80 ? "¡Así me gusta! Esto parece un súper de verdad." : p >= 50 ? "No está mal, pero algunos productos me los encuentro donde no toca." : "Uy… vamos a tener quejas de los clientes. ¡Ánimo con la siguiente!",
    briefing: [
      { t: "¡Bienvenido a «La Despensa»! Ha llegado el camión y abrimos en nada. Coloca cada producto en el pasillo (la sección) donde lo buscaría un cliente.",
        a: "Arrastra 14 productos a sus 9 pasillos." },
      { t: "Ahora repasemos cómo organizamos el surtido. Te enseño un producto y un término de su ficha: dime a qué nivel de la jerarquía pertenece.",
        a: "10 preguntas rápidas. Respuesta inmediata." },
      { t: "Necesito las fichas completas de tres productos nuevos. Coloca cada tarjeta en su nivel, de la División a la Referencia. Cuidado: en cada ficha se ha colado una tarjeta que no es de ese producto.",
        a: "3 productos, 8 niveles cada uno, 1 tarjeta intrusa por producto." },
      { t: "Mi encargado ha montado unos lineales y no me ha dicho cómo los ha organizado. Míralos y dime qué criterio de clasificación ha usado.",
        a: "5 lineales. Elige el criterio de cada uno." },
      { t: "Último encargo del día: te pido que organices dos categorías con un criterio concreto. Fíjate solo en el criterio que te pido.",
        a: "2 encargos de 6 productos cada uno." }
    ],
    teoria: {
      1: "La sección (nivel 3) agrupa los productos que el cliente busca juntos. Pregúntate: ¿necesita frío? ¿está congelado? ¿se conserva a temperatura ambiente? ¿es para comer, para limpiar la casa o para el cuidado de la persona?",
      2: "Los 8 niveles, de lo general a lo concreto, con el ejemplo de clase:\n1 División: Alimentación\n2 Departamento: Productos refrigerados\n3 Sección: Productos lácteos frescos\n4 Categoría: Yogures\n5 Subcategoría: Yogures desnatados\n6 Familia: Yogur desnatado sabor fresa\n7 Subfamilia: … marca Danone\n8 Referencia: … pack 4",
      3: "De lo general a lo concreto: División → Departamento → Sección → Categoría → Subcategoría → Familia → Subfamilia → Referencia. La subfamilia suele añadir la marca y la referencia el formato exacto (tamaño, pack). Los niveles clave son Sección, Categoría y Referencia. Ojo: una de las tarjetas no pertenece a este producto.",
      4: "Criterios de clasificación:\n🧑‍🤝‍🧑 Consumidor: sexo, edad, condición física, nivel socioeconómico, actitud psicológica.\n⏰ Consumo: momento de consumo, forma de uso, envase, unidad de consumo, tipo de aplicador.\n🏷️ Condiciones de venta: precio, formato de venta.\n📦 Producto: beneficio, composición, sabor, tecnología, marca, origen…",
      5: c => `El encargo pide clasificar ${c.es.toLowerCase()}: ${c.detEs}. Fíjate solo en eso: la marca, el precio u otros datos del envase pueden despistarte si no son lo que se pide.`
    }
  },
  en: {
    titulo: "First day at the supermarket",
    elegirIdioma: "Choose your language",
    tuNombre: "Your full name",
    tuGrupo: "Your group",
    empezarJuego: "Start your shift",
    reglasTitulo: "How it works",
    reglas: [
      "5 timed rounds, from easier to harder.",
      "Each round is worth 100 points. Finish early and earn up to +10 bonus.",
      "You have 2 hints per round. Each hint costs 10 points.",
      "When time runs out, anything not placed counts as a mistake.",
      "At the end you will see your mistakes explained and join the high-score table."
    ],
    ronda: "Round",
    pista: "Hint",
    pistasQuedan: n => (n === 1 ? "1 left" : `${n} left`),
    sinPistas: "No hints left",
    empezar: "Start!",
    listo: "Done, I've finished!",
    siguiente: "Next",
    siguienteRonda: "Next round",
    verResultados: "See results",
    tiempo: "Time",
    puntos: "Points",
    aciertos: "Correct",
    base: "Points for correct answers",
    bonus: "Time bonus",
    penalizacion: "Hints used",
    totalRonda: "Round total",
    seAcaboTiempo: "Time's up!",
    bandeja: "Products to place",
    bandejaVacia: "Everything placed! Check it and press 'Done'.",
    instrSeleccion: "Drag each product, or tap it and then tap where it goes. To send it back, tap it and tap this tray.",
    pasillo: "Aisle",
    producto: "Product",
    termino: "Term",
    queNivel: "Which level does this term belong to?",
    nivel: "Level",
    referenciaN: (i, n) => `Product ${i} of ${n}`,
    tarjetas: "Cards",
    lineal: (i, n) => `Shelf ${i} of ${n}`,
    queCriterio: "Which criterion was used to organise this shelf?",
    encargo: (i, n) => `Order ${i} of ${n}`,
    criterioPedido: "Criterion",
    balda: "Shelf",
    cerrar: "Got it",
    pistaDe: "Hint from Don Ramón",
    pista2Hecha: {
      1: "Don Ramón has placed one product for you (marked 🔒).",
      2: "Don Ramón has crossed out 4 wrong options.",
      3: "Don Ramón has pointed out the intruder card: it does not belong to this product.",
      4: "Don Ramón has crossed out 2 wrong options.",
      5: "Don Ramón has placed one product for you (marked 🔒)."
    },
    resultadoFinal: "End of your shift",
    puntuacion: "Score",
    tuPuesto: "Your job title",
    porRonda: "Points per round",
    iniciales: "Enter your initials",
    guardar: "Save to high scores",
    guardando: "Saving…",
    guardado: "Saved!",
    errorGuardar: "Your game could not be saved. Please tell your teacher.",
    modoPrueba: "Test mode: no Supabase connection, games are only saved in this browser.",
    ranking: "TOP 10",
    revision: "Review your mistakes",
    sinFallos: "Not a single mistake in this round!",
    tuRespuesta: "Your answer",
    correcta: "Correct",
    sinColocar: "Not placed",
    jugarOtraVez: "Play again",
    rondaNombres: ["Unload the truck", "Which level is it?", "Product file", "Read the shelf", "The boss's order"],
    rangos: [
      [90, "Category Manager of the month", "🏆", "Amazing! I'm putting your photo by the entrance."],
      [75, "Category Manager", "🥇", "Great job. Tomorrow you get a whole category to run."],
      [60, "Section manager", "🥈", "Well done. A few slips, but the store can open."],
      [40, "Shelf stacker", "🥉", "Getting better, but customers will be hunting all over the store for some items."],
      [0, "Trainee shelf stacker", "📦", "Tough day. Review your mistakes and try again."]
    ],
    comentario: p => p >= 80 ? "That's what I like! This looks like a real supermarket." : p >= 50 ? "Not bad, but I'm finding some products where they shouldn't be." : "Oops… customers are going to complain. Good luck with the next one!",
    briefing: [
      { t: "Welcome to 'La Despensa'! The truck has arrived and we open any minute. Put each product in the aisle (the section) where a customer would look for it.",
        a: "Drag 14 products into their 9 aisles." },
      { t: "Now let's review how we organise the assortment. I'll show you a product and a term from its file: tell me which level of the hierarchy it belongs to.",
        a: "10 quick questions. Instant feedback." },
      { t: "I need the full files for three new products. Put each card on its level, from Division down to Reference. Careful: each file has one card that doesn't belong to that product.",
        a: "3 products, 8 levels each, 1 intruder card per product." },
      { t: "My assistant set up some shelves and didn't tell me how he organised them. Look at them and tell me which classification criterion he used.",
        a: "5 shelves. Choose the criterion for each one." },
      { t: "Last order of the day: organise two categories using a specific criterion. Focus only on the criterion I ask for.",
        a: "2 orders with 6 products each." }
    ],
    teoria: {
      1: "The section (level 3) groups the products customers look for together. Ask yourself: does it need to be chilled? Is it frozen? Is it stored at room temperature? Is it for eating, for cleaning the house or for personal care?",
      2: "The 8 levels, from general to specific, with the class example:\n1 Division: Food\n2 Department: Refrigerated\n3 Section: Fresh dairy products\n4 Category: Yogurts\n5 Subcategory: Skimmed yogurts\n6 Family: Strawberry skimmed yogurt\n7 Subfamily: Danone strawberry fat-free yogurt\n8 Reference: … pack of 4",
      3: "From general to specific: Division → Department → Section → Category → Subcategory → Family → Subfamily → Reference. The subfamily usually adds the brand and the reference adds the exact format (size, pack). The key levels are Section, Category and Reference. Careful: one of the cards does not belong to this product.",
      4: "Classification criteria:\n🧑‍🤝‍🧑 Consumer: sex, age, physical condition, socioeconomic level, psychological attitude.\n⏰ Consumption: time of consumption, method of use, packaging, unit of consumption, applicator type.\n🏷️ Sales conditions: price, sales format.\n📦 Product: benefit, composition, flavour, technology, brand, origin…",
      5: c => `This order asks you to classify ${c.en.toLowerCase()}: ${c.detEn}. Focus only on that: brand, price or other details on the pack may distract you if they are not what is being asked.`
    }
  }
};

// ---------- utilidades ----------
window.U = {
  shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  pick(a) { return a[Math.floor(Math.random() * a.length)]; },
  esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); },
  mmss(s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); },
  param(k) { try { return new URLSearchParams(location.search).get(k) || ""; } catch (e) { return ""; } },
  ls: {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  },
  normName(s) { return String(s || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " "); },
  rango(pct, lang) { return TXT[lang].rangos.find(r => pct >= r[0]); }
};

// ---------- Descripción legible de un fallo (juego y panel del profesor) ----------
window.describeFallo = function (f, lang) {
  const B = BANCO, L = lang;
  const nivelTxt = n => { const v = B.NIVELES[n - 1]; return v ? `${n} · ${v[L]}` : "—"; };
  const termTxt = id => {
    if (!id) return null;
    const [cid, n] = id.split("-"); const c = B.CADENAS.find(x => x.id === cid);
    return c ? c.t[+n - 1][L === "es" ? 0 : 1] : id;
  };
  const crit = id => { const c = B.CRITERIOS.find(x => x.id === id); return c ? `${c.icon} ${c[L]}` : null; };
  const none = TXT[L].sinColocar;
  if (f.r === 1) {
    const p = B.PRODUCTOS.find(x => x.id === f.item); const sec = id => { const s = B.SECCIONES.find(x => x.id === id); return s ? `${s.icon} ${s[L]}` : null; };
    return { q: p ? `${p.icon} ${p[L]}` : f.item, dada: sec(f.dada) || none, ok: sec(f.correcta), exp: p ? (L === "es" ? p.expEs : p.expEn) : "" };
  }
  if (f.r === 2) {
    const [cid] = f.item.split("-"); const c = B.CADENAS.find(x => x.id === cid);
    return { q: `«${termTxt(f.item)}» (${c ? (L === "es" ? c.refEs : c.refEn) : ""})`, dada: f.dada ? nivelTxt(+f.dada) : none, ok: nivelTxt(+f.correcta),
      exp: L === "es" ? "Recuerda el orden: División, Departamento, Sección, Categoría, Subcategoría, Familia, Subfamilia, Referencia." : "Remember the order: Division, Department, Section, Category, Subcategory, Family, Subfamily, Reference." };
  }
  if (f.r === 3) {
    const [cid, n] = f.item.split("-"); const c = B.CADENAS.find(x => x.id === cid);
    const trap = f.dada && f.dada.split("-")[0] !== cid;
    return { q: `${c ? c.icon + " " + (L === "es" ? c.refEs : c.refEn) : ""} → ${nivelTxt(+n)}`, dada: f.dada ? `«${termTxt(f.dada)}»` : none, ok: `«${termTxt(f.correcta)}»`,
      exp: trap ? (L === "es" ? "Esa era la tarjeta intrusa: pertenece a otro producto." : "That was the intruder card: it belongs to another product.") : "" };
  }
  if (f.r === 4) {
    const l = B.LINEALES.find(x => x.id === f.item);
    return { q: l ? `${l.icon} ${L === "es" ? l.catEs : l.catEn}: ${l.baldas.map(b => b[L === "es" ? 0 : 1]).join(" / ")}` : f.item,
      dada: crit(f.dada) || none, ok: l ? `${crit(l.crit)} (${L === "es" ? l.varEs : l.varEn})` : crit(f.correcta), exp: l ? (L === "es" ? l.expEs : l.expEn) : "" };
  }
  if (f.r === 5) {
    const e = B.ENCARGOS.find(x => x.productos.some(p => p[0] === f.item));
    const p = e && e.productos.find(x => x[0] === f.item);
    const balda = id => { const b = e && e.baldas.find(x => x[0] === id); return b ? b[L === "es" ? 1 : 2] : null; };
    return { q: p ? `${p[1]} ${L === "es" ? p[2] : p[3]} (${L === "es" ? e.catEs : e.catEn})` : f.item, dada: balda(f.dada) || none, ok: balda(f.correcta), exp: p ? (L === "es" ? p[5] : p[6]) : "" };
  }
  return { q: f.item, dada: f.dada || none, ok: f.correcta, exp: "" };
};

// ---------- Base de datos (Supabase REST, con respaldo local) ----------
window.DB = (function () {
  const C = window.CONFIG || {};
  const url = (C.SUPABASE_URL || "").replace(/\/$/, "");
  const key = C.SUPABASE_ANON_KEY || "";
  const enabled = !!(url && key);
  const T = "surtido_partidas";
  const LKEY = "surtido_partidas_local";
  // Las claves nuevas (sb_publishable_...) no son JWT: solo van en "apikey"
  const H = () => (key.startsWith("sb_") ? { apikey: key, "Content-Type": "application/json" } : { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" });

  async function save(row) {
    if (!enabled) {
      const all = U.ls.get(LKEY, []); row = Object.assign({ id: Date.now(), created_at: new Date().toISOString() }, row);
      all.push(row); U.ls.set(LKEY, all); return row;
    }
    const r = await fetch(`${url}/rest/v1/${T}`, { method: "POST", headers: Object.assign(H(), { Prefer: "return=representation" }), body: JSON.stringify(row) });
    if (!r.ok) throw new Error("HTTP " + r.status + " · " + (await r.text()));
    const d = await r.json(); return d[0];
  }
  async function list({ grupo, desde, limit } = {}) {
    if (!enabled) {
      let all = U.ls.get(LKEY, []);
      if (grupo) all = all.filter(x => x.grupo === grupo);
      if (desde) all = all.filter(x => x.created_at >= desde);
      return all.sort((a, b) => b.puntos - a.puntos);
    }
    const q = new URLSearchParams();
    q.set("select", "*"); q.set("order", "puntos.desc,created_at.asc"); q.set("limit", String(limit || 2000));
    if (grupo) q.set("grupo", "eq." + grupo);
    if (desde) q.set("created_at", "gte." + desde);
    const r = await fetch(`${url}/rest/v1/${T}?${q}`, { headers: H() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
  // Mejor partida de cada alumno (nombre + grupo)
  async function top({ grupo, n = 10 } = {}) {
    const all = await list({ grupo, limit: 1000 });
    const seen = new Set(), out = [];
    for (const x of all) { const k = U.normName(x.nombre) + "|" + (x.grupo || ""); if (seen.has(k)) continue; seen.add(k); out.push(x); if (out.length >= n) break; }
    return out;
  }
  return { enabled, save, list, top };
})();
