-- ─────────────────────────────────────────────────────────────────────────────
-- Analítica del sitio (Studio Presencia)
--
-- Ejecutar una vez en Supabase → SQL Editor, DESPUÉS de sql/blog_analytics.sql.
-- Es idempotente: se puede volver a correr sin perder datos.
--
-- Privacidad: sin datos personales. Visitas y páginas se agregan por día; los
-- contactos guardan solo canal, fuente, página de entrada y la respuesta a
-- "¿Cómo supiste de THO?" (nunca nombre, email ni IP).
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Páginas vistas por día (una por página y visita).
create table if not exists public.web_page_views (
  day date not null,
  path text not null,
  views integer not null default 0,
  primary key (day, path)
);

-- 2) Visitas por día, canal, fuente y página de entrada.
create table if not exists public.web_sessions (
  day date not null,
  channel text not null,
  source text not null default '',
  landing_path text not null,
  sessions integer not null default 0,
  primary key (day, channel, source, landing_path)
);

create index if not exists web_page_views_day_idx on public.web_page_views(day);
create index if not exists web_sessions_day_idx on public.web_sessions(day);

alter table public.web_page_views enable row level security;
alter table public.web_sessions enable row level security;

create or replace function public.track_web_hit(
  p_day date,
  p_path text,
  p_page boolean,
  p_visit boolean,
  p_channel text,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_page then
    insert into public.web_page_views (day, path, views) values (p_day, p_path, 1)
    on conflict (day, path) do update set views = public.web_page_views.views + 1;
  end if;
  if p_visit then
    insert into public.web_sessions (day, channel, source, landing_path, sessions)
    values (p_day, p_channel, coalesce(p_source, ''), p_path, 1)
    on conflict (day, channel, source, landing_path) do update set sessions = public.web_sessions.sessions + 1;
  end if;
end;
$$;

-- 3) Contactos: se amplía la tabla del blog con el origen de cada contacto.
create table if not exists public.blog_lead_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  lead_type text not null,
  source text,
  slug text,
  slugs_read text[] not null default '{}'
);
alter table public.blog_lead_events enable row level security;

alter table public.blog_lead_events
  add column if not exists first_channel text,
  add column if not exists first_source text,
  add column if not exists first_landing text,
  add column if not exists last_channel text,
  add column if not exists last_source text,
  add column if not exists heard_from text,
  add column if not exists page_path text;

-- 4) Resumen para el panel.
create or replace function public.web_dashboard(p_from date, p_to date, p_prev_from date)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with
  s as (
    select * from public.web_sessions where day between p_prev_from and p_to
  ),
  leads as (
    select
      coalesce(first_channel, 'desconocido') as channel,
      first_landing,
      heard_from,
      (created_at at time zone 'America/Santiago')::date as day
    from public.blog_lead_events
    where (created_at at time zone 'America/Santiago')::date between p_prev_from and p_to
  )
  select jsonb_build_object(
    'channels', coalesce((
      select jsonb_agg(jsonb_build_object('channel', channel, 'sessions', cur, 'sessions_prev', prev) order by cur desc)
      from (
        select channel,
          coalesce(sum(sessions) filter (where day between p_from and p_to), 0)::int as cur,
          coalesce(sum(sessions) filter (where day < p_from), 0)::int as prev
        from s group by channel
      ) c
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('channel', channel, 'source', source, 'sessions', n) order by n desc)
      from (
        select channel, source, sum(sessions)::int as n
        from s where day between p_from and p_to and source <> ''
        group by channel, source
        order by n desc
        limit 20
      ) x
    ), '[]'::jsonb),
    'landings', coalesce((
      select jsonb_agg(jsonb_build_object('path', landing_path, 'sessions', n) order by n desc)
      from (
        select landing_path, sum(sessions)::int as n
        from s where day between p_from and p_to
        group by landing_path
        order by n desc
        limit 40
      ) x
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc)
      from (
        select path, sum(views)::int as n
        from public.web_page_views where day between p_from and p_to
        group by path
        order by n desc
        limit 40
      ) x
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', day, 'sessions', n) order by day)
      from (
        select day, sum(sessions)::int as n from s where day between p_from and p_to group by day
      ) d
    ), '[]'::jsonb),
    'views_total', (select coalesce(sum(views), 0)::int from public.web_page_views where day between p_from and p_to),
    'lead_channels', coalesce((
      select jsonb_agg(jsonb_build_object('channel', channel, 'leads', cur, 'leads_prev', prev) order by cur desc)
      from (
        select channel,
          count(*) filter (where day between p_from and p_to)::int as cur,
          count(*) filter (where day < p_from)::int as prev
        from leads group by channel
      ) c
    ), '[]'::jsonb),
    'lead_heard', coalesce((
      select jsonb_agg(jsonb_build_object('heard_from', heard_from, 'leads', n) order by n desc)
      from (
        select coalesce(heard_from, 'sin_respuesta') as heard_from, count(*)::int as n
        from leads where day between p_from and p_to
        group by 1
      ) h
    ), '[]'::jsonb),
    'lead_landings', coalesce((
      select jsonb_agg(jsonb_build_object('path', first_landing, 'leads', n) order by n desc)
      from (
        select first_landing, count(*)::int as n
        from leads where day between p_from and p_to and first_landing is not null
        group by first_landing
      ) l
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.track_web_hit(date, text, boolean, boolean, text, text) from public, anon, authenticated;
revoke all on function public.web_dashboard(date, date, date) from public, anon, authenticated;
grant execute on function public.track_web_hit(date, text, boolean, boolean, text, text) to service_role;
grant execute on function public.web_dashboard(date, date, date) to service_role;
