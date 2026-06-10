-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- to enable the home-page "Work with us" lead form.

create extension if not exists "pgcrypto";

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

-- RLS on, no policies: only the server-side secret key can read/write leads.
alter table public.leads enable row level security;
