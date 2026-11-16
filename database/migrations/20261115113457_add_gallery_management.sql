create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text not null unique,
  alt_text text not null default 'MpaMpe community photo',
  category text not null default 'general',
  status text not null default 'active'
    check (status in ('active', 'hidden')),
  source text not null default 'admin_upload',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

drop policy if exists gallery_items_public_read on public.gallery_items;
create policy gallery_items_public_read
on public.gallery_items for select
to anon, authenticated
using (status = 'active');

drop policy if exists gallery_items_admin_read on public.gallery_items;
create policy gallery_items_admin_read
on public.gallery_items for select
to authenticated
using (
  coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

drop policy if exists gallery_items_admin_insert on public.gallery_items;
create policy gallery_items_admin_insert
on public.gallery_items for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and created_by = (select auth.uid())
  and (
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_items_admin_update on public.gallery_items;
create policy gallery_items_admin_update
on public.gallery_items for update
to authenticated
using (
  coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
)
with check (
  coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

drop policy if exists gallery_items_admin_delete on public.gallery_items;
create policy gallery_items_admin_delete
on public.gallery_items for delete
to authenticated
using (
  coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'gallery-images',
  'gallery-images',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists gallery_images_public_read on storage.objects;
create policy gallery_images_public_read
on storage.objects for select
to public
using (bucket_id = 'gallery-images');

drop policy if exists gallery_images_admin_insert on storage.objects;
create policy gallery_images_admin_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'gallery-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_images_admin_update on storage.objects;
create policy gallery_images_admin_update
on storage.objects for update
to authenticated
using (
  bucket_id = 'gallery-images'
  and (
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
)
with check (
  bucket_id = 'gallery-images'
  and (
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_images_admin_delete on storage.objects;
create policy gallery_images_admin_delete
on storage.objects for delete
to authenticated
using (
  bucket_id = 'gallery-images'
  and (
    coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce((select auth.jwt() -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);
