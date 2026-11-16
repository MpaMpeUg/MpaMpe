"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export const siteNavigation = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/mavericks", label: "Mavericks" },
] as const;

export const moreNavigation = [
  { href: "/mxm", label: "MpaMpe Xmas Mission" },
  { href: "/start", label: "Start a Campaign" },
  { href: "/blog", label: "Blog" },
  { href: "/stories", label: "Stories" },
  { href: "/impact", label: "Impact" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
  { href: "/faq", label: "FAQ" },
  { href: "/trust-and-safety", label: "Trust & Safety" },
  { href: "/ai-agent", label: "MpaMpe AI" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLDetailsElement>(null);
  const moreActive = moreNavigation.some((link) => pathname === link.href);

  function closeNavigation() {
    setOpen(false);
    moreRef.current?.removeAttribute("open");
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>
            Explore active campaigns today. <Link href="/campaigns">Learn more</Link>
          </span>
          <div className="top-strip-contact">
            <a href="tel:+256757163101">+256 757 163 101</a>
            <a href="mailto:info@mpampe.com">info@mpampe.com</a>
            <Link className="top-strip-sign-in" href="/dashboard">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <nav className="container nav-shell" aria-label="Primary navigation">
        <Link
          className="brand"
          href="/"
          aria-label="MpaMpe home"
          onClick={closeNavigation}
        >
          <Image
            src="/images/logo-1.png"
            alt="MpaMpe"
            width={202}
            height={40}
            priority
          />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-menu ${open ? "is-open" : ""}`}>
          <ul>
            {siteNavigation.map((link) => (
              <li key={link.href}>
                <Link
                  className={pathname === link.href ? "active" : undefined}
                  href={link.href}
                  onClick={closeNavigation}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-more-item">
              <details className="nav-more" ref={moreRef}>
                <summary className={moreActive ? "active" : undefined}>
                  More
                  <ChevronDown
                    className="nav-more-chevron"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                </summary>
                <div className="nav-more-menu">
                  <ul>
                    {moreNavigation.map((link) => (
                      <li key={link.href}>
                        <Link
                          className={pathname === link.href ? "active" : undefined}
                          href={link.href}
                          onClick={closeNavigation}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
