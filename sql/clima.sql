-- Encuesta de Clima Organizacional THO
-- Acceso: miembros autenticados de Studio responden (anónimamente).
-- Admin gestiona rondas y lee resultados desde /studio/dinamicas/clima.

-- Tabla de rondas
create table if not exists clima_ronda (
  id          uuid        default gen_random_uuid() primary key,
  nombre      text        not null,                        -- ej: "Clima Q2 2026"
  estado      text        not null default 'activa'        -- 'activa' | 'cerrada'
                          check (estado in ('activa', 'cerrada')),
  created_at  timestamptz default now(),
  cerrada_at  timestamptz
);

-- Solo puede haber una ronda activa a la vez (se gestiona desde la app)
create index if not exists clima_ronda_estado_idx on clima_ronda (estado);

-- Tabla de respuestas (completamente anónimas: sin user_id ni email)
create table if not exists clima_respuesta (
  id          uuid        default gen_random_uuid() primary key,
  ronda_id    uuid        not null references clima_ronda(id) on delete cascade,
  respuestas  jsonb       not null,  -- { "q1": 4, "q2": 3, ..., "comentario": "texto libre" }
  created_at  timestamptz default now()
);

create index if not exists clima_respuesta_ronda_idx on clima_respuesta (ronda_id, created_at desc);

-- RLS: habilitado en ambas tablas
alter table clima_ronda    enable row level security;
alter table clima_respuesta enable row level security;

-- Rondas: lectura pública (para que el cliente sepa si hay ronda activa)
create policy "leer_rondas"
  on clima_ronda for select using (true);

-- Respuestas: inserción libre (cualquier usuario autenticado de Studio puede responder)
create policy "insertar_respuesta"
  on clima_respuesta for insert with check (true);

-- Lectura de respuestas: solo service role (admin lee desde la API con service key)
-- No se crea policy SELECT en clima_respuesta → solo service_role puede leer.
