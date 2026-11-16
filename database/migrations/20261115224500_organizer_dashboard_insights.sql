create or replace function public.get_organizer_dashboard_insights()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  with owned_campaigns as (
    select id, slug, short_title, goal_amount, currency
    from public.campaigns
    where organizer_id = auth.uid()
  ),
  confirmed_gifts as (
    select
      d.id,
      d.campaign_slug,
      d.amount,
      d.currency,
      d.anonymous,
      coalesce(d.confirmed_at, d.created_at) as gift_date
    from public.donations d
    inner join owned_campaigns c on c.slug = d.campaign_slug
    where d.status in ('successful', 'completed')
  ),
  month_series as (
    select generate_series(
      date_trunc('month', current_date) - interval '5 months',
      date_trunc('month', current_date),
      interval '1 month'
    )::date as month_start
  ),
  monthly_rows as (
    select
      m.month_start,
      coalesce(sum(g.amount), 0)::bigint as amount,
      count(g.id)::integer as supporters
    from month_series m
    left join confirmed_gifts g
      on g.gift_date >= m.month_start
      and g.gift_date < m.month_start + interval '1 month'
    group by m.month_start
    order by m.month_start
  ),
  campaign_rows as (
    select
      c.id,
      c.slug,
      c.short_title,
      c.goal_amount,
      coalesce(sum(g.amount), 0)::bigint as amount,
      count(g.id)::integer as supporters
    from owned_campaigns c
    left join confirmed_gifts g on g.campaign_slug = c.slug
    group by c.id, c.slug, c.short_title, c.goal_amount
    order by amount desc, c.short_title
  )
  select jsonb_build_object(
    'currency', coalesce((select currency from owned_campaigns limit 1), 'UGX'),
    'confirmedGiftCount', (select count(*) from confirmed_gifts),
    'averageGift', coalesce((select round(avg(amount))::bigint from confirmed_gifts), 0),
    'last30Days', coalesce((
      select sum(amount) from confirmed_gifts
      where gift_date >= now() - interval '30 days'
    ), 0),
    'previous30Days', coalesce((
      select sum(amount) from confirmed_gifts
      where gift_date >= now() - interval '60 days'
        and gift_date < now() - interval '30 days'
    ), 0),
    'anonymousGiftCount', (
      select count(*) from confirmed_gifts where anonymous
    ),
    'monthly', coalesce((
      select jsonb_agg(jsonb_build_object(
        'month', to_char(month_start, 'YYYY-MM-DD'),
        'label', to_char(month_start, 'Mon'),
        'amount', amount,
        'supporters', supporters
      ) order by month_start)
      from monthly_rows
    ), '[]'::jsonb),
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'campaignId', id,
        'slug', slug,
        'title', short_title,
        'amount', amount,
        'goalAmount', goal_amount,
        'supporters', supporters
      ) order by amount desc, short_title)
      from campaign_rows
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_organizer_dashboard_insights() from public, anon;
grant execute on function public.get_organizer_dashboard_insights() to authenticated;
