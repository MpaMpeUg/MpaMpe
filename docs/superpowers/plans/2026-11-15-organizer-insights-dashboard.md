# Organizer Insights Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a compact, privacy-safe and Mobile-Money-ready analytics workspace for campaign organizers.

**Architecture:** Aggregate confirmed donation insights in an authenticated owner-scoped Supabase function, load the result in the existing server repository, and render semantic lightweight visuals in the existing creator dashboard. Keep recent supporter rows privacy-safe through the public backer view.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase Postgres/Auth, native SVG/CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-11-15-organizer-insights-design.md`

## Global Constraints

- Do not modify the homepage.
- Count only `successful` and `completed` donations.
- Do not expose donor email, phone, provider reference or payment payload.
- Use `auth.uid()` for organizer ownership.
- Add no charting dependency.

## Review Focus

- No campaigns or donations: show zero values and useful empty states.
- A previous 30-day period with zero giving: display a sensible growth state without division by zero.
- Anonymous donations: preserve `Anonymous` in tables and exports.
- Multiple currencies: keep the current UGX platform assumption explicit and avoid mixing labels silently.
- Large gift totals: charts scale from the maximum bucket and remain readable.

---

### Task 1: Insight model and calculations

**Files:**
- Modify: `tests/creator-dashboard.test.ts`
- Modify: `lib/creator-dashboard.ts`

**Interfaces:**
- Produces: `CreatorDashboardInsights`, `insightGrowthPercent()` and chart-safe insight values.

- [ ] Write failing tests for insight summary, zero-period growth and chart data.
- [ ] Run the focused test and confirm it fails for missing insight interfaces.
- [ ] Implement the insight types and pure calculations.
- [ ] Run the focused test and confirm it passes.

### Task 2: Secure Supabase insight aggregation

**Files:**
- Create: `database/migrations/20261115_organizer_dashboard_insights.sql`
- Modify: `lib/creator-dashboard-repository.ts`
- Modify: `tests/creator-dashboard.test.ts`

**Interfaces:**
- Produces: authenticated RPC `get_organizer_dashboard_insights()` returning totals, monthly buckets and campaign rows.
- Consumes: `CreatorDashboardInsights`.

- [ ] Write failing structural tests for authenticated ownership, confirmed statuses and private-field exclusion.
- [ ] Run the focused test and confirm failure.
- [ ] Add the migration and repository mapping.
- [ ] Apply and query the migration against the connected Supabase project.
- [ ] Run the focused test and confirm it passes.

### Task 3: Organizer insight visuals and supporter tools

**Files:**
- Create: `components/creator-insights.tsx`
- Modify: `components/creator-dashboard.tsx`
- Modify: `app/globals.css`
- Modify: `tests/creator-dashboard.test.ts`

**Interfaces:**
- Consumes: `CreatorDashboardInsights` and privacy-safe `CreatorBacker` rows.
- Produces: KPI cards, monthly giving visual, campaign performance visual, supporter table and CSV export.

- [ ] Write failing rendering tests for Insights, Supporters and accessible visual labels.
- [ ] Run the focused test and confirm failure.
- [ ] Implement the component and integrate it into the dashboard navigation.
- [ ] Add responsive styles and reduced-motion behavior.
- [ ] Run the focused test and confirm it passes.

### Task 4: Full verification and readiness documentation

**Files:**
- Modify: `docs/IMPLEMENTATION_STATUS.md`

- [ ] Run all tests, lint, typecheck and `git diff --check`.
- [ ] Stop only this workspace's dev server, run the production build, then restart locally.
- [ ] Verify guest dashboard, authenticated ownership paths and organizer mutation protection.
- [ ] Confirm no temporary database records remain and document the Mobile Money handoff.
