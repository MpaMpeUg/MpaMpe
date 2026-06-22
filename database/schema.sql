create table if not exists campaigns (
  id text primary key,
  slug text unique not null,
  status text not null default 'under-review',
  featured boolean not null default false,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_status_idx on campaigns (status);
create index if not exists campaigns_featured_idx on campaigns (featured);

create table if not exists submissions (
  id text primary key,
  submission_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists submissions_type_created_idx
  on submissions (submission_type, created_at desc);

create table if not exists payment_events (
  id text primary key,
  provider text not null,
  provider_reference text unique,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists donations (
  id text primary key,
  campaign_slug text not null,
  amount bigint not null check (amount > 0),
  currency text not null default 'UGX',
  status text not null default 'initiated',
  provider_reference text unique,
  donor_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donations_campaign_status_idx
  on donations (campaign_slug, status);
