import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your MpaMpe account profile and organizer settings.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Settings"
        title="Keep your MpaMpe account details up to date."
        description="Manage your organizer profile, contact details and account type. Supabase email confirmation is configured from the Supabase dashboard."
      />
      <section className="section section-muted">
        <div className="container">
          <SettingsPanel />
        </div>
      </section>
    </>
  );
}
