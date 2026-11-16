import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("campaign presentation", () => {
  it("marks campaign card images for proportion-preserving rendering", () => {
    const campaignCard = readFileSync("components/campaign-card.tsx", "utf8");

    assert.match(campaignCard, /className="campaign-card-image"/);
  });

  it("keeps listing and detail images inside responsive aspect-ratio frames", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const detailPage = readFileSync("app/campaigns/[slug]/page.tsx", "utf8");

    assert.match(css, /\.campaign-image\s*\{[^}]*aspect-ratio:/);
    assert.match(
      css,
      /\.campaign-card-image,\s*\.campaign-detail-image img\s*\{[^}]*object-fit:\s*contain;/,
    );
    assert.match(detailPage, /className="campaign-detail-photo"/);
  });

  it("allows the campaign image quality levels used by the responsive images", () => {
    const nextConfig = readFileSync("next.config.ts", "utf8");

    assert.match(nextConfig, /qualities:\s*\[75, 82, 88\]/);
  });
});
