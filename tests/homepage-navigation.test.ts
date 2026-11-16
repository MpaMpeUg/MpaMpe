import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/page";
import { siteNavigation } from "../components/site-header";

describe("homepage navigation", () => {
  it("renders the public platform routes in the legacy navbar", () => {
    const markup = renderToStaticMarkup(Home());
    const navElement =
      markup.match(/<ul class="main-menu__list[^"]*">[\s\S]*?<\/ul>/)?.[0] ??
      "";
    const navMarkup = navElement.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? "";

    const visibleNavMarkup = navMarkup.replace(/<!--[\s\S]*?-->/g, "");
    const links = Array.from(
      visibleNavMarkup.matchAll(
        /<a href="([^"]+)">\s*([^<]+?)\s*(?:<span[^>]*><\/span>)?<\/a>/g,
      ),
      ([, href, label]) => ({ href, label: label.trim() }),
    );

    assert.deepEqual(links.slice(0, 6), [
      { href: "/", label: "Home" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About" },
      { href: "/campaigns", label: "Campaigns" },
      { href: "/mavericks", label: "Mavericks" },
      { href: "/mxm", label: "More" },
    ]);
    assert.match(visibleNavMarkup, /<a href="\/mxm">MpaMpe Xmas Mission<\/a>/);
    assert.match(visibleNavMarkup, /<a href="\/blog">Blog<\/a>/);
    assert.match(visibleNavMarkup, /<a href="\/gallery">Gallery<\/a>/);
    assert.match(visibleNavMarkup, /<a href="\/contact">Contact<\/a>/);
    assert.doesNotMatch(navElement.match(/^<ul[^>]*>/)?.[0] ?? "", /one-page-scroll-menu/);
    assert.doesNotMatch(visibleNavMarkup, /scrollToLink/);
    assert.match(
      markup,
      /<div class="main-menu-three__logo">\s*<a href="\/">/,
    );
    assert.match(markup, /<div class="logo-box">\s*<a href="\/"/);
  });

  it("routes every homepage giving CTA to the campaigns page", () => {
    const markup = renderToStaticMarkup(Home());
    const givingButtons = Array.from(
      markup.matchAll(
        /<a href="([^"]+)" class="main-slider-three__btn thm-btn">([\s\S]*?)<\/a>/g,
      ),
      ([, href, contents]) => ({
        href,
        label: contents.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
      }),
    );

    assert.deepEqual(givingButtons, [
      { href: "/campaigns", label: "Start Giving" },
      { href: "/campaigns", label: "Donate Now" },
      { href: "/campaigns", label: "Donate Now" },
    ]);
  });

  it("routes the homepage about call-to-action to the about page", () => {
    const markup = renderToStaticMarkup(Home());
    const aboutButton =
      markup.match(/<a href="([^"]+)" class="about-three__btn thm-btn"([^>]*)>/) ??
      [];

    assert.equal(aboutButton[1], "/about");
    assert.doesNotMatch(aboutButton[2] ?? "", /target=/);
  });

  it("keeps the route-page navbar aligned with the homepage navigation", () => {
    assert.deepEqual(siteNavigation, [
      { href: "/", label: "Home" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About" },
      { href: "/campaigns", label: "Campaigns" },
      { href: "/mavericks", label: "Mavericks" },
    ]);
  });

  it("renders the desktop More control with a reliable chevron and mega-menu hook", () => {
    const markup = renderToStaticMarkup(Home());

    assert.match(markup, /<li class="dropdown more-mega-menu">/);
    assert.match(
      markup,
      /<a href="\/mxm">More<span class="more-menu-chevron" aria-hidden="true"><\/span><\/a>/,
    );
  });

  it("replaces the homepage search form with contact and sign-in actions", () => {
    const markup = renderToStaticMarkup(Home());

    assert.doesNotMatch(markup, /main-header-three__search-box/);
    assert.match(markup, /href="tel:\+256757163101"/);
    assert.match(markup, /href="mailto:info@mpampe\.com"/);
    assert.match(
      markup,
      /href="\/dashboard" class="main-header-three__sign-in">Sign in<\/a>/,
    );
  });
});
