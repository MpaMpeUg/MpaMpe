# Creator Dashboard Design

## Intent

Give an authenticated campaign creator a useful operating view after submitting a campaign: application status, published campaigns, verified progress, recent backers, campaign updates, safe campaign editing, submitted-document access and account navigation.

## Goals

- Replace the signed-in dashboard placeholder and hard-coded zeroes with Supabase records owned by the current user.
- Keep campaign application, public campaign, update and backer data in one responsive dashboard.
- Let organizers edit public campaign copy and publish or remove campaign updates without granting access to financial totals, verification flags, ownership or moderation status.
- Keep `/admin` as a separate protected operating surface.
- Preserve `/` exactly as it is.

## Non-goals

- Mobile Money initiation, disbursement and settlement automation remain outside this build.
- Organizers do not receive donor email addresses, phone numbers, private pledges or payment-provider references.
- Organizers cannot approve applications, verify campaigns, alter raised totals, change ownership or change campaign status.

## Approach

### Selected: server-rendered dashboard with Supabase ownership controls

The dashboard page authenticates on the server, fetches the current user's profile, applications and campaigns, then fetches related updates and public backers. Mutations use authenticated API routes. Campaign-copy edits go through a narrow PostgreSQL function that checks `auth.uid()` and updates only approved public fields; update creation/deletion uses owner-aware RLS policies.

This keeps the first render useful, avoids client waterfalls, and makes ownership enforcement independent of the UI.

### Considered: client-only dashboard

This would reuse the existing browser client but create loading waterfalls and make protected data handling harder to audit.

### Considered: service-role API backend

This would centralize writes but requires a server secret that is not currently configured and would bypass RLS. It is unnecessary for creator-owned operations.

## Data and authorization

- `profiles`: current user's name, phone and role.
- `campaign_applications`: rows where `organizer_id = auth.uid()`.
- `campaigns`: rows where `organizer_id = auth.uid()`.
- `campaign_updates`: public updates plus owner access for non-public campaigns.
- `public_campaign_backers`: successful/completed donations only, using the existing privacy-safe view.
- `campaign-documents`: one-hour signed URLs for files owned by the user.
- A trigger marks a profile as `organizer` after the first campaign application.
- A narrow `update_organizer_campaign` function accepts title, short title, summary, story, location and end date only.

## Interface

The dashboard keeps the current MpaMpe route-page visual language and contains:

- overview totals;
- application status cards and reviewer notes;
- campaign progress and recent backers;
- inline campaign copy editor;
- campaign update composer and update history;
- submitted-document links;
- account settings and sign-out actions;
- a clear settlement notice until the payment provider is connected.

## Failure handling

Unauthenticated requests return `401`; attempts to manage another user's campaign return `404`; malformed input returns `400`; all interactive failures use the existing toast system. Empty states point to `/start` instead of showing fake data.

