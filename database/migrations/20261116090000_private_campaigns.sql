alter table public.campaigns
  add column if not exists visibility text not null default 'public' check (visibility in ('public', 'private')),
  add column if not exists share_token uuid not null default gen_random_uuid();

create unique index if not exists campaigns_share_token_idx on public.campaigns (share_token);
create index if not exists campaigns_public_visibility_idx
  on public.campaigns (visibility, status, featured, created_at desc);

drop policy if exists campaigns_public_read on public.campaigns;
drop policy if exists campaigns_organizer_read on public.campaigns;
drop policy if exists campaigns_anon_public_read on public.campaigns;
drop policy if exists campaigns_authenticated_read on public.campaigns;

create policy campaigns_anon_public_read on public.campaigns
for select to anon
using (
  visibility = 'public'
  and status in ('active', 'funded', 'completed')
);

create policy campaigns_authenticated_read on public.campaigns
for select to authenticated
using (
  (visibility = 'public' and status in ('active', 'funded', 'completed'))
  or organizer_id = (select auth.uid())
);

drop policy if exists campaign_updates_public_read on public.campaign_updates;
create policy campaign_updates_public_read on public.campaign_updates
for select to anon, authenticated
using (
  exists (
    select 1 from public.campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.visibility = 'public'
      and campaigns.status in ('active', 'funded', 'completed')
  )
);

drop policy if exists donations_public_backer_rows on public.donations;
create policy donations_public_backer_rows on public.donations
for select to anon, authenticated
using (
  status in ('successful', 'completed')
  and exists (
    select 1 from public.campaigns
    where campaigns.slug = donations.campaign_slug
      and campaigns.visibility = 'public'
      and campaigns.status in ('active', 'funded', 'completed')
  )
);

create or replace view public.public_campaign_backers
with (security_invoker = true)
as
select
  d.id,
  d.campaign_slug,
  case
    when d.anonymous then 'Anonymous'
    else coalesce(nullif(d.donor_name, ''), 'MpaMpe supporter')
  end as display_name,
  d.amount,
  d.currency,
  d.anonymous,
  d.created_at
from public.donations d
inner join public.campaigns c on c.slug = d.campaign_slug
where d.status in ('successful', 'completed')
  and c.visibility = 'public';

create or replace function public.get_shared_campaign(
  p_slug text,
  p_share_token uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'id', c.id,
    'slug', c.slug,
    'title', c.title,
    'short_title', c.short_title,
    'summary', c.summary,
    'story', c.story,
    'category', c.category,
    'location', c.location,
    'image_url', c.image_url,
    'goal_amount', c.goal_amount,
    'raised_amount', c.raised_amount,
    'supporter_count', c.supporter_count,
    'currency', c.currency,
    'status', c.status,
    'organizer_name', c.organizer_name,
    'organizer_type', c.organizer_type,
    'verified', c.verified,
    'featured', c.featured,
    'visibility', c.visibility,
    'end_date', c.end_date,
    'budget', c.budget,
    'payload', c.payload,
    'updates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', u.id,
        'title', u.title,
        'body', u.body,
        'published_at', u.published_at
      ) order by u.published_at desc)
      from public.campaign_updates u
      where u.campaign_id = c.id
    ), '[]'::jsonb)
  ) into result
  from public.campaigns c
  where c.slug = p_slug
    and c.status in ('active', 'funded', 'completed', 'paused')
    and (
      c.visibility = 'public'
      or (c.visibility = 'private' and c.share_token = p_share_token)
    )
  limit 1;

  return result;
end;
$$;

create or replace function public.get_campaign_backers(
  p_slug text,
  p_share_token uuid default null
)
returns table (
  id uuid,
  campaign_slug text,
  display_name text,
  amount bigint,
  currency text,
  anonymous boolean,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    d.id,
    d.campaign_slug,
    case
      when d.anonymous then 'Anonymous'
      else coalesce(nullif(d.donor_name, ''), 'MpaMpe supporter')
    end,
    d.amount,
    d.currency,
    d.anonymous,
    d.created_at
  from public.donations d
  inner join public.campaigns c on c.slug = d.campaign_slug
  where c.slug = p_slug
    and c.status in ('active', 'funded', 'completed', 'paused')
    and (
      c.visibility = 'public'
      or (c.visibility = 'private' and c.share_token = p_share_token)
    )
    and d.status in ('successful', 'completed')
  order by d.created_at desc
  limit 25;
$$;

create or replace function public.get_organizer_campaign_backers()
returns table (
  id uuid,
  campaign_slug text,
  display_name text,
  amount bigint,
  currency text,
  anonymous boolean,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  return query
  select
    d.id,
    d.campaign_slug,
    case
      when d.anonymous then 'Anonymous'
      else coalesce(nullif(d.donor_name, ''), 'MpaMpe supporter')
    end,
    d.amount,
    d.currency,
    d.anonymous,
    d.created_at
  from public.donations d
  inner join public.campaigns c on c.slug = d.campaign_slug
  where c.organizer_id = auth.uid()
    and d.status in ('successful', 'completed')
  order by d.created_at desc
  limit 500;
end;
$$;

create or replace function public.set_organizer_campaign_visibility(
  p_campaign_id uuid,
  p_visibility text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_row public.campaigns%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_visibility not in ('public', 'private') then
    raise exception 'Visibility must be public or private' using errcode = '22023';
  end if;

  select * into campaign_row
  from public.campaigns
  where id = p_campaign_id
    and organizer_id = auth.uid()
  for update;

  if not found then
    raise exception 'Campaign was not found' using errcode = 'P0002';
  end if;
  if not campaign_row.verified
     or campaign_row.status not in ('active', 'funded', 'completed', 'paused') then
    raise exception 'Only approved campaigns can change visibility' using errcode = '22023';
  end if;

  update public.campaigns
  set visibility = p_visibility,
      share_token = case
        when p_visibility = 'private' and campaign_row.visibility <> 'private'
          then gen_random_uuid()
        else share_token
      end,
      updated_at = now()
  where id = p_campaign_id
  returning * into campaign_row;

  return jsonb_build_object(
    'slug', campaign_row.slug,
    'visibility', campaign_row.visibility,
    'shareToken', case when campaign_row.visibility = 'private' then campaign_row.share_token else null end
  );
end;
$$;

create or replace function public.create_campaign_donation(
  p_id uuid,
  p_campaign_slug text,
  p_access_token uuid,
  p_amount bigint,
  p_tip_amount bigint,
  p_total_amount bigint,
  p_currency text,
  p_provider text,
  p_reference text,
  p_settlement_account text,
  p_donor_payload jsonb,
  p_donor_name text,
  p_donor_email text,
  p_donor_phone text,
  p_anonymous boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_id uuid;
begin
  if p_amount < 1000 or p_tip_amount < 0 or p_total_amount <> p_amount + p_tip_amount then
    raise exception 'Invalid donation totals' using errcode = '22023';
  end if;
  if p_currency <> 'UGX' then
    raise exception 'Unsupported currency' using errcode = '22023';
  end if;

  select c.id into campaign_id
  from public.campaigns c
  where c.slug = p_campaign_slug
    and c.status in ('active', 'funded')
    and (
      c.visibility = 'public'
      or (c.visibility = 'private' and c.share_token = p_access_token)
    )
  limit 1;

  if campaign_id is null then
    raise exception 'Campaign is not available for donations' using errcode = 'P0002';
  end if;

  insert into public.donations (
    id, campaign_id, campaign_slug, amount, tip_amount, total_amount, currency,
    status, provider, provider_reference, settlement_account, donor_payload,
    donor_name, donor_email, donor_phone, anonymous
  ) values (
    p_id, campaign_id, p_campaign_slug, p_amount, p_tip_amount, p_total_amount,
    p_currency, 'initiated', p_provider, p_reference, p_settlement_account,
    p_donor_payload, nullif(trim(p_donor_name), ''), nullif(trim(p_donor_email), ''),
    nullif(trim(p_donor_phone), ''), p_anonymous
  );

  return p_id;
end;
$$;

create or replace function public.create_campaign_pledge(
  p_id uuid,
  p_campaign_slug text,
  p_access_token uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_amount bigint,
  p_message text,
  p_anonymous boolean,
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_id uuid;
begin
  select c.id into campaign_id
  from public.campaigns c
  where c.slug = p_campaign_slug
    and c.status in ('active', 'funded')
    and (
      c.visibility = 'public'
      or (c.visibility = 'private' and c.share_token = p_access_token)
    )
  limit 1;

  if campaign_id is null then
    raise exception 'Campaign is not available for pledges' using errcode = 'P0002';
  end if;

  insert into public.pledges (
    id, campaign_id, campaign_slug, name, email, phone, amount, message,
    anonymous, status, payload
  ) values (
    p_id, campaign_id, p_campaign_slug, nullif(trim(p_name), ''),
    nullif(trim(p_email), ''), nullif(trim(p_phone), ''), p_amount,
    nullif(trim(p_message), ''), p_anonymous, 'open', p_payload
  );

  return p_id;
end;
$$;

drop policy if exists pledges_insert_anyone on public.pledges;
revoke insert on public.pledges from anon, authenticated;

revoke all on function public.get_shared_campaign(text, uuid) from public;
revoke all on function public.get_campaign_backers(text, uuid) from public;
revoke all on function public.get_organizer_campaign_backers() from public, anon;
revoke all on function public.set_organizer_campaign_visibility(uuid, text) from public, anon;
revoke all on function public.create_campaign_donation(uuid, text, uuid, bigint, bigint, bigint, text, text, text, text, jsonb, text, text, text, boolean) from public;
revoke all on function public.create_campaign_pledge(uuid, text, uuid, text, text, text, bigint, text, boolean, jsonb) from public;

grant execute on function public.get_shared_campaign(text, uuid) to anon, authenticated;
grant execute on function public.get_campaign_backers(text, uuid) to anon, authenticated;
grant execute on function public.get_organizer_campaign_backers() to authenticated;
grant execute on function public.set_organizer_campaign_visibility(uuid, text) to authenticated;
grant execute on function public.create_campaign_donation(uuid, text, uuid, bigint, bigint, bigint, text, text, text, text, jsonb, text, text, text, boolean) to anon, authenticated;
grant execute on function public.create_campaign_pledge(uuid, text, uuid, text, text, text, bigint, text, boolean, jsonb) to anon, authenticated;
