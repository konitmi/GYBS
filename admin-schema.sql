-- GYBS admin controls
-- Run this after your existing campaigns schema.
-- Then create an admin user in Supabase Dashboard > Authentication > Users.
-- Replace YOUR_AUTH_USER_UUID below with that user's UUID.

create table if not exists public.gybs_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.gybs_admins enable row level security;

create policy "GYBS admins can read their own row"
on public.gybs_admins
for select
to authenticated
using (user_id = auth.uid());

insert into public.gybs_admins (user_id)
values ('YOUR_AUTH_USER_UUID'::uuid)
on conflict (user_id) do nothing;

-- Public campaign pages should expose only live campaigns.
alter policy "GYBS public view campaigns"
on public.campaigns
using (status = 'live');

-- Admins can view every campaign.
create policy "GYBS admins can view all campaigns"
on public.campaigns
for select
to authenticated
using (exists (select 1 from public.gybs_admins a where a.user_id = auth.uid()));

-- Admins can approve, launch, expire or otherwise update campaigns.
create policy "GYBS admins can update campaigns"
on public.campaigns
for update
to authenticated
using (exists (select 1 from public.gybs_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.gybs_admins a where a.user_id = auth.uid()));
