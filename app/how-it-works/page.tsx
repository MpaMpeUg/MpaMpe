import type { Metadata } from "next";
import {
  BadgeCheck,
  BellRing,
  FileSearch,
  HandHeart,
  Landmark,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Understand how MpaMpe reviews campaigns, processes support and shares updates.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How MpaMpe works"
        title="Clear steps for organizers and supporters."
        description="MpaMpe combines human campaign support with structured review, verified payment events and accountable updates."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="For campaign organizers"
            title="From application to a campaign people can understand."
          />
          <div className="process-grid">
            <article className="process-card">
              <h3>Prepare</h3>
              <p>
                Gather beneficiary permission, contact details, a clear goal,
                a budget and supporting evidence.
              </p>
            </article>
            <article className="process-card">
              <h3>Apply and review</h3>
              <p>
                Submit the campaign. MpaMpe may request clarification before
                approving it for publication.
              </p>
            </article>
            <article className="process-card">
              <h3>Mobilise and update</h3>
              <p>
                Share the campaign, respond to supporters and publish progress
                and use-of-funds updates.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="For supporters"
            title="Give with more context and stay connected."
          />
          <div className="value-grid">
            {[
              [
                FileSearch,
                "Read the campaign",
                "Review the story, goal, organizer, budget, status and updates.",
              ],
              [
                HandHeart,
                "Choose how to help",
                "Give through an approved method or support the campaign through sharing and service.",
              ],
              [
                BadgeCheck,
                "Receive confirmation",
                "Successful payments are confirmed by the payment provider before totals update.",
              ],
              [
                BellRing,
                "Follow updates",
                "Campaign organizers share progress, important changes and outcomes.",
              ],
              [
                MessagesSquare,
                "Ask for help",
                "Contact MpaMpe if a transaction is delayed or campaign information is unclear.",
              ],
              [
                Landmark,
                "Support accountability",
                "Completed campaigns should report funds disbursed and outcomes achieved.",
              ],
            ].map(([Icon, title, copy]) => {
              const IconComponent = Icon as typeof FileSearch;
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
            <span className="eyebrow eyebrow-light">Your next step</span>
            <h2>Ready to support or start a campaign?</h2>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/campaigns">
              Explore campaigns
            </Link>
            <Link className="button button-ghost" href="/start">
              Start a campaign
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
