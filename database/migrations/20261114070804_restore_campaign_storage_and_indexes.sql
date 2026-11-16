insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('campaign-images', 'campaign-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('campaign-documents', 'campaign-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists campaign_images_public_read on storage.objects;
create policy campaign_images_public_read on storage.objects
for select to anon, authenticated
using (bucket_id = 'campaign-images');

drop policy if exists campaign_images_insert_own on storage.objects;
create policy campaign_images_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'campaign-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists campaign_images_update_own on storage.objects;
create policy campaign_images_update_own on storage.objects
for update to authenticated
using (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
);

drop policy if exists campaign_images_delete_own on storage.objects;
create policy campaign_images_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'campaign-images'
  and owner_id = (select auth.uid())::text
);

drop policy if exists campaign_documents_select_own on storage.objects;
create policy campaign_documents_select_own on storage.objects
for select to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);

drop policy if exists campaign_documents_insert_own on storage.objects;
create policy campaign_documents_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'campaign-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists campaign_documents_update_own on storage.objects;
create policy campaign_documents_update_own on storage.objects
for update to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);

drop policy if exists campaign_documents_delete_own on storage.objects;
create policy campaign_documents_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'campaign-documents'
  and owner_id = (select auth.uid())::text
);

create index if not exists campaigns_application_id_idx
  on public.campaigns (application_id);
create index if not exists donations_campaign_id_idx
  on public.donations (campaign_id);
create index if not exists pledges_campaign_id_idx
  on public.pledges (campaign_id);
