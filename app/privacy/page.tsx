import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="How MpaMpe handles personal information."
      description="This draft explains the intended approach to data collection, use, protection, retention and individual rights."
    >
      <h2>Information MpaMpe may collect</h2>
      <p>
        Account and contact details, campaign applications, beneficiary consent,
        donation and transaction references, support messages, Mavericks
        applications, device and service logs, and communication preferences.
      </p>
      <h2>Why information is used</h2>
      <ul>
        <li>Review and operate campaigns.</li>
        <li>Initiate and verify donations and issue receipts.</li>
        <li>Manage user accounts, volunteers and support requests.</li>
        <li>Protect the platform, investigate concerns and meet obligations.</li>
        <li>Send requested campaign and community communications.</li>
      </ul>
      <h2>Sharing and service providers</h2>
      <p>
        Information may be shared with approved payment, hosting, email,
        storage, identity and professional service providers only as needed to
        deliver the service or meet legal obligations.
      </p>
      <h2>Retention and rights</h2>
      <p>
        MpaMpe will define retention periods by record type and provide a
        process for access, correction, deletion and communication preferences,
        subject to legal and financial record requirements.
      </p>
      <h2>Contact</h2>
      <p>Privacy questions can be sent to info@mpampe.com.</p>
    </LegalPage>
  );
}
