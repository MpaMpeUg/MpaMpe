create or replace function public.mark_campaign_applicant_as_organizer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set role = case when role = 'donor' then 'organizer' else role end,
      updated_at = now()
  where id = new.organizer_id;
  return new;
end;
$$;

revoke all on function public.mark_campaign_applicant_as_organizer() from public, anon, authenticated;

drop trigger if exists campaign_application_marks_organizer on public.campaign_applications;
create trigger campaign_application_marks_organizer
after insert on public.campaign_applications
for each row execute function public.mark_campaign_applicant_as_organizer();

drop policy if exists campaign_updates_organizer_select on public.campaign_updates;
create policy campaign_updates_organizer_select
on public.campaign_updates for select
to authenticated
using (
  exists (
    select 1
    from public.campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.organizer_id = (select auth.uid())
  )
);

drop policy if exists campaign_updates_organizer_insert on public.campaign_updates;
create policy campaign_updates_organizer_insert
on public.campaign_updates for insert
to authenticated
with check (
  exists (
    select 1
    from public.campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.organizer_id = (select auth.uid())
  )
);

drop policy if exists campaign_updates_organizer_delete on public.campaign_updates;
create policy campaign_updates_organizer_delete
on public.campaign_updates for delete
to authenticated
using (
  exists (
    select 1
    from public.campaigns
    where campaigns.id = campaign_updates.campaign_id
      and campaigns.organizer_id = (select auth.uid())
  )
);

create or replace function public.update_organizer_campaign(
  p_campaign_id uuid,
  p_title text,
  p_short_title text,
  p_summary text,
  p_story text[],
  p_location text,
  p_end_date date
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_slug text;
  campaign_owner uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if length(trim(coalesce(p_title, ''))) < 8 or length(trim(p_title)) > 160 then
    raise exception 'Campaign title must be between 8 and 160 characters' using errcode = '22023';
  end if;
  if length(trim(coalesce(p_short_title, ''))) < 3 or length(trim(p_short_title)) > 120 then
    raise exception 'Short title must be between 3 and 120 characters' using errcode = '22023';
  end if;
  if length(trim(coalesce(p_summary, ''))) < 80 or length(trim(p_summary)) > 3000 then
    raise exception 'Campaign summary must be between 80 and 3000 characters' using errcode = '22023';
  end if;
  if length(trim(coalesce(p_location, ''))) < 2 or length(trim(p_location)) > 120 then
    raise exception 'Campaign location must be between 2 and 120 characters' using errcode = '22023';
  end if;
  if coalesce(cardinality(p_story), 0) > 20 then
    raise exception 'Campaign story cannot exceed 20 paragraphs' using errcode = '22023';
  end if;
  if exists (
    select 1
    from unnest(coalesce(p_story, '{}'::text[])) as paragraph
    where length(trim(paragraph)) < 10 or length(trim(paragraph)) > 3000
  ) then
    raise exception 'Each story paragraph must be between 10 and 3000 characters' using errcode = '22023';
  end if;

  select slug, organizer_id
  into campaign_slug, campaign_owner
  from public.campaigns
  where id = p_campaign_id
  for update;

  if not found or campaign_owner is distinct from (select auth.uid()) then
    raise exception 'Campaign was not found' using errcode = 'P0002';
  end if;

  update public.campaigns
  set title = trim(p_title),
      short_title = trim(p_short_title),
      summary = trim(p_summary),
      story = coalesce(p_story, '{}'::text[]),
      location = trim(p_location),
      end_date = p_end_date,
      updated_at = now()
  where id = p_campaign_id;

  return campaign_slug;
end;
$$;

revoke all on function public.update_organizer_campaign(uuid, text, text, text, text[], text, date) from public, anon;
grant execute on function public.update_organizer_campaign(uuid, text, text, text, text[], text, date) to authenticated;
