import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function CampaignNotFound() {
  return (
    <PageHero
      eyebrow="Campaign unavailable"
      title="We could not find that campaign."
      description="It may have been archived, renamed or removed while MpaMpe reviews it."
      actions={
        <Link className="button" href="/campaigns">
          Explore campaigns
        </Link>
      }
    />
  );
}
