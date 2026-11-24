-- =====================================================================
--  Juego del surtido · tabla de partidas
--  Pegar en Supabase → SQL Editor → New query → Run
--  (se puede usar el mismo proyecto que el simulacro CRM: la tabla es nueva
--   y no toca las que ya existen)
-- =====================================================================

create table if not exists public.surtido_partidas (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  nombre        text    not null check (char_length(nombre) between 1 and 60),
  grupo         text    not null default '' check (char_length(grupo) <= 30),
  iniciales     text    not null check (iniciales ~ '^[A-Z0-9]{3}$'),
  idioma        text    not null check (idioma in ('es', 'en')),
  puntos        int     not null check (puntos between 0 and 550),
  porcentaje    int     not null check (porcentaje between 0 and 100),
  rango         text,
  pistas        int     not null default 0 check (pistas between 0 and 10),
  duracion_seg  int,
  rondas        jsonb   not null default '[]'::jsonb,   -- puntos, aciertos, pistas e ítems vistos por ronda
  fallos        jsonb   not null default '[]'::jsonb    -- cada fallo: ronda, ítem, respuesta dada, correcta
);

create index if not exists surtido_partidas_grupo_puntos on public.surtido_partidas (grupo, puntos desc);
create index if not exists surtido_partidas_fecha on public.surtido_partidas (created_at desc);

-- Seguridad: los alumnos (clave anon) solo pueden AÑADIR partidas y LEERLAS
-- (para el ranking). No pueden modificar ni borrar nada.
alter table public.surtido_partidas enable row level security;

drop policy if exists "surtido insertar" on public.surtido_partidas;
create policy "surtido insertar" on public.surtido_partidas
  for insert to anon, authenticated with check (true);

drop policy if exists "surtido leer" on public.surtido_partidas;
create policy "surtido leer" on public.surtido_partidas
  for select to anon, authenticated using (true);

-- Para borrar las partidas de prueba antes de clase (ejecutar a mano):
-- delete from public.surtido_partidas where grupo = 'PRUEBA';
