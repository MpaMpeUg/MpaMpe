# MpaMpe Platform

MpaMpe is a community crowdfunding platform for trusted campaigns, practical
giving and the MpaMpe Mavericks volunteer community.

This branch contains the Next.js platform rebuild. The previous static HTML,
CSS and PHP files remain in the repository for reference, but the Netlify build
now publishes the Next.js application.

## What is implemented

- Responsive, accessible multi-page public website
- Searchable and filterable campaign directory
- Dynamic campaign detail routes and campaign APIs
- Campaign application workflow
- MpaMpe Mavericks page, opportunities and volunteer application
- Contact and newsletter APIs with validation, honeypots and rate limits
- Netlify Identity account and role scaffolding
- Donor, organizer and Maverick dashboard foundation
- Administrator access checks and operations preview
- PostgreSQL schema for campaigns, submissions, donations and payment events
- Payment initiation and signed webhook scaffolding
- SEO metadata, sitemap, robots rules and social previews
- Netlify caching, image optimization and security headers

## Local development

Requirements:

- Node.js 24
- npm 11+

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

The project uses Webpack for local builds because the current Windows
environment loads the Next.js SWC WebAssembly fallback. Netlify's Linux build
environment can still run the same command.

## Environment configuration

Copy `.env.example` to `.env.local` for local private configuration. Never
commit real secrets.

The app runs safely without a database or payment provider:

- Public campaign pages use reviewed seed data.
- Form submissions are held only in the running server process.
- Donation initiation returns a clear demo response and does not transfer money.

For persistent production data, set `DATABASE_URL` and apply:

```text
database/schema.sql
```

## Payment activation

Do not activate payments until a licensed provider and the MpaMpe settlement
model are approved.

Before production activation:

1. Set `PAYMENT_PROVIDER`, `PAYMENT_SECRET_KEY` and
   `PAYMENT_WEBHOOK_SECRET` in Netlify.
2. Implement the provider-specific checkout adapter in `lib/payments.ts`.
3. Map the provider's signed webhook format in
   `app/api/webhooks/payments/route.ts`.
4. Test successful, failed, delayed, duplicate, reversed and refunded events.
5. Confirm reconciliation, payout and receipt procedures.

Browser code never marks a donation successful. Only a verified server-side
payment event may do that.

## Netlify

The existing Netlify site ID is:

```text
f304ee18-0aae-4b6d-9777-cdd73528e91c
```

`netlify.toml` defines the build, publish directory, redirects, caching and
security headers.

Use a draft deploy before production:

```bash
npx netlify link --id f304ee18-0aae-4b6d-9777-cdd73528e91c
npx netlify deploy
```

Do not use `--prod` until the preview has passed content, legal, database,
Identity and payment-provider review.

## Production checklist

- [ ] Apply the PostgreSQL schema and verify backups
- [ ] Configure Netlify Identity and administrator roles
- [ ] Review and approve campaign facts, totals and images
- [ ] Complete legal review of Privacy, Terms and Refunds pages
- [ ] Approve Mavericks code of conduct and safeguarding procedure
- [ ] Connect transactional email
- [ ] Complete payment provider onboarding and webhook tests
- [ ] Run mobile, accessibility, security and performance checks
- [ ] Train campaign, finance, support and Mavericks administrators
- [ ] Create a rollback point before production launch
