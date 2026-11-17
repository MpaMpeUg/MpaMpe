import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { moreNavigation } from "../components/site-header";
import { impactStats, maverickOpportunities, stories } from "../lib/data";

describe("public content refresh", () => {
  it("reports the current Mavericks community and keeps expressions of interest open", () => {
    assert.ok(
      impactStats.some(
        (stat) => stat.value === "35" && stat.label === "Mavericks community members",
      ),
    );
    assert.ok(
      maverickOpportunities.every(
        (opportunity) => !("closingDate" in opportunity),
      ),
    );

    const page = readFileSync("app/mavericks/page.tsx", "utf8");
    assert.doesNotMatch(page, /Apply by|closingDate|formatDate/);
    assert.match(page, /Expressions of interest remain open/);
  });

  it("keeps the Mavericks form connected to validated Supabase submissions", () => {
    const form = readFileSync("components/submission-forms.tsx", "utf8");
    const route = readFileSync("app/api/mavericks/route.ts", "utf8");
    const repository = readFileSync("lib/repository.ts", "utf8");
    const schema = readFileSync("database/schema.sql", "utf8");

    assert.match(form, /submitJson\("\/api\/mavericks"/);
    assert.match(route, /maverickSchema\.safeParse/);
    assert.match(route, /saveSubmission\("maverick"/);
    assert.match(repository, /supabase\.from\("submissions"\)\.insert/);
    assert.match(schema, /create table if not exists submissions/);
  });

  it("uses the actual Oscar and Joel campaign images in the blog", () => {
    const oscar = stories.find((story) => story.slug === "oscar-tuition-campaign");
    const joel = stories.find((story) => story.slug === "joel-heart-surgery");

    assert.equal(oscar?.image, "/images/campaign-oscar-actual.webp");
    assert.equal(joel?.image, "/images/campaign-joel-actual.webp");

    const blogPage = readFileSync("app/blog/page.tsx", "utf8");
    const postPage = readFileSync("app/blog/[slug]/page.tsx", "utf8");
    assert.match(blogPage, /blog-featured/);
    assert.match(postPage, /blog-article-shell/);
  });

  it("renders named founder flip cards with the homepage founder images", () => {
    assert.equal(existsSync("components/founder-cards.tsx"), true);
    const aboutPage = readFileSync("app/about/page.tsx", "utf8");
    const founders = existsSync("components/founder-cards.tsx")
      ? readFileSync("components/founder-cards.tsx", "utf8")
      : "";

    assert.match(aboutPage, /<FounderCards/);
    for (const name of ["Maria Luzinda B", "Ronnie Atuhaire", "Angella Bukirwa"]) {
      assert.match(founders, new RegExp(name));
    }
    for (const image of ["team-1.webp", "team-2.webp", "team-3.webp"]) {
      assert.match(founders, new RegExp(`/images/optimized/${image}`));
    }
    assert.match(founders, /aria-pressed/);
  });

  it("publishes Awards and Recognition in public navigation", () => {
    assert.ok(moreNavigation.some((link) => link.href === "/awards"));
    assert.equal(existsSync("app/awards/page.tsx"), true);
    assert.equal(existsSync("lib/recognitions.ts"), true);

    const homepage = readFileSync("public/legacy-home/index.html", "utf8");
    const sitemap = readFileSync("app/sitemap.ts", "utf8");
    const awards = existsSync("app/awards/page.tsx")
      ? readFileSync("app/awards/page.tsx", "utf8")
      : "";

    assert.match(homepage, /href="\/awards"/);
    assert.match(sitemap, /"\/awards"/);
    assert.match(awards, /MpaMpe Awards &amp; Recognition|MpaMpe Awards/);
    assert.match(awards, /Africa Startup Ecosystem Builders/);
    assert.match(awards, /MpaMpe in the news/);
  });
});
