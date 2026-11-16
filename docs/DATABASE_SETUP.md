# MpaMpe Database Setup

## Current status

The connected Supabase project `MpaMpe` is active and its public schema is
aligned with the application. Local development uses the project URL and
publishable key in the ignored `.env.local` file.

When the Supabase public variables are absent:

- Public campaign pages use the reviewed seed records in `lib/data.ts`.
- Contact, newsletter, campaign, pledge and Mavericks submissions fall back to
  local demo storage and disappear when the process restarts.
- Donation initiation stays in safe demo mode and does not move money.

When the Supabase public variables are configured:

- Public reads and authenticated writes use Supabase's Data API with RLS.
- Public campaigns can be read from the `campaigns` table.
- Reviewed campaign applications, pledges, newsletter subscriptions, profiles,
  blog posts and form submissions are persisted.
- Donation attempts and provider callbacks are stored in `donations` and
  `payment_events`.
- Donations are recorded with separate campaign amount, MpaMpe tip amount,
  total charged amount and `settlement_account = mpampe_merchant`.

## Recommended production setup

Use the connected Supabase project for the first working platform. Supabase is
recommended because crowdfunding records are relational and need clean audit
trails across campaigns, donors, tips, payment events and payouts.

1. Keep the Supabase project named `MpaMpe` active.
2. Treat the reviewed files in `database/migrations/` as the authoritative
   applied schema history.
3. Re-run Supabase security and performance advisors after every migration.
4. Configure Supabase Auth email/password signups and confirmation emails.
5. Add the public project values to `.env.local` for local development:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

6. Add the same values as secret Netlify environment variables for preview and
   production contexts.
7. Restart the local server.
8. Submit a test contact message and confirm it appears in `submissions`.
9. Create a test account and confirm the email flow.
10. Test backups and restoration before collecting live campaign or payment
   records.

## First administrator

The `/admin` route trusts only the server-controlled `app_metadata.role`
claim. After the first MpaMpe staff account has been created and its email has
been confirmed, bootstrap that one account from the Supabase SQL editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where email = 'approved-admin@mpampe.com';

update public.profiles
set role = 'admin', updated_at = now()
where email = 'approved-admin@mpampe.com';
```

Replace the example address with the confirmed staff address, then sign out and
back in so the refreshed JWT contains the admin claim. That administrator can
use `/admin` to review applications, approve and publish campaigns, change
campaign status, manage user roles, and inspect donations, pledges, newsletter
subscriptions and form submissions. Do not assign admin access through
user-editable profile metadata.

`DATABASE_URL` remains optional for controlled server-side payment and admin
jobs. Never commit database or provider secrets to Git.

## Payment data rule

The browser can create an initiated donation, but only a verified server-side
payment webhook may mark a donation `successful` or `completed`. Campaign
totals and public backers must be calculated from confirmed donations only.

For Flutterwave Uganda Mobile Money, set:

```env
PAYMENT_PROVIDER=flutterwave
PAYMENT_SECRET_KEY=FLWSECK...
PAYMENT_WEBHOOK_SECRET=your-flutterwave-secret-hash
```

Configure the Flutterwave dashboard webhook URL to:

```text
https://mpampe.com/api/webhooks/payments
```

Use sandbox/test mode first. The donation form captures the donor's MTN or
Airtel network because Flutterwave requires that value for Uganda Mobile Money.
