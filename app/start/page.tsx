import type { Metadata } from "next";
import { CheckCircle2, ClipboardCheck, FileText, ShieldCheck } from "lucide-react";
import { CampaignApplicationForm } from "@/components/campaign-application-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Start a Campaign",
  description:
    "Learn the MpaMpe campaign requirements and submit a campaign for initial review.",
};

export default function StartCampaignPage() {
  return (
    <>
      <PageHero
        eyebrow="Start a campaign"
        title="Build a campaign people can trust."
        description="Begin with a clear need, permission to tell the story, an honest budget and a commitment to keep supporters updated."
      />
      <section className="section">
        <div className="container two-column">
          <div className="content-panel">
            <span className="eyebrow">Before you apply</span>
            <h2>Prepare the essentials.</h2>
            <p>
              The initial form helps MpaMpe understand the need. Additional
              documents and beneficiary consent may be requested during review.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-list-icon">
                  <FileText />
                </span>
                <div>
                  <strong>A truthful, specific story</strong>
                  <p>Explain who needs support and why the need is urgent.</p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <ClipboardCheck />
                </span>
                <div>
                  <strong>A realistic budget</strong>
                  <p>Show how the fundraising goal will be used.</p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <ShieldCheck />
                </span>
                <div>
                  <strong>Permission and supporting information</strong>
                  <p>
                    Organizers must be authorized to represent the beneficiary.
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <CheckCircle2 />
                </span>
                <div>
                  <strong>Commitment to updates</strong>
                  <p>
                    Supporters should hear about important progress and
                    outcomes.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <CampaignApplicationForm />
        </div>
      </section>
    </>
  );
}
