drop policy if exists profiles_admin_select on public.profiles;
create policy profiles_admin_select on public.profiles for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists campaign_applications_admin_select on public.campaign_applications;
create policy campaign_applications_admin_select on public.campaign_applications for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists campaign_applications_admin_update on public.campaign_applications;
create policy campaign_applications_admin_update on public.campaign_applications for update to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists campaigns_admin_all on public.campaigns;
create policy campaigns_admin_all on public.campaigns for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists campaign_updates_admin_all on public.campaign_updates;
create policy campaign_updates_admin_all on public.campaign_updates for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists donations_admin_select on public.donations;
create policy donations_admin_select on public.donations for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists pledges_admin_select on public.pledges;
create policy pledges_admin_select on public.pledges for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists pledges_admin_update on public.pledges;
create policy pledges_admin_update on public.pledges for update to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists newsletter_admin_select on public.newsletter_subscriptions;
create policy newsletter_admin_select on public.newsletter_subscriptions for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists submissions_admin_select on public.submissions;
create policy submissions_admin_select on public.submissions for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists blog_posts_admin_all on public.blog_posts;
create policy blog_posts_admin_all on public.blog_posts for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select on public.profiles to authenticated;
grant select, update on public.campaign_applications to authenticated;
grant select, insert, update on public.campaigns to authenticated;
grant select, insert, update, delete on public.campaign_updates to authenticated;
revoke select on public.donations from authenticated;
grant select (id, campaign_slug, amount, tip_amount, total_amount, currency, status, provider, provider_reference, anonymous, donor_name, created_at)
  on public.donations to authenticated;
grant select, update on public.pledges to authenticated;
grant select, update on public.newsletter_subscriptions to authenticated;
grant select on public.submissions to authenticated;
grant select, insert, update, delete on public.blog_posts to authenticated;

create or replace function public.approve_campaign_application(
  p_application_id uuid,
  p_slug text,
  p_short_title text,
  p_image_url text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  application public.campaign_applications%rowtype;
  campaign_id uuid;
  clean_slug text;
begin
  if (select auth.uid()) is null
     or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  clean_slug := lower(trim(p_slug));
  if clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' or length(clean_slug) > 140 then
    raise exception 'Invalid campaign slug' using errcode = '22023';
  end if;
  if length(trim(p_short_title)) < 3 or length(trim(p_short_title)) > 120 then
    raise exception 'Invalid short title' using errcode = '22023';
  end if;

  select * into application from public.campaign_applications
  where id = p_application_id for update;
  if not found then
    raise exception 'Campaign application not found' using errcode = 'P0002';
  end if;
  if application.status = 'approved' or exists (
    select 1 from public.campaigns where application_id = p_application_id
  ) then
    raise exception 'Campaign application was already approved' using errcode = '23505';
  end if;

  insert into public.campaigns (
    application_id, organizer_id, slug, title, short_title, summary, story,
    category, location, image_url, goal_amount, raised_amount, supporter_count,
    currency, status, organizer_name, organizer_type, verified, featured,
    budget, payload, published_at
  )
  values (
    application.id, application.organizer_id, clean_slug,
    application.campaign_title, trim(p_short_title), application.summary,
    array[application.summary, application.use_of_funds],
    application.category, application.location, p_image_url,
    application.goal_amount, 0, 0, 'UGX', 'active',
    application.organizer_name, 'Verified campaign organizer', true, false,
    jsonb_build_array(jsonb_build_object('label', 'Campaign goal', 'amount', application.goal_amount)),
    jsonb_build_object('source', 'campaign_application', 'application_id', application.id),
    now()
  ) returning id into campaign_id;

  update public.campaign_applications
  set status = 'approved', reviewer_notes = 'Approved and published', updated_at = now()
  where id = application.id;
  return campaign_id;
end;
$$;

revoke all on function public.approve_campaign_application(uuid, text, text, text) from public, anon;
grant execute on function public.approve_campaign_application(uuid, text, text, text) to authenticated;

create or replace function public.set_platform_user_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
     or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_role not in ('donor', 'organizer', 'maverick', 'admin') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;
  if p_user_id = (select auth.uid()) and p_role <> 'admin' then
    raise exception 'Administrators cannot remove their own admin access' using errcode = '42501';
  end if;
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', p_role), updated_at = now()
  where id = p_user_id;
  update public.profiles set role = p_role, updated_at = now() where id = p_user_id;
end;
$$;

revoke all on function public.set_platform_user_role(uuid, text) from public, anon;
grant execute on function public.set_platform_user_role(uuid, text) to authenticated;
