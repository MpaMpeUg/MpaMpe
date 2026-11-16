# Organizer Insights Dashboard Design

## Intent

Give every signed-in MpaMpe campaign organizer a compact workspace that explains campaign performance at a glance and still supports detailed review of campaigns, supporters, applications and updates. The dashboard must work with the current Supabase donation records and automatically include future Mobile Money gifts once the payment webhook confirms them.

## Goals

- Show useful live statistics: confirmed giving, active campaigns, supporters, average gift and recent giving.
- Show visual insights for the latest six months and campaign-by-campaign performance.
- Let organizers inspect recent backers while preserving anonymous donor privacy.
- Keep campaign editing, updates, application status and settlement readiness in the same workspace.
- Keep the experience responsive, accessible and fast without adding a charting dependency.
- Enforce organizer ownership in the database rather than trusting a browser-supplied organizer id.

## Non-goals

- Initiating organizer payouts before a Mobile Money provider is connected.
- Showing donor email, phone number, provider references or payment payloads to organizers.
- Adding analytics to the preserved homepage.
- Building financial accounting, refunds or tax reporting in this iteration.

## Constraints

- `/` and its legacy visual experience remain unchanged.
- Supabase is the source of truth for authentication, campaigns and confirmed donations.
- Only donations with `successful` or `completed` status count in insights.
- Anonymous gifts are labelled `Anonymous` everywhere.
- Orange `#ff5528` remains the primary theme color.
- Charts must include text or table equivalents and must not depend on JavaScript-only canvas rendering.

## Approaches considered

### Client-side aggregation of the public backer list

Simple, but inaccurate once the list is paginated or capped and needlessly sends more donation rows to the browser.

### Owner-scoped Supabase insight function with native React visuals — selected

A security-definer Postgres function uses `auth.uid()` to aggregate only campaigns owned by the current organizer. The Next server requests one compact JSON result and renders lightweight semantic SVG/CSS visuals. This is accurate, fast and automatically accommodates confirmed Mobile Money records later.

### Third-party analytics or charting service

Powerful but adds cost, tracking concerns and bundle weight before MpaMpe needs advanced analytics.

## Experience

The organizer lands on a compact overview with primary KPIs. An Insights section shows a six-month giving chart, 30-day movement, average gift, anonymous-giving share and per-campaign progress. A Supporters section shows privacy-safe recent backers, campaign, amount and date, with a CSV export for organizer reporting. Existing application review, campaign editing and campaign updates remain available below.

Empty states explain what will appear after the first confirmed donation. A settlement card makes clear that confirmed funds currently settle to MpaMpe and that payout controls will activate when the Mobile Money provider is connected.

## Data and security

`get_organizer_dashboard_insights()` accepts no organizer id. It derives the user from `auth.uid()`, aggregates confirmed donations joined to owned campaigns, and returns totals, six monthly buckets and per-campaign performance. Execute permission is authenticated-only. The existing public backer view remains the source of the privacy-safe recent list.

## Readiness

When the Mobile Money API is connected, its webhook only needs to write a donation and mark it `successful` or `completed`; the existing campaign total refresh and new insights function will then include it without dashboard changes.
