# Migración a Supabase (Canal Confidencial + Access Control)

## 1) Variables de entorno requeridas

Configura en producción:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STUDIO_AUTH_REDIRECT_URL` (ej: `https://tho-web.vercel.app/studio`)
- `NEXT_PUBLIC_STUDIO_AUTH_REDIRECT_URL` (ej: `https://tho-web.vercel.app/studio/auth/callback`)
- `NEXT_PUBLIC_STUDIO_URL` (ej: `https://tho-web.vercel.app`)
- `STUDIO_ROLES_TABLE=studio_roles`
- `STUDIO_LOGIN_LOGS_TABLE=studio_login_logs`
- `STUDIO_ACCESS_REQUESTS_TABLE=studio_access_requests`
- `INCIDENTS_TABLE=incidents`
- `INCIDENT_EVENTS_TABLE=incident_events`
- `INCIDENT_ATTACHMENTS_TABLE=incident_attachments`

Opcionales:

- `INCIDENTS_NOTIFY_EMAILS` (lista separada por coma)
- `RESEND_API_KEY`
- `MAIL_FROM`

## 2) SQL de tablas mínimas

```sql
create table if not exists public.studio_roles (
  email text primary key,
  role text not null default 'member',
  active boolean not null default true,
  blocked boolean not null default false,
  provider text not null default 'any', -- hint de origen, no bloqueo duro de auth
  can_blog boolean not null default false,
  can_crm boolean not null default false,
  can_incidents boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_login_logs (
  id bigserial primary key,
  at timestamptz not null default now(),
  email text not null,
  provider text not null,
  ip text
);

create table if not exists public.studio_access_requests (
  id bigserial primary key,
  email text not null,
  provider text not null default 'any', -- hint de origen, no bloqueo duro de auth
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.incidents (
  id uuid primary key,
  case_code text unique not null,
  tracking_code text unique not null,
  tracking_pin_hash text not null,
  type text not null,
  description text not null,
  event_date date not null,
  involved_people text,
  anonymous boolean not null default true,
  reporter_email text,
  created_at timestamptz not null default now(),
  status text not null,
  process_phase text not null,
  urgency_level text not null,
  suggested_action text not null,
  internal_suggestion_urgency text,
  internal_suggestion_action text,
  director_notes text,
  director_only_notes text,
  last_updated_at timestamptz not null default now(),
  ip_hash text
);

create table if not exists public.incident_events (
  id bigserial primary key,
  incident_id uuid not null references public.incidents(id) on delete cascade,
  at timestamptz not null default now(),
  actor_kind text not null,
  actor_email text,
  actor text not null,
  action text not null,
  detail text
);

create table if not exists public.incident_attachments (
  id bigserial primary key,
  incident_id uuid not null references public.incidents(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);
```

## 3) Auth único

- Internos: usar botón Microsoft (`provider=azure`) en `/studio`.
- Externos: usar botón "Enviar magic link" en `/studio`.
- OAuth Microsoft usa `STUDIO_AUTH_REDIRECT_URL` hacia Studio.
- Magic Link usa explícitamente `NEXT_PUBLIC_STUDIO_AUTH_REDIRECT_URL` (recomendado: `https://tho-web.vercel.app/studio/auth/callback`).
- En Supabase Auth > URL Configuration, agregar `https://tho-web.vercel.app/studio` y `https://tho-web.vercel.app/studio/auth/callback` en Redirect URLs permitidas.
- La autorización final depende de `studio_roles` + superadmins por `STUDIO_SUPERADMINS`.

## 4) Permisos por rol

- `superadmin`: control total
- `director` / `rrhh_admin`: acceso de gestión según flags
- `member`: acceso según `can_*`

## 5) Reglas de trazabilidad

- No editar relato original (`incidents.description`).
- Todo cambio de gestión se registra en `incident_events`.
- Adjuntos en `incident_attachments` (y/o Supabase Storage con URL en esa tabla).

## 6) Checklist de validación

1. Crear usuario en Auth (Microsoft o magic link)
2. Insertar/actualizar fila en `studio_roles` para su email
3. Iniciar sesión en `/studio`
4. Crear incidente desde `/canal-confidencial`
5. Verificar filas en `incidents`, `incident_events` y, si aplica, `incident_attachments`


## 7) Seguridad de acceso a datos

- No consultar tablas sensibles desde el cliente web.
- Mantener operaciones sensibles (roles, incidentes, eventos, adjuntos) exclusivamente vía API server-side.
- Activar RLS en tablas de negocio y usar service role sólo en API server-side.
