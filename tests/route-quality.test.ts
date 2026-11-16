import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

function filesUnder(directory: string, extension: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? filesUnder(path, extension)
      : path.endsWith(extension)
        ? [path]
        : [];
  });
}

function routeForPage(pageFile: string) {
  const directory = relative(join(root, "app"), join(pageFile, ".."));
  if (!directory) return "/";
  return `/${directory.split(sep).filter((part) => !part.startsWith("(")).join("/")}`;
}

function routeMatches(target: string, route: string) {
  const targetParts = target.split("/").filter(Boolean);
  const routeParts = route.split("/").filter(Boolean);
  return (
    targetParts.length === routeParts.length &&
    routeParts.every(
      (part, index) => part.startsWith("[") || part === targetParts[index],
    )
  );
}

describe("More routes and public link quality", () => {
  it("has a page for every literal internal link", () => {
    const sourceFiles = [
      ...filesUnder(join(root, "app"), ".tsx"),
      ...filesUnder(join(root, "components"), ".tsx"),
    ];
    const routes = filesUnder(join(root, "app"), "page.tsx").map(routeForPage);
    const targets = new Set<string>();

    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/href=["'](\/[^"'#?]*)["']/g)) {
        targets.add(match[1] || "/");
      }
    }

    const missing = [...targets].filter(
      (target) => !routes.some((route) => routeMatches(target, route)),
    );
    assert.deepEqual(missing, []);
  });

  it("uses a full page shell for every route in the More menu", () => {
    const moreRoutes = [
      "mxm",
      "start",
      "blog",
      "stories",
      "impact",
      "gallery",
      "events",
      "partners",
      "faq",
      "trust-and-safety",
      "ai-agent",
      "subscribe",
      "support",
      "contact",
    ];

    for (const route of moreRoutes) {
      const page = join(root, "app", route, "page.tsx");
      assert.ok(existsSync(page), `Missing /${route}`);
      assert.match(readFileSync(page, "utf8"), /PageHero/, `/${route} needs PageHero`);
    }
  });

  it("removes vague promotional phrases from More pages", () => {
    const sources = [
      "mxm",
      "blog",
      "stories",
      "impact",
      "gallery",
      "events",
      "partners",
      "trust-and-safety",
      "ai-agent",
      "subscribe",
      "contact",
    ].map((route) => readFileSync(join(root, "app", route, "page.tsx"), "utf8"));
    sources.push(readFileSync(join(root, "components", "site-footer.tsx"), "utf8"));
    const copy = sources.join("\n");
    const removedPhrases = [
      "Selected moments from Makerere Kivulu, optimized for fast viewing.",
      "People, generosity and impact in motion.",
      "Notes from the work of building trusted giving.",
      "The lessons, people and progress behind the platform.",
      "Beyond money raised: what changed?",
      "Learn, connect and serve with the MpaMpe community.",
      "Bring resources, reach or expertise to community-led impact.",
      "Community is what makes MxM possible.",
      "A future assistant for organizers, donors and the MpaMpe team.",
      "Stay close to campaign progress and community updates.",
      "We are here to help you find the next step.",
      "Stay close to the impact",
      "Campaign updates, community stories and ways to help.",
      "A giving platform helping people and communities reach more, raise more and do more.",
    ];

    for (const phrase of removedPhrases) {
      assert.ok(!copy.includes(phrase), `Remove: ${phrase}`);
    }
  });

  it("shows the full image-card grid on the gallery route", () => {
    const gallery = readFileSync(join(root, "app", "gallery", "page.tsx"), "utf8");
    assert.match(gallery, /GalleryGrid/);
    assert.match(gallery, /galleryImages/);
    assert.doesNotMatch(gallery, /images=\{mxmGalleryImages\}/);
    assert.doesNotMatch(gallery, /GalleryCarousel/);
    assert.ok(existsSync(join(root, "components", "gallery-grid.tsx")));
  });
});
