alter policy profiles_admin_select on public.profiles
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy campaign_applications_admin_select on public.campaign_applications
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy campaign_applications_admin_update on public.campaign_applications
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy campaigns_admin_all on public.campaigns
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy campaign_updates_admin_all on public.campaign_updates
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

alter policy donations_admin_select on public.donations
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy pledges_admin_select on public.pledges
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy pledges_admin_update on public.pledges
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy newsletter_admin_select on public.newsletter_subscriptions
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy submissions_admin_select on public.submissions
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
alter policy blog_posts_admin_all on public.blog_posts
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
