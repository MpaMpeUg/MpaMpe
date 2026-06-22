import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth-panel";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Your Dashboard",
  description:
    "Sign in to your MpaMpe donor, campaign organizer or Maverick dashboard.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Your MpaMpe"
        title="Keep your giving and community activity in one place."
        description="Accounts are powered by Netlify Identity and become active on configured preview and production deployments."
      />
      <section className="section section-muted">
        <div className="container">
          <AuthPanel />
        </div>
      </section>
    </>
  );
}
