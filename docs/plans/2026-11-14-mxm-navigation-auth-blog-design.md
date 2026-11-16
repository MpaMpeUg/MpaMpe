# MpaMpe MxM, Navigation, Auth, and Blog Design

## Goal

Extend the local MpaMpe platform without changing the homepage visual identity. Add a dedicated MpaMpe Xmas Mission 2026 page, make every public route discoverable, restore legacy icons, improve account entry, and replace placeholder blog material with verified campaign stories.

## Navigation

Keep Home, How It Works, About, Campaigns, and Mavericks as primary items. Replace Contact with a More dropdown on both the legacy homepage and Next.js route header. The dropdown exposes MxM, Start a Campaign, Blog, Stories, Impact, Events, Partners, FAQ, Trust & Safety, MpaMpe AI, Subscribe, Support, and Contact. Legal routes remain in the footer.

The route header uses an accessible native disclosure pattern. The legacy homepage uses the theme's existing nested-menu markup so its desktop hover and mobile menu behavior remain intact.

## MxM 2026

Create `/mxm` as an annual mission landing page using the existing route-page design system and orange `#ff5528` theme. The page contains:

- A 2026 open-call hero and direct registration button.
- Donation and volunteering options supplied by MpaMpe.
- The supplied contact number, `0753 361 120`.
- An embedded Google Form with an external-open fallback.
- A verified 2025 impact section: 17 Mavericks, UGX 520,000 raised, and 254 people reached.
- A gallery using the four existing November 2025 MpaMpe field photographs.
- A concise list of the clothing, shoes, hygiene support, food, and gifts distributed in 2025.

## Campaign blog

Publish first-party case-study articles for Oscar Nigyema's tuition campaign, Joel Mugisha's heart surgery, and MxM 2025. Dates and figures reflect the campaign records and linked source material already present in the project. Each article may link to the original MpaMpe update or video for verification.

## Account entry

Remove internal implementation language about Supabase from public-facing copy. Retain Supabase Auth behind the form. Present sign-in and registration as a balanced two-column experience with clear mode tabs, account benefits, input affordances, and responsive alignment.

## Console and icon fixes

Serve the existing Icomoon font files from `public/fonts` so `/css/flaticon.css` resolves them. Add hydration-warning tolerance at the root body because Grammarly injects attributes before React hydrates. The MetaMask messages are extension-originated and require no application wallet change.

## Boundaries

No production deploy, push, payment activation, or live database mutation is included. The existing homepage animations, imagery, and layout remain in place.
