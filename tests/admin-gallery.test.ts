import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { User } from "@supabase/supabase-js";
import { buildCampaignPublicationDraft } from "../lib/admin";
import { campaignCreationRedirect } from "../lib/auth-state";
import {
  campaigns,
  galleryImages,
  mxmGalleryImages,
  pixGalleryImages,
} from "../lib/data";
import { shuffleGalleryImages } from "../lib/gallery";

describe("campaign operations and gallery", () => {
  it("redirects signed-out organizers and allows authenticated organizers", () => {
    assert.equal(campaignCreationRedirect(null), "/dashboard?next=/start");
    assert.equal(campaignCreationRedirect({ id: "user-1" } as User), null);
  });

  it("builds a safe public campaign draft from an approved application", () => {
    const draft = buildCampaignPublicationDraft({
      applicationId: "application-1",
      slug: "  Help Oscar Again! ",
      shortTitle: "Oscar again",
      imageUrl: "https://example.test/campaign.webp",
    });

    assert.equal(draft.slug, "help-oscar-again");
    assert.equal(draft.applicationId, "application-1");
    assert.equal(draft.status, "active");
  });

  it("uses the supplied completed-campaign images and a curated MxM gallery", () => {
    assert.equal(campaigns[0].image, "/images/campaign-oscar-actual.webp");
    assert.equal(campaigns[1].image, "/images/campaign-joel-actual.webp");
    assert.equal(campaigns[2].slug, "mxm-2026-christmas-mission");
    assert.ok(!campaigns.some((campaign) => campaign.slug === "equip-mpampe-mavericks"));
    assert.equal(mxmGalleryImages.length, 12);
    assert.ok(mxmGalleryImages.every((image) => image.src.endsWith(".webp")));
    assert.ok(galleryImages.length > mxmGalleryImages.length);
    assert.ok(!galleryImages.some((image) => image.src.includes("/optimized/gallery-")));
    assert.ok(galleryImages.some((image) => image.src.includes("campaign-oscar")));
  });

  it("includes every PIX photo as an HD gallery source", () => {
    assert.equal(pixGalleryImages.length, 48);
    assert.ok(pixGalleryImages.every((image) => image.src.startsWith("/images/gallery/pix/")));
    assert.ok(
      pixGalleryImages.every((image) =>
        existsSync(`public${image.src.replaceAll("/", "\\")}`),
      ),
    );
    assert.ok(galleryImages.length >= pixGalleryImages.length);
  });

  it("shuffles a copy without mutating the gallery source", () => {
    const source = [1, 2, 3, 4] as const;
    assert.deepEqual(shuffleGalleryImages(source, () => 0), [2, 3, 4, 1]);
    assert.deepEqual(source, [1, 2, 3, 4]);
  });

  it("keeps the gallery route cacheable while shuffling after navigation", () => {
    const page = readFileSync("app/gallery/page.tsx", "utf8");
    const grid = readFileSync("components/gallery-grid.tsx", "utf8");
    assert.doesNotMatch(page, /force-dynamic/);
    assert.match(grid, /shuffleGalleryImages/);
    assert.match(grid, /useEffect/);
    assert.match(grid, /unoptimized/);
  });

  it("reveals large galleries card by card instead of observing one oversized grid", () => {
    const grid = readFileSync("components/gallery-grid.tsx", "utf8");
    assert.doesNotMatch(grid, /className="gallery-card-grid" data-reveal-stagger/);
    assert.match(grid, /className="gallery-image-card"[\s\S]*?data-reveal/);
  });

  it("installs the global toast provider in the root layout", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    assert.match(layout, /ToastProvider/);
  });

  it("allocates a visible mobile grid row for every MxM preview image", () => {
    const styles = readFileSync("app/globals.css", "utf8");
    assert.match(styles, /\.mxm-gallery\s*{[\s\S]*?grid-template-rows:\s*repeat\(3,\s*190px\)/);
    assert.match(styles, /\.mxm-gallery\s*{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?grid-template-rows:\s*repeat\(6,\s*280px\)/);
  });

  it("protects admin actions with app-metadata authorization", () => {
    const route = readFileSync(
      "app/api/admin/campaign-applications/[id]/approve/route.ts",
      "utf8",
    );
    assert.match(route, /isSupabaseAdmin/);
    assert.match(route, /approve_campaign_application/);
  });

  it("protects gallery administration and stores uploaded images in Supabase", () => {
    const route = readFileSync("app/api/admin/gallery/route.ts", "utf8");
    const statusRoute = readFileSync(
      "app/api/admin/gallery/[id]/status/route.ts",
      "utf8",
    );
    const repository = readFileSync("lib/admin-repository.ts", "utf8");
    const migration = readFileSync(
      "database/migrations/20261115113457_add_gallery_management.sql",
      "utf8",
    );

    assert.match(route, /isSupabaseAdmin/);
    assert.match(route, /gallery-images/);
    assert.match(statusRoute, /isSupabaseAdmin/);
    assert.match(repository, /gallery_items/);
    assert.match(migration, /enable row level security/i);
    assert.match(migration, /app_metadata/);
  });
});
