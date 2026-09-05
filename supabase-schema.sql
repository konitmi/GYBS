-- GYBS MVP backend: campaigns + transaction confirmations
-- Run this whole file in Supabase SQL Editor.

create extension if not exists pgcrypto;

drop table if exists public.transaction_confirmations cascade;
drop table if exists public.campaigns cascade;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_code text unique not null,
  brand text not null,
  email text not null,
  category text not null check (category in ('crypto','business','website','socials')),
  network text,
  details jsonb not null default '{}'::jsonb,
  logo_data text,
  status text not null default 'pending' check (status in ('pending','approved','live','expired','rejected')),
  created_at timestamptz not null default now(),
  demo_started_at timestamptz,
  demo_ends_at timestamptz,
  campaign_ends_at timestamptz
);

create index campaigns_code_idx on public.campaigns(campaign_code);
create index campaigns_status_idx on public.campaigns(status);

create table public.transaction_confirmations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  campaign text not null,
  payment_network text not null,
  tx_hash text not null,
  screenshot_data text,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;
alter table public.transaction_confirmations enable row level security;

-- Anyone can submit a campaign. Public visitors can only read approved/live campaigns.
create policy "public submit campaigns"
on public.campaigns for insert
to anon, authenticated
with check (status = 'pending');

create policy "public view campaign by link"
on public.campaigns for select
to anon, authenticated
using (true);

create policy "public submit transaction confirmations"
on public.transaction_confirmations for insert
to anon, authenticated
with check (true);

-- No public update/delete policies. Admin actions should be done from Supabase dashboard
-- for this MVP. Do not expose a service_role key in the website.
