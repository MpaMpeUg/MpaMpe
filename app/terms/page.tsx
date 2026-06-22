import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Rules for using the MpaMpe platform."
      description="These draft terms describe expected conduct for supporters, campaign organizers, volunteers and other users."
    >
      <h2>Accurate information</h2>
      <p>
        Users must provide accurate information and may not impersonate another
        person, misrepresent a beneficiary or publish a campaign without
        appropriate permission.
      </p>
      <h2>Campaign responsibilities</h2>
      <p>
        Organizers are responsible for truthful campaign content, lawful use of
        funds, timely updates and cooperation with review and support requests.
      </p>
      <h2>Prohibited activity</h2>
      <ul>
        <li>Fraud, deception, harassment or exploitation.</li>
        <li>Unlawful fundraising or prohibited goods and services.</li>
        <li>Attempts to bypass payment, security or access controls.</li>
        <li>Publishing private information without authority.</li>
      </ul>
      <h2>Campaign moderation</h2>
      <p>
        MpaMpe may request information, edit presentation with organizer
        consent, pause fundraising, close a campaign or preserve records while
        a concern is reviewed.
      </p>
      <h2>Changes and contact</h2>
      <p>
        Material changes will be communicated through the platform. Questions
        can be sent to info@mpampe.com.
      </p>
    </LegalPage>
  );
}
