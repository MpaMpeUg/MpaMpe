import type { Metadata } from "next";
import { CircleAlert, HandCoins, Megaphone, UserRound } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with donations, campaigns, accounts and safety reports.",
};

const supportOptions = [
  {
    icon: HandCoins,
    title: "Donation support",
    copy: "Ask about a payment attempt, receipt, refund request or campaign total.",
    href: "/contact",
  },
  {
    icon: Megaphone,
    title: "Campaign support",
    copy: "Get help with an application, published campaign or organizer update.",
    href: "/contact",
  },
  {
    icon: UserRound,
    title: "Account support",
    copy: "Get help signing in, confirming an account or updating profile details.",
    href: "/dashboard",
  },
  {
    icon: CircleAlert,
    title: "Report a concern",
    copy: "Report suspicious payment instructions, inaccurate information or unsafe conduct.",
    href: "/contact",
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Get help with MpaMpe."
        description="Choose the topic that matches your question. Never include a Mobile Money PIN, card PIN or password."
      />
      <section className="section">
        <div className="container value-grid" data-reveal-stagger>
          {supportOptions.map(({ icon: Icon, title, copy, href }) => (
            <article className="value-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link className="card-link" href={href}>
                Get support
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section-tight">
        <div className="container cta-band">
          <div>
            <span className="eyebrow eyebrow-light">Direct contact</span>
            <h2>Email or call the MpaMpe team.</h2>
          </div>
          <Link className="button" href="/contact">
            Contact MpaMpe
          </Link>
        </div>
      </section>
    </>
  );
}
