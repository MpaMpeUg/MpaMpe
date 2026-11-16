# MpaMpe MxM, Navigation, Auth, and Blog Implementation Plan

1. Add regression tests for the More menus, MxM content and form, verified campaign stories, public copy, and icon assets.
2. Run the focused tests and confirm they fail before implementation.
3. Copy the existing Icomoon font binaries into `public/fonts`.
4. Implement the shared route-header More dropdown and matching legacy homepage dropdown.
5. Build `/mxm` with the supplied 2026 call, embedded registration form, 2025 impact, and existing field images.
6. Replace placeholder blog entries with real campaign case studies and source links.
7. Redesign the unauthenticated account panel while retaining the current Supabase Auth behavior.
8. Remove the unwanted dashboard hero copy and tolerate extension-added hydration attributes.
9. Add `/mxm` to the sitemap and footer navigation.
10. Run tests, type checking, linting, production build, route checks, and visual browser checks at desktop and mobile sizes.
