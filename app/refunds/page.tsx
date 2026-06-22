import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Donations & Refunds" };

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Donations & refunds"
      title="What happens when a payment needs attention."
      description="This draft describes intended payment confirmation, failed transaction, refund and chargeback handling."
    >
      <h2>Payment confirmation</h2>
      <p>
        A donation is successful only when the approved provider confirms it.
        Pending or failed transactions should not increase the campaign total.
      </p>
      <h2>Duplicate or incorrect payments</h2>
      <p>
        Contact support promptly with the campaign, amount, date and provider
        reference. Never include a PIN or password.
      </p>
      <h2>Refund review</h2>
      <p>
        Refund eligibility may depend on payment status, disbursement status,
        campaign circumstances, provider rules and applicable law. MpaMpe will
        document the final procedure before live payments launch.
      </p>
      <h2>Campaign cancellation</h2>
      <p>
        If a campaign cannot proceed, MpaMpe will determine the appropriate
        treatment of verified funds in consultation with the payment provider,
        organizer and applicable policy.
      </p>
      <h2>Support</h2>
      <p>Payment support: info@mpampe.com or +256 757 163 101.</p>
    </LegalPage>
  );
}
