-- ClickInsights.AI — Supabase Schema
-- Run this in Supabase → SQL Editor

-- Sites table (one row per customer website)
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  domain text not null,
  created_at timestamptz default now()
);

-- Events table (every tracker.js event lands here)
create table if not exists events (
  id bigserial primary key,
  site_id text not null,
  session_id text not null,
  type text not null, -- 'pageview' | 'click' | 'exit'
  url text,
  referrer text,
  occurred_at timestamptz not null,
  screen text,
  device text,
  title text,
  x_pct integer,
  y_pct integer,
  element_tag text,
  element_text text,
  rage_click boolean default false,
  time_on_page integer, -- milliseconds
  scroll_depth integer,  -- 0-100
  created_at timestamptz default now()
);

-- Index for fast queries by site
create index if not exists events_site_id_idx on events(site_id);
create index if not exists events_occurred_at_idx on events(occurred_at desc);

-- Subscriptions table (Stripe)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free', -- 'free' | 'pro' | 'business'
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table sites enable row level security;
alter table subscriptions enable row level security;

create policy "Users can manage their own sites"
  on sites for all using (auth.uid() = user_id);

create policy "Users can view their own subscription"
  on subscriptions for select using (auth.uid() = user_id);

-- Events are public insert (tracker.js runs on customer sites, no auth)
-- Use service role key in api/track.js to bypass RLS for inserts
alter table events enable row level security;
create policy "Service role can insert events"
  on events for insert with check (true);
create policy "Users can read events for their sites"
  on events for select using (
    site_id in (select id::text from sites where user_id = auth.uid())
  );
