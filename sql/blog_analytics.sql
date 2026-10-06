-- ─────────────────────────────────────────────────────────────────────────────
-- Analítica del blog (Studio Blog · Centro de comando)
--
-- Ejecutar una vez en Supabase → SQL Editor. Es idempotente: se puede volver a
-- correr sin perder datos.
--
-- Privacidad: estas tablas NO guardan datos personales. Las lecturas se agregan
-- por entrada y día, y los contactos solo registran tipo de formulario y qué
-- entradas había leído la persona (nunca nombre, email ni IP).
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Lecturas por entrada y día (zona horaria de Chile).
create table if not exists public.blog_post_views (
  slug text not null,
  day date not null,
  views integer not null default 0,
  primary key (slug, day)
);

create index if not exists blog_post_views_day_idx on public.blog_post_views(day);

alter table public.blog_post_views enable row level security;

-- Suma 1 lectura de forma atómica.
create or replace function public.increment_blog_view(p_slug text, p_day date)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.blog_post_views (slug, day, views)
  values (p_slug, p_day, 1)
  on conflict (slug, day) do update set views = public.blog_post_views.views + 1;
$$;

-- 2) Contactos (todos los formularios de la web) y su relación con el blog.
--    slug        = última entrada leída antes de escribir (último toque)
--    slugs_read  = todas las entradas leídas en los 30 días previos
create table if not exists public.blog_lead_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  lead_type text not null,
  source text,
  slug text,
  slugs_read text[] not null default '{}'
);

create index if not exists blog_lead_events_created_at_idx on public.blog_lead_events(created_at desc);

alter table public.blog_lead_events enable row level security;

-- 3) Resumen para el panel: una sola consulta con todo lo agregado.
create or replace function public.blog_dashboard(p_from date, p_to date, p_prev_from date)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with
  leads as (
    select
      e.slug as last_slug,
      e.slugs_read,
      (e.created_at at time zone 'America/Santiago')::date as day
    from public.blog_lead_events e
    where (e.created_at at time zone 'America/Santiago')::date between p_prev_from and p_to
  ),
  leads_cur as (
    select * from leads where day between p_from and p_to
  ),
  leads_prev as (
    select * from leads where day >= p_prev_from and day < p_from
  ),
  touched as (
    select l.last_slug, t.slug
    from leads_cur l,
    lateral (
      select distinct x as slug
      from unnest(array_append(coalesce(l.slugs_read, '{}'), l.last_slug)) as x
      where x is not null
    ) t
  )
  select jsonb_build_object(
    'views', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'views', views))
      from (
        select slug, sum(views)::int as views
        from public.blog_post_views
        where day between p_from and p_to
        group by slug
      ) v
    ), '[]'::jsonb),
    'views_prev', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'views', views))
      from (
        select slug, sum(views)::int as views
        from public.blog_post_views
        where day >= p_prev_from and day < p_from
        group by slug
      ) v
    ), '[]'::jsonb),
    'views_total', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'views', views))
      from (
        select slug, sum(views)::int as views
        from public.blog_post_views
        group by slug
      ) v
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', day, 'views', views) order by day)
      from (
        select day, sum(views)::int as views
        from public.blog_post_views
        where day between p_from and p_to
        group by day
      ) d
    ), '[]'::jsonb),
    'leads', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'last_touch', last_touch, 'assisted', assisted))
      from (
        select
          slug,
          count(*) filter (where slug = last_slug)::int as last_touch,
          count(*)::int as assisted
        from touched
        group by slug
      ) s
    ), '[]'::jsonb),
    'leads_total', (select count(*)::int from leads_cur),
    'leads_with_blog', (
      select count(*)::int from leads_cur
      where last_slug is not null or cardinality(slugs_read) > 0
    ),
    'leads_prev_total', (select count(*)::int from leads_prev),
    'leads_prev_with_blog', (
      select count(*)::int from leads_prev
      where last_slug is not null or cardinality(slugs_read) > 0
    )
  );
$$;

-- Solo el backend (service role) puede ejecutar estas funciones.
revoke all on function public.increment_blog_view(text, date) from public, anon, authenticated;
revoke all on function public.blog_dashboard(date, date, date) from public, anon, authenticated;
grant execute on function public.increment_blog_view(text, date) to service_role;
grant execute on function public.blog_dashboard(date, date, date) to service_role;
