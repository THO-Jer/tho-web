-- 1) Tabla de editores permitidos para THO Studio
create table if not exists public.blog_editors (
  email text primary key,
  role text not null default 'editor' check (role in ('editor','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Índice auxiliar opcional por estado
create index if not exists blog_editors_active_idx on public.blog_editors (active);

-- 3) RLS (opcional para uso futuro desde clientes autenticados)
alter table public.blog_editors enable row level security;

-- bloquea acceso público por defecto
revoke all on public.blog_editors from anon, authenticated;

-- permite lectura al usuario autenticado de su propio email (si luego usan frontend directo)
drop policy if exists "read own editor row" on public.blog_editors;
create policy "read own editor row"
on public.blog_editors
for select
to authenticated
using (lower(email) = lower(auth.jwt()->>'email'));

-- 4) Seed inicial (reemplazar por los mails reales)
insert into public.blog_editors (email, role, active)
values
  ('editor1@tho.cl', 'admin', true),
  ('editor2@tho.cl', 'editor', true),
  ('editor3@tho.cl', 'editor', true)
on conflict (email) do update
set role = excluded.role,
    active = excluded.active;
