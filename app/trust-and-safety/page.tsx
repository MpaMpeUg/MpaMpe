import type { Metadata } from "next";
import {
  BadgeCheck,
  CircleAlert,
  Eye,
  FileLock2,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Trust & Safety",
  description:
    "Learn how MpaMpe approaches campaign review, payment verification, privacy, safeguarding and reporting.",
};

const controls = [
  {
    icon: BadgeCheck,
    title: "Campaign review",
    text: "Organizer, beneficiary, goal, story and budget information may be checked before publication.",
  },
  {
    icon: Landmark,
    title: "Payment confirmation",
    text: "A donation is counted only after server-side confirmation from the approved payment provider.",
  },
  {
    icon: Eye,
    title: "Transparent updates",
    text: "Organizers are expected to publish material progress, changes and outcomes.",
  },
  {
    icon: FileLock2,
    title: "Private evidence",
    text: "Identity and verification documents are not published and access is restricted by role.",
  },
  {
    icon: ShieldCheck,
    title: "Safeguarding",
    text: "Consent, beneficiary dignity, minors and volunteer field conduct require additional care.",
  },
  {
    icon: CircleAlert,
    title: "Reporting and response",
    text: "Supporters can report concerns for review, campaign pausing and further action.",
  },
];

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust & safety"
        title="Trust is a process, not a badge."
        description="MpaMpe combines human review, technical controls and clear reporting to reduce risk while keeping community giving accessible."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Platform controls"
            title="What MpaMpe is building into every campaign journey."
          />
          <div className="value-grid">
            {controls.map(({ icon: Icon, title, text }) => (
              <article className="value-card" key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container legal">
          <h2>What campaign review means</h2>
          <p>
            Review means MpaMpe has assessed the information required for the
            applicable campaign type. It does not guarantee that every future
            event will happen exactly as described. Supporters should read
            campaigns carefully and contact MpaMpe when information is unclear.
          </p>
          <h2>What MpaMpe will never ask for</h2>
          <ul>
            <li>Your Mobile Money PIN, card PIN or online banking password.</li>
            <li>Payment through an unapproved personal message or link.</li>
            <li>
              Sensitive identity information through social media comments.
            </li>
          </ul>
          <h2>Report a concern</h2>
          <p>
            Report suspicious payment instructions, inaccurate campaign
            information, privacy concerns or unsafe volunteer conduct promptly.
          </p>
          <p>
            <Link className="button" href="/contact">
              Contact trust & safety
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
