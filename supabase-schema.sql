-- C-LYN SOLUTIONS schema
-- Run this once in Supabase → SQL Editor → New query → Run

create table if not exists products (
  id text primary key,
  name text not null,
  category text default '',
  part_number text default '',
  price text default 'On request',
  description text default '',
  featured boolean default false,
  image text default '',
  updated_at timestamptz default now()
);

create table if not exists categories (
  id text primary key,
  name text not null,
  description text default '',
  image text default '',
  updated_at timestamptz default now()
);

create table if not exists promotions (
  id text primary key,
  title text not null,
  message text default '',
  percent int default 0,
  category text default '',
  image text default '',
  active boolean default true,
  end_date text default '',
  updated_at timestamptz default now()
);

create table if not exists settings (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists admin_users (
  id text primary key,
  name text not null,
  username text unique not null,
  password text not null,
  role text default 'admin'
);

create table if not exists activity_logs (
  id bigserial primary key,
  at timestamptz default now(),
  username text default 'Admin',
  action text default '',
  detail text default ''
);

create table if not exists analytics (
  id text primary key default 'main',
  data jsonb not null default '{"totalViews":0,"pages":{},"visits":[]}'::jsonb,
  updated_at timestamptz default now()
);

alter table products enable row level security;
alter table categories enable row level security;
alter table promotions enable row level security;
alter table settings enable row level security;
alter table admin_users enable row level security;
alter table activity_logs enable row level security;
alter table analytics enable row level security;

create policy "public_all_products" on products for all using (true) with check (true);
create policy "public_all_categories" on categories for all using (true) with check (true);
create policy "public_all_promotions" on promotions for all using (true) with check (true);
create policy "public_all_settings" on settings for all using (true) with check (true);
create policy "public_all_users" on admin_users for all using (true) with check (true);
create policy "public_all_logs" on activity_logs for all using (true) with check (true);
create policy "public_all_analytics" on analytics for all using (true) with check (true);

insert into admin_users (id, name, username, password, role)
values ('u1', 'Owner', 'admin', 'clyn2026', 'owner')
on conflict (id) do nothing;

insert into settings (id, data)
values ('main', '{
  "phone": "+260 965 018 323",
  "whatsapp": "260965018323",
  "email": "clynsolutions@gmail.com",
  "address": "Shop No. 1 Tattrin Building",
  "location": "Freetown Road, Kitwe, Zambia",
  "hours": "Mon–Fri: 07:00 – 17:00 · Sat: 08:00 – 13:00",
  "tagline": "Your solution is our Resolution",
  "about": "When a machine stops, work stops. C-LYN SOLUTIONS keeps mining and truck fleets moving with quality spare parts and fast response in Kitwe.",
  "heroImage": "",
  "promoEnabled": true
}'::jsonb)
on conflict (id) do nothing;

insert into analytics (id, data)
values ('main', '{"totalViews":0,"pages":{},"visits":[]}'::jsonb)
on conflict (id) do nothing;
