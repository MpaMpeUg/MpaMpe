import type { Metadata } from "next";
import {
  Award,
  CalendarDays,
  Clock3,
  Code2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Megaphone,
  Palette,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { MaverickApplicationForm } from "@/components/submission-forms";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { maverickOpportunities } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "MpaMpe Mavericks",
  description:
    "Join the MpaMpe Mavericks volunteer community and use your skills, voice and time to support trusted campaigns.",
};

const roles = [
  {
    icon: Megaphone,
    title: "Campaign Amplifier",
    text: "Share approved campaigns responsibly and help important stories reach supportive communities.",
  },
  {
    icon: Palette,
    title: "Storytelling Maverick",
    text: "Support consent-led writing, photography, design, video and campaign updates.",
  },
  {
    icon: HeartHandshake,
    title: "Field Support Maverick",
    text: "Assist supervised community missions, outreach and campaign activities.",
  },
  {
    icon: CalendarDays,
    title: "Events Maverick",
    text: "Help orientations, fundraising activities, workshops and partner events run smoothly.",
  },
  {
    icon: Code2,
    title: "Technology Maverick",
    text: "Test the platform, improve data quality and help communities use digital tools.",
  },
  {
    icon: Users,
    title: "Partnership Maverick",
    text: "Connect MpaMpe with schools, organizations, sponsors and community collaborators.",
  },
];

export default function MavericksPage() {
  return (
    <>
      <PageHero
        eyebrow="MpaMpe Mavericks"
        title="Volunteer with purpose. Grow through service."
        description="Mavericks are the MpaMpe volunteer community—people using their skills, networks and time to help trusted campaigns reach further."
        actions={
          <>
            <a className="button" href="#apply">
              Apply to join
            </a>
            <a className="button button-secondary" href="#opportunities">
              View opportunities
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container split-section">
          <div className="image-panel">
            <Image
              src="/images/mavericks.webp"
              alt="MpaMpe Mavericks volunteer community"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="content-panel">
            <span className="eyebrow">Why become a Maverick?</span>
            <h2>Community impact needs more than a donation button.</h2>
            <p>
              Campaigns also need thoughtful stories, trusted connections,
              practical skills and people willing to show up. Mavericks make
              that possible.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-list-icon">
                  <GraduationCap />
                </span>
                <div>
                  <strong>Learn practical skills</strong>
                  <p>
                    Orientation covers safeguarding, campaign ethics,
                    storytelling and digital advocacy.
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <ShieldCheck />
                </span>
                <div>
                  <strong>Serve responsibly</strong>
                  <p>
                    Clear roles, supervision and consent protect volunteers and
                    the people whose stories are shared.
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <Award />
                </span>
                <div>
                  <strong>Build a service record</strong>
                  <p>
                    Active members can record assignments, training and
                    verified community contribution.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Ways to serve"
            title="Bring what you know. Learn what you do not."
            description="Maverick roles are designed around practical contribution, appropriate supervision and the real needs of campaigns."
          />
          <div className="value-grid">
            {roles.map(({ icon: Icon, title, text }) => (
              <article className="value-card" key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="opportunities">
        <div className="container">
          <SectionHeading
            eyebrow="Open opportunities"
            title="Find a role that fits your skills and availability."
            description="These opportunities are the first community roles in the new Mavericks programme."
          />
          <div className="opportunity-grid">
            {maverickOpportunities.map((opportunity) => (
              <article className="opportunity-card" key={opportunity.id}>
                <div className="opportunity-meta">
                  <span className="tag">{opportunity.type}</span>
                  <span className="tag">{opportunity.spaces} spaces</span>
                </div>
                <h3>{opportunity.title}</h3>
                <p>{opportunity.summary}</p>
                <div className="opportunity-details">
                  <span>
                    <MapPin /> {opportunity.location}
                  </span>
                  <span>
                    <Clock3 /> {opportunity.commitment}
                  </span>
                  <span>
                    <CalendarDays /> Apply by{" "}
                    {formatDate(opportunity.closingDate)}
                  </span>
                </div>
                <a className="card-link" href="#apply">
                  Apply for this role
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="How membership works"
            title="A supportive path into active service."
            align="center"
          />
          <div className="process-grid">
            <article className="process-card">
              <h3>Apply</h3>
              <p>
                Tell us about your interests, location, skills and
                availability.
              </p>
            </article>
            <article className="process-card">
              <h3>Orient and match</h3>
              <p>
                Complete orientation and join an opportunity suited to your
                readiness.
              </p>
            </article>
            <article className="process-card">
              <h3>Serve and grow</h3>
              <p>
                Contribute safely, reflect on the work and build a verified
                service record.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="container two-column">
          <div className="content-panel">
            <span className="eyebrow">Apply to join</span>
            <h2>Tell us how you would like to contribute.</h2>
            <p>
              Applications are reviewed before orientation. Submission does not
              automatically authorize field work or access to beneficiary
              information.
            </p>
            <div className="notice-box" style={{ marginTop: 24 }}>
              Mavericks must follow the code of conduct, safeguarding guidance,
              consent rules and role-specific supervision.
            </div>
          </div>
          <MaverickApplicationForm />
        </div>
      </section>
    </>
  );
}
