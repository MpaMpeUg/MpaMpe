# Creator Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real, owner-scoped campaign creator dashboard backed by Supabase.

**Architecture:** The server-rendered dashboard reads creator-owned rows through Supabase RLS. Focused authenticated APIs handle campaign-copy and update mutations, while PostgreSQL limits campaign editing to safe public fields.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Auth/Postgres/Storage, Zod, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-15-creator-dashboard-design.md`

## Global Constraints

- Preserve the homepage and its assets unchanged.
- Never expose a Supabase service-role key.
- Every creator read and write must be scoped to `auth.uid()`.
- Do not expose private pledge or donor contact information.
- Do not deploy or push code.

## Review Focus

- A signed-out visitor must see the existing authentication experience, not creator data.
- A signed-in user must never read or mutate another organizer's private campaign records.
- Empty accounts must render useful empty states without seeded/demo records.
- A failed mutation must preserve form data and display a toast.
- Campaign editing must not permit status, totals, verification, ownership or slug changes.

---

### Task 1: Dashboard contract and database authorization

**Files:**
- Create: `tests/creator-dashboard.test.ts`
- Create: `database/migrations/<timestamp>_creator_dashboard.sql`
- Create: `lib/creator-dashboard.ts`

**Interfaces:**
- Produces: `CreatorDashboardData`, `getCreatorDashboardData(userId)`, and the `update_organizer_campaign` RPC.

- [ ] Write failing tests for dynamic data, owner filters, safe mutation fields and organizer update policies.
- [ ] Run the targeted test and confirm it fails.
- [ ] Create the migration with the Supabase CLI, then implement owner-aware policies, role trigger and narrow campaign update RPC.
- [ ] Implement the server repository with parallel independent reads and privacy-safe related data.
- [ ] Run the targeted tests and Supabase rollback workflow.

### Task 2: Authenticated creator dashboard UI

**Files:**
- Create: `components/creator-dashboard.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `components/auth-panel.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `CreatorDashboardData`.
- Produces: dynamic overview, application, campaign, backer, document and update sections.

- [ ] Add failing source/behavior checks for the dynamic dashboard and removal of hard-coded stats.
- [ ] Render the login panel only when signed out; render the creator dashboard when signed in.
- [ ] Add responsive dashboard cards, accessible forms, empty states and settlement notice.
- [ ] Run targeted tests and the React quality checklist.

### Task 3: Creator mutation APIs

**Files:**
- Create: `app/api/organizer/campaigns/[id]/route.ts`
- Create: `app/api/organizer/campaigns/[id]/updates/route.ts`
- Create: `app/api/organizer/campaign-updates/[id]/route.ts`
- Modify: `lib/validation.ts`

**Interfaces:**
- Produces: authenticated `PATCH`, `POST` and `DELETE` routes used by `CreatorDashboard`.

- [ ] Add failing tests for authentication, safe JSON parsing, ownership-safe operations and cache revalidation.
- [ ] Implement campaign editing through the narrow RPC.
- [ ] Implement update creation/deletion under owner-aware RLS.
- [ ] Return specific `400`, `401`, `404` and success responses.
- [ ] Run targeted tests and signed-out API checks.

### Task 4: Full verification

**Files:**
- Modify: `docs/IMPLEMENTATION_STATUS.md`

- [ ] Apply the reviewed migration to the connected Supabase project.
- [ ] Run rollback-only database tests for organizer and cross-owner behavior.
- [ ] Run all tests, lint, typecheck and production build.
- [ ] Validate signed-out and authenticated dashboard rendering locally.
- [ ] Confirm no homepage files changed in this dashboard pass and report remaining Mobile Money limitations.

