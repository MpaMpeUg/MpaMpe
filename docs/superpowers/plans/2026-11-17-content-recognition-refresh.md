# MpaMpe Content and Recognition Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct public impact data, modernize Blog/About/Mavericks, validate Mavericks submissions, and publish a sourced Awards & Recognition page.

**Architecture:** Keep public content in typed local data, preserve the existing homepage, and reuse the shared route shell. Add one client-only founder-card component for click/keyboard flipping; keep the rest server-rendered. Mavericks submissions continue through the existing validated API into Supabase `submissions`.

**Tech Stack:** Next.js App Router, React, TypeScript, Supabase, Next Image, Lucide icons, CSS.

**Spec:** User request dated 2026-11-17 in this project thread.

## Global Constraints

- Preserve the existing homepage except for adding the Awards route to its More menu.
- Use `#ff5528` as the orange brand color.
- Use actual Oscar, Joel, and homepage founder images already in `public/images`.
- Do not publish unsupported award claims as independently verified facts.
- Keep all layouts responsive and accessible.

## Review Focus

- Founder flip cards must work with click and keyboard and expose their state accessibly.
- Mavericks opportunities must remain open without stale closing dates.
- Mavericks applications must validate and persist to the existing Supabase submissions flow.
- Blog images must preserve their source proportions on cards and detail pages.
- Awards links must open trusted original or institutional sources.

---

### Task 1: Correct impact and Mavericks records

**Files:** `lib/data.ts`, `lib/types.ts`, `app/mavericks/page.tsx`, `tests/content-refresh.test.ts`

- [ ] Add failing assertions for 35 Mavericks and opportunities without closing dates.
- [ ] Update the data model and cards to show evergreen expressions of interest.
- [ ] Verify the focused tests pass.

### Task 2: Validate Mavericks submissions

**Files:** `app/api/mavericks/route.ts`, `components/submission-forms.tsx`, `database/schema.sql`, `tests/content-refresh.test.ts`

- [ ] Add assertions for validated `/api/mavericks` submission and Supabase storage.
- [ ] Keep current toast/error behavior and clarify the open EOI copy.
- [ ] Verify the focused tests pass without creating production test data.

### Task 3: Replace About placeholders with founders

**Files:** `components/founder-cards.tsx`, `app/about/page.tsx`, `app/globals.css`, `tests/content-refresh.test.ts`

- [ ] Add failing assertions for the three named founders and actual optimized homepage images.
- [ ] Build accessible click-to-flip cards with role, bio, and profile link.
- [ ] Verify desktop and mobile CSS rules.

### Task 4: Modernize the blog and campaign stories

**Files:** `lib/data.ts`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/globals.css`, `tests/content-refresh.test.ts`

- [ ] Assert the Oscar and Joel stories use the actual campaign images.
- [ ] Rewrite story copy for clarity and add featured/article layouts.
- [ ] Add responsive, proportion-safe media styling and verify tests.

### Task 5: Add Awards & Recognition

**Files:** `lib/recognitions.ts`, `app/awards/page.tsx`, `components/site-header.tsx`, `public/legacy-home/index.html`, `components/site-footer.tsx`, `app/sitemap.ts`, `app/globals.css`, `tests/content-refresh.test.ts`

- [ ] Add failing route/navigation/content assertions.
- [ ] Publish confirmed awards, separately labelled MpaMpe-record milestones, global stages, and sourced media links.
- [ ] Add `/awards` to More, footer, and sitemap.
- [ ] Run full tests, lint, typecheck, production build, and local route checks.
