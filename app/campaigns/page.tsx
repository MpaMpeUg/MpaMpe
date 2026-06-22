import type { Metadata } from "next";
import { CampaignExplorer } from "@/components/campaign-explorer";
import { PageHero } from "@/components/page-hero";
import { listCampaigns } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Explore Campaigns",
  description:
    "Discover active and completed MpaMpe campaigns across education, medical support and community impact.",
};

export const revalidate = 300;

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();

  return (
    <>
      <PageHero
        eyebrow="Explore campaigns"
        title="Find a cause you can stand behind."
        description="Browse reviewed MpaMpe campaigns, understand each goal and follow the story beyond the donation."
      />
      <section className="section">
        <div className="container">
          <CampaignExplorer campaigns={campaigns} />
        </div>
      </section>
    </>
  );
}
