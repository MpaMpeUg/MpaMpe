create index if not exists gallery_items_created_by_idx
on public.gallery_items (created_by);

drop policy if exists gallery_items_public_read on public.gallery_items;
drop policy if exists gallery_items_admin_read on public.gallery_items;
create policy gallery_items_read
on public.gallery_items for select
to anon, authenticated
using (
  status = 'active'
  or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

drop policy if exists gallery_items_admin_insert on public.gallery_items;
create policy gallery_items_admin_insert
on public.gallery_items for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and created_by = (select auth.uid())
  and (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_items_admin_update on public.gallery_items;
create policy gallery_items_admin_update
on public.gallery_items for update
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
)
with check (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

drop policy if exists gallery_items_admin_delete on public.gallery_items;
create policy gallery_items_admin_delete
on public.gallery_items for delete
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
);

drop policy if exists gallery_images_admin_insert on storage.objects;
create policy gallery_images_admin_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'gallery-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_images_admin_update on storage.objects;
create policy gallery_images_admin_update
on storage.objects for update
to authenticated
using (
  bucket_id = 'gallery-images'
  and (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
)
with check (
  bucket_id = 'gallery-images'
  and (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);

drop policy if exists gallery_images_admin_delete on storage.objects;
create policy gallery_images_admin_delete
on storage.objects for delete
to authenticated
using (
  bucket_id = 'gallery-images'
  and (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
    or coalesce(((select auth.jwt()) -> 'app_metadata' -> 'roles'), '[]'::jsonb) ? 'admin'
  )
);
