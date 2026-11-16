-- MpaMpe Supabase/Postgres schema
-- Apply this in Supabase SQL Editor or through a reviewed migration.
-- The platform writes payments server-side; browser code must never mark
-- donations successful.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role text not null default 'donor'
    check (role in ('donor', 'organizer', 'maverick', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on profiles
for each row execute function public.set_updated_at();

create table if not exists campaign_applications (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) on delete set null,
  organizer_name text not null,
  email text not null,
  phone text not null,
  campaign_title text not null,
  category text not null,
  location text not null,
  goal_amount bigint not null check (goal_amount >= 50000),
  summary text not null,
  use_of_funds text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'needs_info', 'approved', 'declined')),
  reviewer_notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_applications_status_idx
  on campaign_applications (status, created_at desc);

create trigger campaign_applications_set_updated_at
before update on campaign_applications
for each row execute function public.set_updated_at();

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references campaign_applications(id) on delete set null,
  organizer_id uuid references profiles(id) on delete set null,
  slug text unique not null,
  title text not null,
  short_title text not null,
  summary text not null,
  story text[] not null default '{}',
  category text not null,
  location text not null,
  image_url text not null,
  goal_amount bigint not null check (goal_amount > 0),
  raised_amount bigint not null default 0 check (raised_amount >= 0),
  supporter_count integer not null default 0 check (supporter_count >= 0),
  currency text not null default 'UGX',
  status text not null default 'under-review'
    check (status in ('draft', 'under-review', 'active', 'funded', 'completed', 'paused', 'declined')),
  organizer_name text not null,
  organizer_type text not null default 'Verified campaign organizer',
  verified boolean not null default false,
  featured boolean not null default false,
  end_date date,
  budget jsonb not null default '[]'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_status_idx on campaigns (status);
create index if not exists campaigns_featured_idx on campaigns (featured, created_at desc);
create index if not exists campaigns_slug_idx on campaigns (slug);

create trigger campaigns_set_updated_at
before update on campaigns
for each row execute function public.set_updated_at();

create table if not exists campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists campaign_updates_campaign_idx
  on campaign_updates (campaign_id, published_at desc);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete set null,
  campaign_slug text not null,
  amount bigint not null check (amount > 0),
  tip_amount bigint not null default 0 check (tip_amount >= 0),
  total_amount bigint not null check (total_amount > 0),
  currency text not null default 'UGX',
  status text not null default 'initiated'
    check (status in ('initiated', 'pending', 'successful', 'completed', 'failed', 'reversed', 'refunded')),
  provider text not null default 'demo',
  provider_reference text unique,
  checkout_url text,
  settlement_account text not null default 'mpampe_merchant',
  donor_name text,
  donor_email text,
  donor_phone text,
  anonymous boolean not null default false,
  donor_payload jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donations_campaign_status_idx
  on donations (campaign_slug, status, created_at desc);
create index if not exists donations_provider_reference_idx
  on donations (provider_reference);

create trigger donations_set_updated_at
before update on donations
for each row execute function public.set_updated_at();

create table if not exists pledges (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete set null,
  campaign_slug text not null,
  name text,
  email text,
  phone text,
  amount bigint check (amount is null or amount >= 0),
  message text,
  anonymous boolean not null default false,
  status text not null default 'open'
    check (status in ('open', 'contacted', 'converted', 'closed')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pledges_campaign_status_idx
  on pledges (campaign_slug, status, created_at desc);

create trigger pledges_set_updated_at
before update on pledges
for each row execute function public.set_updated_at();

create table if not exists payment_events (
  id text primary key,
  provider text not null,
  provider_reference text,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference, event_type)
);

create table if not exists newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger newsletter_subscriptions_set_updated_at
before update on newsletter_subscriptions
for each row execute function public.set_updated_at();

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text[] not null default '{}',
  image_url text not null,
  category text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_idx
  on blog_posts (status, published_at desc);

create trigger blog_posts_set_updated_at
before update on blog_posts
for each row execute function public.set_updated_at();

create table if not exists submissions (
  id text primary key,
  submission_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists submissions_type_created_idx
  on submissions (submission_type, created_at desc);

create or replace view public.public_campaign_backers as
select
  id,
  campaign_slug,
  case when anonymous then 'Anonymous' else coalesce(nullif(donor_name, ''), 'MpaMpe supporter') end as display_name,
  amount,
  currency,
  anonymous,
  created_at
from donations
where status in ('successful', 'completed');

create or replace function public.refresh_campaign_totals(target_slug text)
returns void
language plpgsql
as $$
begin
  update campaigns
  set
    raised_amount = coalesce((
      select sum(amount)
      from donations
      where campaign_slug = target_slug
        and status in ('successful', 'completed')
    ), 0),
    supporter_count = coalesce((
      select count(*)
      from donations
      where campaign_slug = target_slug
        and status in ('successful', 'completed')
    ), 0),
    updated_at = now()
  where slug = target_slug;
end;
$$;

alter table profiles enable row level security;
alter table campaign_applications enable row level security;
alter table campaigns enable row level security;
alter table campaign_updates enable row level security;
alter table donations enable row level security;
alter table pledges enable row level security;
alter table newsletter_subscriptions enable row level security;
alter table blog_posts enable row level security;
alter table submissions enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

drop policy if exists "campaigns_public_read" on campaigns;
create policy "campaigns_public_read"
on campaigns for select
using (status in ('active', 'funded', 'completed'));

drop policy if exists "campaign_updates_public_read" on campaign_updates;
create policy "campaign_updates_public_read"
on campaign_updates for select
using (
  exists (
    select 1 from campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.status in ('active', 'funded', 'completed')
  )
);

drop policy if exists "blog_posts_public_read" on blog_posts;
create policy "blog_posts_public_read"
on blog_posts for select
using (status = 'published');

drop policy if exists "campaign_applications_insert_authenticated" on campaign_applications;
create policy "campaign_applications_insert_authenticated"
on campaign_applications for insert
with check (auth.uid() = organizer_id or organizer_id is null);

drop policy if exists "campaign_applications_select_own" on campaign_applications;
create policy "campaign_applications_select_own"
on campaign_applications for select
using (auth.uid() = organizer_id);

drop policy if exists "pledges_insert_anyone" on pledges;
create policy "pledges_insert_anyone"
on pledges for insert
with check (true);

drop policy if exists "newsletter_insert_anyone" on newsletter_subscriptions;
create policy "newsletter_insert_anyone"
on newsletter_subscriptions for insert
with check (true);
