import type { Metadata } from "next";
import { Building2, Handshake, LineChart, Users } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partner with MpaMpe on campaign support, matching, technology, community outreach and impact.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with MpaMpe"
        title="Partnership options for organizations."
        description="Organizations can support campaigns through funding, matching, services, technology or volunteer teams."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Ways to partner"
            title="Choose a partnership type."
          />
          <div className="value-grid" data-reveal-stagger>
            {[
              [
                Building2,
                "Campaign sponsorship",
                "Support verified campaigns, priority needs or community themes.",
              ],
              [
                Handshake,
                "Matching programmes",
                "Match public donations with clear rules and visible reporting.",
              ],
              [
                Users,
                "Community and skills",
                "Provide volunteers, venues, training, services or local networks.",
              ],
              [
                LineChart,
                "Technology and data",
                "Strengthen payments, security, access, analytics and impact reporting.",
              ],
            ].map(([Icon, title, copy]) => {
              const IconComponent = Icon as typeof Building2;
              return (
                <article className="value-card" key={String(title)}>
                  <IconComponent />
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container cta-band">
          <div>
            <span className="eyebrow eyebrow-light">Partnership enquiry</span>
            <h2>Send your organization and proposal details.</h2>
          </div>
          <Link className="button" href="/contact">
            Contact partnerships
          </Link>
        </div>
      </section>
    </>
  );
}
