import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import MxMPage from "../app/mxm/page";
import { moreNavigation, siteNavigation } from "../components/site-header";
import { NewsletterForm } from "../components/submission-forms";
import { ToastProvider } from "../components/toast-provider";
import { stories } from "../lib/data";

describe("public experience updates", () => {
  it("uses a More menu for the extended public routes", () => {
    assert.deepEqual(siteNavigation, [
      { href: "/", label: "Home" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About" },
      { href: "/campaigns", label: "Campaigns" },
      { href: "/mavericks", label: "Mavericks" },
    ]);
    assert.ok(moreNavigation.some((link) => link.href === "/gallery"));
    assert.ok(moreNavigation.some((link) => link.href === "/mxm"));
    assert.ok(moreNavigation.some((link) => link.href === "/contact"));
    assert.ok(moreNavigation.some((link) => link.href === "/blog"));
    assert.ok(moreNavigation.some((link) => link.href === "/support"));
  });

  it("publishes the supplied MxM 2026 call and embedded registration form", () => {
    const markup = renderToStaticMarkup(createElement(MxMPage));

    assert.match(markup, /MpaMpe Xmas Mission 2026/);
    assert.match(markup, /0753 361 120/);
    assert.match(markup, /17[^<]*Mavericks/);
    assert.match(markup, /520,000/);
    assert.match(markup, /254[^<]*people/);
    assert.match(
      markup,
      /docs\.google\.com\/forms\/d\/e\/1FAIpQLScx0a2XHXGysO1n-_cE_5-GxuHQjiqLfCXi-5JhePgxzfSeaA\/viewform\?embedded=true/,
    );
  });

  it("uses real MpaMpe campaigns as blog stories", () => {
    assert.ok(stories.some((story) => story.slug === "oscar-tuition-campaign"));
    assert.ok(stories.some((story) => story.slug === "joel-heart-surgery"));
    assert.ok(stories.some((story) => story.slug === "mxm-2025-impact"));
  });

  it("does not expose backend implementation copy on the dashboard", () => {
    const markup =
      readFileSync("app/dashboard/page.tsx", "utf8") +
      readFileSync("components/auth-panel.tsx", "utf8");

    assert.doesNotMatch(markup, /Accounts are powered by Supabase Auth/i);
    assert.doesNotMatch(markup, /New accounts use Supabase Auth/i);
  });

  it("serves the legacy icon font files from public", () => {
    for (const file of ["icomoon.eot", "icomoon.ttf", "icomoon.woff"]) {
      assert.equal(
        existsSync(path.join(process.cwd(), "public", "fonts", file)),
        true,
        `${file} should be publicly served`,
      );
    }
  });

  it("gives every newsletter form a unique accessible email input", () => {
    const markup = renderToStaticMarkup(
      createElement(
        ToastProvider,
        null,
        createElement(Fragment, null, createElement(NewsletterForm), createElement(NewsletterForm)),
      ),
    );
    const ids = [...markup.matchAll(/id="(newsletter-email[^\"]*)"/g)].map(
      (match) => match[1],
    );

    assert.equal(ids.length, 2);
    assert.equal(new Set(ids).size, 2);
  });

  it("keeps contact and sign-in actions visible across route headers", () => {
    const headerSource = readFileSync("components/site-header.tsx", "utf8");

    assert.match(headerSource, /href="tel:\+256757163101"/);
    assert.match(headerSource, /href="mailto:info@mpampe\.com"/);
    assert.match(
      headerSource,
      /className="top-strip-sign-in" href="\/dashboard"/,
    );
  });
});
