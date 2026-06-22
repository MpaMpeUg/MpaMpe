"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/start", label: "Start a campaign" },
  { href: "/mavericks", label: "Mavericks" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>Trusted community giving, built in Uganda.</span>
          <div>
            <a href="tel:+256757163101">+256 757 163 101</a>
            <span aria-hidden="true"> · </span>
            <a href="mailto:info@mpampe.com">info@mpampe.com</a>
          </div>
        </div>
      </div>
      <nav className="container nav-shell" aria-label="Primary navigation">
        <Link
          className="brand"
          href="/"
          aria-label="MpaMpe home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
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
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={pathname === link.href ? "active" : undefined}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link
              className="text-link"
              href="/dashboard"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              className="button button-small"
              href="/campaigns"
              onClick={() => setOpen(false)}
            >
              Give now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
