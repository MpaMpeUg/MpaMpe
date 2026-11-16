# Private Campaign Management Design

## Intent

Allow approved MpaMpe organizers to switch campaigns between public and private without weakening campaign review, donation accounting or supporter privacy. Private campaigns are unlisted and can be opened and supported only with their secure share link. The complete campaign management flow remains usable on desktop and mobile before a Mobile Money provider is selected.

## Goals

- Add an organizer-controlled public/private toggle for approved campaigns.
- Hide private campaigns from discovery, search, sitemap/static generation and direct public database reads.
- Give each private campaign an unguessable share token carried in its link.
- Keep private campaign pages, updates, privacy-safe backers, pledges and donations available when the link token is valid.
- Preserve campaign editing and update publishing/removal.
- Preserve anonymous donations, optional MpaMpe tips and campaign-only progress totals.
- Keep Mobile Money behind the existing provider adapter and signed webhook boundary.
- Keep the dashboard and campaign page responsive, accessible and consistent with the existing MpaMpe design.

## Non-goals

- Password-protected campaigns or invite lists.
- Organizer payouts before a provider and payout process are approved.
- Treating initiated or pending payments as campaign progress.
- Allowing organizers to make unapproved applications publicly accessible.

## Chosen approach

Add `visibility` and `share_token` to approved campaigns. Public table policies expose only public campaigns. Security-definer functions validate either public visibility or the exact share token before returning a private campaign or its backers. Organizer mutation functions use `auth.uid()` and ownership checks. The campaign page carries the token into donation and pledge requests; the token is used for access validation but never stored in payment-provider metadata or exposed in supporter records.

This is safer than merely removing private campaigns from the listing because public database clients cannot enumerate private rows.

## Organizer experience

Each campaign card includes a modern visibility panel. Approved campaigns can be toggled between Public and Private. Private mode displays a copyable share link and explains that the campaign will disappear from discovery. Editing, update publishing and progress reporting remain in the same card. Toast notifications confirm changes or explain errors.

## Supporter experience

Public campaign URLs continue to work unchanged. Private campaign links include `?access=<token>`. A valid link renders the campaign with a Private campaign label, noindex metadata, updates, progress, privacy-safe backers, the donation form and pledge form. Missing or incorrect tokens return the normal not-found page without confirming that a private campaign exists.

## Donation integrity

The donation request carries campaign slug and access token separately. Server validation verifies the campaign is active/funded and accessible before storing an initiated donation. Campaign amount and optional tip remain separate; only confirmed campaign amounts update the progress bar. Anonymous giving masks the public display name while allowing private receipt/contact fields to remain protected.

## Mobile Money readiness

The future provider adapter receives the existing total charge and campaign/tip split. Signed provider callbacks mark payments successful/completed, refresh campaign totals and make them appear in organizer insights. No visual or campaign-management redesign should be required when the provider is selected.
