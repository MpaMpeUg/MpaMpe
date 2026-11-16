-- Keep the preserved legacy schema inaccessible through public API roles.
revoke all privileges on schema legacy from public, anon, authenticated;
revoke all privileges on all tables in schema legacy from public, anon, authenticated;
revoke all privileges on all sequences in schema legacy from public, anon, authenticated;
revoke all privileges on all functions in schema legacy from public, anon, authenticated;

do $$
declare
  table_record record;
begin
  for table_record in
    select tablename from pg_tables where schemaname = 'legacy'
  loop
    execute format('alter table legacy.%I enable row level security', table_record.tablename);
  end loop;
end;
$$;

alter function legacy.update_updated_at_column()
  set search_path = legacy, pg_temp;

-- Supabase applies broad default grants to new public tables. Reset sensitive
-- tables, then grant only what each web role needs.
revoke all on public.profiles from public, anon, authenticated;
revoke all on public.campaign_applications from public, anon, authenticated;
revoke all on public.donations from public, anon, authenticated;
revoke all on public.pledges from public, anon, authenticated;
revoke all on public.payment_events from public, anon, authenticated;
revoke all on public.newsletter_subscriptions from public, anon, authenticated;
revoke all on public.submissions from public, anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert on public.campaign_applications to authenticated;
grant insert on public.pledges, public.newsletter_subscriptions, public.submissions
  to anon, authenticated;
grant select (id, campaign_slug, amount, currency, status, anonymous, donor_name, created_at)
  on public.donations to anon, authenticated;
grant all on public.profiles, public.campaign_applications, public.donations,
  public.pledges, public.payment_events, public.newsletter_subscriptions,
  public.submissions to service_role;
