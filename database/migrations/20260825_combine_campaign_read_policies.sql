drop policy if exists campaigns_public_read on public.campaigns;
drop policy if exists campaigns_organizer_read on public.campaigns;

create policy campaigns_anon_public_read on public.campaigns
for select to anon
using (status in ('active', 'funded', 'completed'));

create policy campaigns_authenticated_read on public.campaigns
for select to authenticated
using (
  status in ('active', 'funded', 'completed')
  or (select auth.uid()) = organizer_id
);
