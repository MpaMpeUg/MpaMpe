# Private Campaign Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver secure unlisted campaigns and verify the complete organizer-to-donation campaign flow.

**Architecture:** Store campaign visibility and an unguessable token in Supabase, expose private content through token-validating database functions, and thread the token through server-rendered pages and donation/pledge requests. Organizer mutations remain authenticated and owner-scoped.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase Postgres/Auth/RLS, Zod, Node test runner

**Spec:** `docs/superpowers/specs/2026-11-16-private-campaign-management-design.md`

## Global Constraints

- Do not modify the legacy homepage.
- Only approved campaigns can change visibility.
- Never expose private campaigns through public table selects.
- Never place the private token in provider metadata or public supporter data.
- Only confirmed campaign amounts affect progress; tips remain separate.
- Add no chart or UI dependency.

## Review Focus

- Missing/incorrect private token returns not found without leaking existence.
- Toggling an unapproved campaign is rejected.
- Public campaigns remain accessible without a token.
- Anonymous donor display remains `Anonymous` while receipt fields stay private.
- Mobile layout keeps toggle, share link, forms and progress controls usable.

---

### Task 1: Visibility model and security migration

**Files:**
- Modify: `tests/campaign-privacy.test.ts`
- Modify: `lib/types.ts`
- Create: `database/migrations/20261116_private_campaigns.sql`

- [ ] Write failing tests for visibility types, protected policies and token-validating functions.
- [ ] Run the focused tests and verify failure.
- [ ] Add visibility/share-token columns, policies and access functions.
- [ ] Run the focused tests and verify success.

### Task 2: Private campaign reads and links

**Files:**
- Modify: `lib/repository.ts`
- Modify: `app/campaigns/[slug]/page.tsx`
- Modify: `components/donation-panel.tsx`
- Modify: `components/pledge-panel.tsx`

- [ ] Write failing tests for listing exclusion, token reads and token propagation.
- [ ] Run tests and verify failure.
- [ ] Implement public/private repository reads and noindex private metadata.
- [ ] Thread the token into donation and pledge requests.
- [ ] Run tests and verify success.

### Task 3: Organizer visibility controls

**Files:**
- Modify: `lib/creator-dashboard.ts`
- Modify: `lib/creator-dashboard-repository.ts`
- Create: `app/api/organizer/campaigns/[id]/visibility/route.ts`
- Modify: `components/creator-dashboard.tsx`
- Modify: `app/globals.css`

- [ ] Write failing tests for authenticated toggle routes and dashboard controls.
- [ ] Run tests and verify failure.
- [ ] Add owner-scoped API and responsive toggle/share-link interface.
- [ ] Run tests and verify success.

### Task 4: Donation and progress integrity

**Files:**
- Modify: `lib/validation.ts`
- Modify: `lib/payments.ts`
- Modify: `app/api/donations/initiate/route.ts`
- Modify: `tests/repository-shapes.test.ts`
- Modify: `tests/platform.test.ts`

- [ ] Write failing tests for token transport, anonymous giving, tips and confirmed-only progress.
- [ ] Run tests and verify failure.
- [ ] Validate campaign access before donation storage and preserve the amount/tip split.
- [ ] Run tests and verify success.

### Task 5: Full verification

**Files:**
- Modify: `docs/IMPLEMENTATION_STATUS.md`

- [ ] Run all tests, lint, typecheck and diff checks.
- [ ] Run a clean production build and restart the local server.
- [ ] Check public/private routes, guest mutation denial and mobile responsive CSS.
- [ ] Record the pending provider and migration deployment boundaries.
