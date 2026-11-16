import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about MpaMpe campaigns, donations, payments, Mavericks and support.",
};

const faqs = [
  [
    "How does MpaMpe review a campaign?",
    "Review depends on the campaign type and can include organizer identity, beneficiary permission, supporting documents, a clear budget and follow-up questions.",
  ],
  [
    "When is my donation counted?",
    "The public total should update only after MpaMpe receives valid server-side confirmation from the approved payment provider.",
  ],
  [
    "Does MpaMpe ask for my Mobile Money PIN?",
    "No. Never share a Mobile Money PIN, card PIN or banking password with MpaMpe, an organizer or anyone contacting you about a campaign.",
  ],
  [
    "Can I start a campaign for someone else?",
    "Yes, when you have permission to represent the beneficiary and can provide the information required for review.",
  ],
  [
    "Can a campaign be paused?",
    "Yes. MpaMpe may pause a campaign when information needs clarification, a concern is reported or payment and safeguarding issues require review.",
  ],
  [
    "Who can become a Maverick?",
    "People who can follow the code of conduct and contribute through an appropriate role may apply. Some roles may have age, location, training or supervision requirements.",
  ],
  [
    "How do I report a concern?",
    "Use the Contact & Support page and select the relevant inquiry type. Include the campaign and a clear description, but do not send passwords or PINs.",
  ],
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Frequently asked questions"
        title="Clear answers before you give, campaign or volunteer."
        description="If your question is not covered here, contact the MpaMpe support team."
      />
      <section className="section">
        <div className="container narrow">
          <div className="faq-list" data-reveal-stagger>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
