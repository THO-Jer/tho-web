create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  minutes integer not null default 5,
  tags text[] not null default '{}',
  category text,
  status text not null check (status in ('draft','published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  cover_image text,
  cover_image_alt text,
  seo_title text,
  seo_description text
);

create index if not exists blog_posts_status_idx on public.blog_posts(status);
create index if not exists blog_posts_updated_at_idx on public.blog_posts(updated_at desc);


-- safe migration for existing tables
alter table public.blog_posts add column if not exists category text;
