import type { Metadata } from "next";
import {
  BadgeCheck,
  Bot,
  FileSearch,
  HelpCircle,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Campaign drafting assistant",
    body: "Help organizers turn rough notes into a clear story, budget, risks and update plan before review.",
  },
  {
    icon: HelpCircle,
    title: "Donor FAQ guide",
    body: "Answer common questions about how giving works, anonymous gifts, tips, refunds and campaign verification.",
  },
  {
    icon: FileSearch,
    title: "Campaign quality checker",
    body: "Flag missing documents, unclear budgets, weak titles, unsupported claims and safeguarding concerns for admin review.",
  },
  {
    icon: BadgeCheck,
    title: "Backer update helper",
    body: "Suggest respectful campaign updates that explain progress without exposing sensitive beneficiary information.",
  },
  {
    icon: ShieldAlert,
    title: "Trust and fraud triage",
    body: "Surface patterns that need human attention, such as duplicate applications or payment exceptions.",
  },
  {
    icon: Bot,
    title: "Support handoff",
    body: "Collect donor or organizer questions and route them to the MpaMpe team when human support is needed.",
  },
];

export const metadata: Metadata = {
  title: "MpaMpe AI Agent",
  description:
    "A proposed AI assistant for campaign drafting, donor support and trust operations on MpaMpe.",
};

export default function AiAgentPage() {
  return (
    <>
      <PageHero
        eyebrow="MpaMpe AI Agent"
        title="Planned AI support features."
        description="The proposed assistant will help with campaign drafting, common questions and internal review. Human staff will retain approval authority."
        actions={
          <Link className="button" href="/contact">
            Help define the agent
          </Link>
        }
      />
      <section className="section">
        <div className="container">
          <div className="value-grid" data-reveal-stagger>
            {capabilities.map(({ icon: Icon, ...capability }) => (
              <article className="value-card" key={capability.title}>
                <Icon aria-hidden="true" />
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
          <div className="notice-box route-notice" data-reveal>
            The AI Agent will not approve campaigns,
            mark payments successful, provide legal advice or override human
            review.
          </div>
        </div>
      </section>
    </>
  );
}
