import { ArrowRight, BadgeCheck, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { campaignProgress, formatMoney } from "@/lib/format";
import type { Campaign } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = campaignProgress(campaign.raised, campaign.goal);

  return (
    <article className="campaign-card">
      <Link
        className="campaign-image"
        href={`/campaigns/${campaign.slug}`}
        aria-label={`View ${campaign.title}`}
      >
        <Image
          src={campaign.image}
          alt={`${campaign.title} campaign`}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        <span className={`status status-${campaign.status}`}>
          {campaign.status.replace("-", " ")}
        </span>
      </Link>
      <div className="campaign-content">
        <div className="campaign-meta">
          <span>{campaign.category}</span>
          {campaign.verified ? (
            <span className="verified">
              <BadgeCheck /> Verified
            </span>
          ) : null}
        </div>
        <h3>
          <Link href={`/campaigns/${campaign.slug}`}>{campaign.title}</Link>
        </h3>
        <p>{campaign.summary}</p>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={`${progress}% funded`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="campaign-money">
          <strong>{formatMoney(campaign.raised)}</strong>
          <span>raised of {formatMoney(campaign.goal)}</span>
        </div>
        <div className="campaign-footer">
          <span>
            <Users /> {campaign.supporters} supporters
          </span>
          <span>
            <MapPin /> {campaign.location}
          </span>
        </div>
        <Link className="card-link" href={`/campaigns/${campaign.slug}`}>
          View campaign <ArrowRight />
        </Link>
      </div>
    </article>
  );
}
