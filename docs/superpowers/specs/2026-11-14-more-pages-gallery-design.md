# More pages and gallery design

## Intent

Make every route in the More menu feel like part of the same MpaMpe website,
replace vague promotional copy with factual language, and make the MxM gallery
easier to browse on desktop and mobile.

## Design

- Keep the existing homepage unchanged.
- Keep `PageHero`, orange accents, rounded cards and the existing typography as
  the shared visual system for routes under More.
- Replace generic slogans with page-specific, factual headings and descriptions.
- Show all photographs in a responsive image-card grid with no visible captions.
  Each card may open a full-screen viewer with explicit controls.
- Keep all photographs optimized through `next/image` and responsive `sizes`.
- Turn `/support` into a real support hub instead of redirecting to Contact.
- Verify every literal internal link against the app route tree and request all
  public routes from the local production build.

## Alternatives considered

- A masonry-only gallery is fast but gives weak navigation on mobile.
- A carousel reduces the number of images visible when the page opens.
- The selected all-card grid keeps the whole collection visible while retaining
  optional full-screen keyboard and button navigation.

