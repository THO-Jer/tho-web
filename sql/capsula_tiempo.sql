-- Tabla: capsula_tiempo
-- Usada para la dinámica de la Pecera de Deseos (tho.cl/deseos)
-- Inserción pública (anónima), lectura solo con service role key.

create table if not exists capsula_tiempo (
  id          uuid        default gen_random_uuid() primary key,
  mensaje     text        not null check (char_length(mensaje) between 1 and 300),
  evento      text        not null default 'aniversario_2026',
  created_at  timestamptz default now()
);

-- Índice para filtrar por evento rápidamente
create index if not exists capsula_tiempo_evento_idx on capsula_tiempo (evento, created_at desc);

-- Row Level Security: habilitado
alter table capsula_tiempo enable row level security;

-- Solo inserción pública (anónima). Sin lectura desde el cliente.
create policy "insertar_anonimo"
  on capsula_tiempo
  for insert
  with check (true);

-- Lectura solo con service role (no se expone al anon key)
-- No se crea policy de SELECT → solo service_role puede leer.
