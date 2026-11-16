-- Align the restored Supabase project with the application model.
-- The previous schema is preserved under `legacy`; nothing is dropped.

create extension if not exists pgcrypto;
create schema if not exists legacy;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'analytics_events', 'awards', 'blog_posts', 'campaign_updates',
    'campaigns', 'categories', 'donations', 'gallery_items', 'mavericks',
    'newsletter_subscribers', 'products', 'team_members', 'users'
  ]
  loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I set schema legacy', table_name);
    end if;
  end loop;
end;
$$;

do $$
begin
  if to_regprocedure('public.update_updated_at_column()') is not null then
    alter function public.update_updated_at_column() set schema legacy;
  end if;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
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
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table public.campaign_applications (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  organizer_name text not null,
  email text not null,
  phone text not null,
  campaign_title text not null,
  category text not null,
  location text not null,
  goal_amount bigint not null check (goal_amount >= 50000),
  summary text not null,
  use_of_funds text not null,
  image_path text,
  document_paths text[] not null default '{}',
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'needs_info', 'approved', 'declined')),
  reviewer_notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campaign_applications_status_idx
  on public.campaign_applications (status, created_at desc);
create index campaign_applications_organizer_idx
  on public.campaign_applications (organizer_id, created_at desc);

create trigger campaign_applications_set_updated_at
before update on public.campaign_applications
for each row execute function public.set_updated_at();

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.campaign_applications(id) on delete set null,
  organizer_id uuid references public.profiles(id) on delete set null,
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

create index campaigns_status_idx on public.campaigns (status);
create index campaigns_featured_idx on public.campaigns (featured, created_at desc);
create index campaigns_organizer_idx on public.campaigns (organizer_id, created_at desc);

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create table public.campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index campaign_updates_campaign_idx
  on public.campaign_updates (campaign_id, published_at desc);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  campaign_slug text not null,
  amount bigint not null check (amount > 0),
  tip_amount bigint not null default 0 check (tip_amount >= 0),
  total_amount bigint not null check (total_amount > 0),
  currency text not null default 'UGX',
  status text not null default 'initiated'
    check (status in ('initiated', 'pending', 'successful', 'completed', 'failed', 'reversed', 'refunded')),
  provider text not null,
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

create index donations_campaign_status_idx
  on public.donations (campaign_slug, status, created_at desc);
create index donations_provider_reference_idx
  on public.donations (provider_reference);

create trigger donations_set_updated_at
before update on public.donations
for each row execute function public.set_updated_at();

create table public.pledges (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
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

create index pledges_campaign_status_idx
  on public.pledges (campaign_slug, status, created_at desc);

create trigger pledges_set_updated_at
before update on public.pledges
for each row execute function public.set_updated_at();

create table public.payment_events (
  id text primary key,
  provider text not null,
  provider_reference text,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference, event_type)
);

create table public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger newsletter_subscriptions_set_updated_at
before update on public.newsletter_subscriptions
for each row execute function public.set_updated_at();

create table public.blog_posts (
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

create index blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);

create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null
    check (submission_type in ('contact', 'maverick', 'account')),
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index submissions_type_created_idx
  on public.submissions (submission_type, created_at desc);

create or replace view public.public_campaign_backers
with (security_invoker = true)
as
select
  id,
  campaign_slug,
  case
    when anonymous then 'Anonymous'
    else coalesce(nullif(donor_name, ''), 'MpaMpe supporter')
  end as display_name,
  amount,
  currency,
  anonymous,
  created_at
from public.donations
where status in ('successful', 'completed');

create or replace function public.refresh_campaign_totals(target_slug text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.campaigns
  set
    raised_amount = coalesce((
      select sum(amount) from public.donations
      where campaign_slug = target_slug
        and status in ('successful', 'completed')
    ), 0),
    supporter_count = coalesce((
      select count(*) from public.donations
      where campaign_slug = target_slug
        and status in ('successful', 'completed')
    ), 0),
    updated_at = now()
  where slug = target_slug;
end;
$$;

alter table public.profiles enable row level security;
alter table public.campaign_applications enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_updates enable row level security;
alter table public.donations enable row level security;
alter table public.pledges enable row level security;
alter table public.payment_events enable row level security;
alter table public.newsletter_subscriptions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.submissions enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy campaign_applications_insert_own on public.campaign_applications
for insert to authenticated
with check ((select auth.uid()) = organizer_id);

create policy campaign_applications_select_own on public.campaign_applications
for select to authenticated
using ((select auth.uid()) = organizer_id);

create policy campaigns_public_read on public.campaigns
for select to anon, authenticated
using (status in ('active', 'funded', 'completed'));

create policy campaigns_organizer_read on public.campaigns
for select to authenticated
using ((select auth.uid()) = organizer_id);

create policy campaign_updates_public_read on public.campaign_updates
for select to anon, authenticated
using (
  exists (
    select 1 from public.campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.status in ('active', 'funded', 'completed')
  )
);

create policy donations_public_backer_rows on public.donations
for select to anon, authenticated
using (status in ('successful', 'completed'));

create policy pledges_insert_anyone on public.pledges
for insert to anon, authenticated
with check (status = 'open');

create policy newsletter_insert_anyone on public.newsletter_subscriptions
for insert to anon, authenticated
with check (status = 'subscribed');

create policy submissions_insert_public_forms on public.submissions
for insert to anon, authenticated
with check (submission_type in ('contact', 'maverick'));

create policy blog_posts_public_read on public.blog_posts
for select to anon, authenticated
using (status = 'published');

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert on public.campaign_applications to authenticated;
grant select on public.campaigns, public.campaign_updates, public.blog_posts to anon, authenticated;
grant insert on public.pledges, public.newsletter_subscriptions, public.submissions to anon, authenticated;
grant select (id, campaign_slug, amount, currency, status, anonymous, donor_name, created_at)
  on public.donations to anon, authenticated;
grant select on public.public_campaign_backers to anon, authenticated;
grant all on all tables in schema public to service_role;

revoke all on function public.refresh_campaign_totals(text) from public, anon, authenticated;
grant execute on function public.refresh_campaign_totals(text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('campaign-images', 'campaign-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('campaign-documents', 'campaign-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy campaign_images_public_read on storage.objects
for select to anon, authenticated
using (bucket_id = 'campaign-images');

create policy campaign_images_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'campaign-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy campaign_images_update_own on storage.objects
for update to authenticated
using (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
);

create policy campaign_images_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
);

create policy campaign_documents_select_own on storage.objects
for select to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);

create policy campaign_documents_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'campaign-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy campaign_documents_update_own on storage.objects
for update to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);

create policy campaign_documents_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);
