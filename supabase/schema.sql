-- TechBlog database schema for Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  content       text not null default '',
  category      text not null,
  cover_image   text,
  published      boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_published_idx on public.posts (published, published_at desc);

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Row Level Security: the public (anon) client can only read PUBLISHED posts.
-- All writes happen server-side with the service role key, which bypasses RLS.
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  using (published = true);

-- ---------------------------------------------------------------------------
-- Optional seed data so the site isn't empty on first run.
-- ---------------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, category, published, published_at)
values
(
  'Welcome to TechBlog',
  'welcome-to-techblog',
  'Why I started this blog and what to expect: daily notes on tech, security, and the stacks I build with.',
  E'# Welcome\n\nThis is my personal space to write a short post every day about something I learned in **new technology**, **cyber security**, or the **stacks** I work with — Node, AWS, React, Next.js, JavaScript, IoT and blockchain.\n\n## What to expect\n\n- Short, practical notes\n- Code snippets I actually use\n- Security gotchas worth remembering\n\nThanks for reading!',
  'new-tech',
  true,
  now()
),
(
  'JWT Auth Pitfalls Worth Knowing',
  'jwt-auth-pitfalls',
  'A few common mistakes when using JSON Web Tokens for sessions, and how to avoid them.',
  E'# JWT Auth Pitfalls\n\nJWTs are convenient but easy to misuse.\n\n## 1. Storing tokens in localStorage\n\nPrefer httpOnly cookies so JavaScript (and XSS) cannot read the token.\n\n## 2. Long-lived tokens\n\nKeep expiry short and rotate. Treat the secret like a password.\n\n## 3. Skipping signature verification\n\nAlways verify with a strong secret or key pair.',
  'cyber-security',
  true,
  now() - interval '1 day'
),
(
  'Deploying a Next.js App to AWS',
  'deploying-nextjs-to-aws',
  'A high-level look at the options for running Next.js on AWS, from Amplify to containers.',
  E'# Deploying Next.js to AWS\n\nThere are several solid paths:\n\n- **AWS Amplify Hosting** — easiest, Git-based.\n- **ECS / Fargate** — containerized, more control.\n- **Lambda + CloudFront** — serverless via adapters.\n\nPick based on how much infrastructure you want to manage.',
  'aws',
  true,
  now() - interval '2 days'
);

-- ---------------------------------------------------------------------------
-- Leads: inbound "work with us" enquiries from the home page form.
-- Captured server-side with the secret key. RLS is ON with NO policies, so the
-- public/publishable client can neither read nor write — leads stay private.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  budget      text,
  timeline    text,
  message     text not null,
  source      text not null default 'home',
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- (Intentionally no policies — only the server-side secret key may access leads.)
