import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { impactStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "See MpaMpe's campaign outcomes, community mobilization and approach to transparent impact reporting.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Our impact"
        title="Campaign results and verified totals."
        description="View confirmed support, completed campaigns and reported outcomes."
      />
      <section className="section">
        <div className="container impact-strip-inner" data-reveal-stagger>
          {impactStats.map((stat) => (
            <div className="impact-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section section-muted">
        <div className="container split-section">
          <div className="content-panel" data-reveal>
            <span className="eyebrow">Reporting with context</span>
            <h2>Every number should connect to a real outcome.</h2>
            <p>
              As the dynamic platform launches, MpaMpe will distinguish between
              amounts pledged, payments verified, funds disbursed and outcomes
              reported.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-list-icon">1</span>
                <div>
                  <strong>Verified giving</strong>
                  <p>Only confirmed payment events contribute to public totals.</p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">2</span>
                <div>
                  <strong>Clear disbursements</strong>
                  <p>Payout records connect campaign funding to approved use.</p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">3</span>
                <div>
                  <strong>Campaign outcomes</strong>
                  <p>Completed campaigns share updates and impact evidence.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="gallery-grid" data-reveal-stagger>
            {["/images/impact-1.webp", "/images/impact-2.webp", "/images/impact-3.webp"].map(
              (image, index) => (
                <div className="gallery-tile" key={image}>
                  <Image
                    src={image}
                    alt={`MpaMpe community impact moment ${index + 1}`}
                    fill
                    sizes="(max-width: 680px) 100vw, 35vw"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container cta-band">
          <div>
            <span className="eyebrow eyebrow-light">Current campaigns</span>
            <h2>View campaigns accepting support.</h2>
          </div>
          <Link className="button" href="/campaigns">
            Explore campaigns
          </Link>
        </div>
      </section>
    </>
  );
}
