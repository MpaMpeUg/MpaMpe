import type { Metadata } from "next";
import { Compass, HandHeart, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About MpaMpe",
  description:
    "Learn about MpaMpe's mission, story and commitment to trusted community giving.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About MpaMpe"
        title="Community generosity, organized for greater impact."
        description="MpaMpe exists to help people and communities tell trusted stories, mobilise support and show what that support made possible."
      />
      <section className="section">
        <div className="container split-section">
          <div className="image-panel">
            <Image
              src="/images/about.webp"
              alt="MpaMpe community members together"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="content-panel">
            <span className="eyebrow">Our story</span>
            <h2>Built from a simple belief: people want to help.</h2>
            <p>
              The difficult part is often trust, coordination and reach.
              MpaMpe began by helping student and community campaigns bring
              their needs into the open with a clear story and shared goal.
            </p>
            <p>
              Today, MpaMpe is growing into a full platform for campaign
              organizers, donors, partners and the Mavericks volunteer
              community.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/campaigns">
                Explore our work
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="What guides us"
            title="Human dignity and operational clarity belong together."
          />
          <div className="value-grid">
            {[
              [
                HandHeart,
                "Compassion",
                "We begin with people, their dignity and the realities behind each need.",
              ],
              [
                ShieldCheck,
                "Trust",
                "We build review, consent, payment verification and accountability into the platform.",
              ],
              [
                Users,
                "Community",
                "Donors, volunteers, organizers and partners each have a meaningful role.",
              ],
              [
                Compass,
                "Learning",
                "We improve through campaign outcomes, feedback and honest reporting.",
              ],
            ].map(([Icon, title, copy]) => {
              const IconComponent = Icon as typeof Compass;
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
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Leadership"
            title="A team growing with the mission."
            description="MpaMpe combines community organizing, campaign support, technology and partnership development."
          />
          <div className="team-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              ["/images/team-1.webp", "MpaMpe Leadership", "Strategy & partnerships"],
              ["/images/team-2.webp", "Campaign Operations", "Campaign & community support"],
              ["/images/team-3.webp", "Mavericks Community", "Volunteers & outreach"],
            ].map(([image, name, role]) => (
              <article className="person-card" key={name}>
                <div style={{ position: "relative", height: 320 }}>
                  <Image src={image} alt="" fill sizes="33vw" />
                </div>
                <div className="story-content">
                  <h3>{name}</h3>
                  <p>{role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
