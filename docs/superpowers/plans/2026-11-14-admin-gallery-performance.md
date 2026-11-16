# MpaMpe Admin, Gallery and Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver protected campaign creation, atomic admin publishing, fast campaign/MxM imagery, a gallery route and consistent toast feedback.

**Architecture:** Keep Supabase as the source of truth. Server components enforce page access; admin API routes validate app-metadata roles; a restricted Postgres function performs approval atomically. Static image assets are optimized before build and rendered responsively.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase Auth/Postgres/Storage, CSS, Sharp

**Spec:** `docs/superpowers/specs/2026-11-14-admin-gallery-performance-design.md`

## Global Constraints

- Preserve the existing homepage UI and motion.
- Use MpaMpe orange `#ff5528`.
- Make no Git push or deployment.
- Use TDD for behavior changes.

## Tasks

- [ ] Add failing tests for protected campaign creation, gallery navigation, toast infrastructure and admin approval safeguards.
- [ ] Optimize and install the supplied Oscar, Joel and selected MxM photographs.
- [ ] Add shared gallery data, the `/gallery` page and the MxM gallery preview.
- [ ] Add the global toast provider and connect account/submission/campaign/payment forms.
- [ ] Protect `/start` and preserve the post-sign-in return path.
- [ ] Add Supabase admin RLS, grants and the atomic campaign approval function.
- [ ] Replace the admin preview with operational read and action views.
- [ ] Verify database behavior with a disposable admin/application and remove test records.
- [ ] Run tests, typecheck, lint, production build and route checks.
