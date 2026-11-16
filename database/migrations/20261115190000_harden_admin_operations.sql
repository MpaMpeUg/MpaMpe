create or replace function public.set_platform_user_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_email text;
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

  select email
  into target_email
  from auth.users
  where id = p_user_id
  for update;

  if not found then
    raise exception 'Campaign platform user was not found' using errcode = 'P0002';
  end if;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', p_role),
      updated_at = now()
  where id = p_user_id;

  insert into public.profiles (id, email, role)
  values (p_user_id, target_email, p_role)
  on conflict (id) do update
  set email = excluded.email,
      role = excluded.role,
      updated_at = now();
end;
$$;

revoke all on function public.set_platform_user_role(uuid, text) from public, anon;
grant execute on function public.set_platform_user_role(uuid, text) to authenticated;
