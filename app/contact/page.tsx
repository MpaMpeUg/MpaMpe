import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/submission-forms";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Contact MpaMpe about campaigns, donations, partnerships, Mavericks or platform support.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & support"
        title="Tell us what you need help with."
        description="Choose the right inquiry type and share enough detail for the MpaMpe team to route your request."
      />
      <section className="section">
        <div className="container two-column">
          <div className="content-panel" data-reveal>
            <span className="eyebrow">Reach the team</span>
            <h2>Contact details and response times.</h2>
            <p>
              For payment concerns, include the campaign name, amount, date and
              payment reference. Never send a PIN or password.
            </p>
            <div className="contact-details">
              <a href="mailto:info@mpampe.com">
                <Mail /> info@mpampe.com
              </a>
              <a href="tel:+256757163101">
                <Phone /> +256 757 163 101
              </a>
              <div>
                <MapPin /> Kampala, Uganda
              </div>
              <div>
                <Clock3 /> Monday–Friday, 9:00–17:00 EAT
              </div>
            </div>
          </div>
          <div data-reveal><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
