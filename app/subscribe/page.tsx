import type { Metadata } from "next";
import { BellRing, CalendarDays, Megaphone } from "lucide-react";
import { NewsletterForm } from "@/components/submission-forms";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Subscribe to MpaMpe campaign updates, community stories and launch news.",
};

export default function SubscribePage() {
  return (
    <>
      <PageHero
        eyebrow="Subscribe"
        title="Receive MpaMpe updates by email."
        description="Subscribe for campaign updates, Mavericks opportunities and event announcements."
      />
      <section className="section section-muted">
        <div className="container two-column subscribe-layout">
          <div className="content-panel" data-reveal>
            <span className="eyebrow">Email updates</span>
            <h2>Choose when to follow up.</h2>
            <ul className="feature-list">
              <li><span className="feature-list-icon"><Megaphone /></span><div><strong>Campaign announcements</strong><p>New and completed campaign notices.</p></div></li>
              <li><span className="feature-list-icon"><BellRing /></span><div><strong>Mavericks updates</strong><p>Volunteer opportunities and programme notices.</p></div></li>
              <li><span className="feature-list-icon"><CalendarDays /></span><div><strong>Events</strong><p>Orientations, campaign clinics and MxM dates.</p></div></li>
            </ul>
          </div>
          <div className="form-card" data-reveal>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
