revoke select on public.donations from authenticated;
grant select (
  id, campaign_slug, amount, tip_amount, total_amount, currency, status,
  provider, provider_reference, anonymous, donor_name, created_at
) on public.donations to authenticated;
