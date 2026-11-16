# MpaMpe Admin, Gallery and Performance Design

## Intent

Make the local MpaMpe platform operational for campaign organizers and administrators while preserving the existing homepage visual identity. Add a fast MxM photo experience, use the supplied Oscar and Joel campaign images, protect campaign creation behind sign-in, and give every form clear toast feedback.

## Chosen approach

- Keep Next.js App Router and Supabase Auth/Database/Storage.
- Protect `/start` on the server and redirect signed-out visitors to `/dashboard?next=/start`.
- Add a reusable client-side toast provider and connect it to all interactive forms.
- Add a role-protected admin dashboard backed by RLS and an atomic approval RPC.
- Publish approved applications as campaigns in one database transaction.
- Optimize selected source photographs to WebP before they enter `public/images`; use responsive `next/image` rendering and lazy loading.
- Add `/gallery` and reuse the same curated MxM image data on the MxM page.

## Admin scope

Administrators can review applications, approve or decline them, change public campaign status, and inspect users, donations, pledges, subscribers and public-form submissions. User deletion and direct payment editing are intentionally excluded.

## Safety and constraints

- Homepage structure and transitions remain unchanged.
- Admin authorization uses Supabase `app_metadata`, never user-editable metadata.
- Approval is idempotent and rejects duplicate slugs or previously processed applications.
- Private campaign documents remain private.
- Nothing is pushed or deployed.
