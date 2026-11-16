import type { Metadata } from "next";
import { BadgeCheck, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackersList } from "@/components/backers-list";
import { DonationPanel } from "@/components/donation-panel";
import { PledgePanel } from "@/components/pledge-panel";
import { ShareButton } from "@/components/share-button";
import { campaignProgress, formatDate, formatMoney } from "@/lib/format";
import { normalizeCampaignAccessToken } from "@/lib/campaign-access";
import {
  getCampaign,
  listCampaignBackers,
  listCampaigns,
} from "@/lib/repository";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listCampaigns()).map((campaign) => ({
    slug: campaign.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ access?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const access = normalizeCampaignAccessToken((await searchParams).access);
  const campaign = await getCampaign(slug, access);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: campaign.shortTitle,
    description: campaign.summary,
    openGraph: {
      title: campaign.title,
      description: campaign.summary,
      images: [campaign.image],
    },
    robots: campaign.visibility === "private"
      ? { index: false, follow: false, noarchive: true }
      : undefined,
  };
}

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ access?: string }>;
}) {
  const { slug } = await params;
  const access = normalizeCampaignAccessToken((await searchParams).access);
  const campaign = await getCampaign(slug, access);
  if (!campaign) notFound();
  const backers = await listCampaignBackers(campaign.slug, access);
  const progress = campaignProgress(campaign.raised, campaign.goal);

  return (
    <>
      <section className="campaign-detail-hero">
        <div className="container campaign-detail-grid">
          <div className="campaign-detail-image">
            <Image
              className="campaign-detail-photo"
              src={campaign.image}
              alt={`${campaign.title} campaign`}
              fill
              priority
              quality={88}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="campaign-detail-copy">
            <div className="campaign-detail-labels">
              <span className="eyebrow">{campaign.category}</span>
              <span className={`campaign-detail-status campaign-detail-status-${campaign.status}`}>
                {campaign.status.replace("-", " ")}
              </span>
              {campaign.visibility === "private" ? <span className="private-campaign-badge">Private campaign</span> : null}
            </div>
            <h1>{campaign.title}</h1>
            <p>{campaign.summary}</p>
            <div className="campaign-detail-meta">
              <span>
                <MapPin /> {campaign.location}
              </span>
              <span>
                <Users /> {campaign.supporters} supporters
              </span>
              {campaign.verified ? (
                <span>
                  <BadgeCheck /> Reviewed campaign
                </span>
              ) : null}
            </div>
            <div className="campaign-total">
              <div className="campaign-total-row">
                <strong>{formatMoney(campaign.raised)}</strong>
                <span>{progress}% of {formatMoney(campaign.goal)}</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-caption">
                {campaign.supporters} confirmed backers · live progress updates
                after verified payment callbacks
              </p>
            </div>
            <div className="hero-actions">
              <a className="button" href="#donate">
                Support this campaign
              </a>
              <ShareButton title={campaign.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <article className="rich-content">
            <h2>The story</h2>
            {campaign.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <h2>Organizer and review</h2>
            <div className="info-card">
              <BadgeCheck />
              <h3>{campaign.organizer}</h3>
              <p>
                {campaign.organizerType}. MpaMpe has reviewed the campaign
                information available for publication. Review helps reduce
                risk, but donors should still read each campaign carefully.
              </p>
            </div>

            <h2>Use of funds</h2>
            <ul className="budget-list">
              {campaign.budget.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{formatMoney(item.amount)}</strong>
                </li>
              ))}
            </ul>

            <h2>Campaign updates</h2>
            <ul className="updates-list">
              {campaign.updates.map((update) => (
                <li key={update.id}>
                  <time dateTime={update.publishedAt}>
                    {formatDate(update.publishedAt)}
                  </time>
                  <h3>{update.title}</h3>
                  <p>{update.body}</p>
                </li>
              ))}
            </ul>

            <h2>Recent backers</h2>
            <BackersList backers={backers} />

            <h2>Pledges and follow-ups</h2>
            <div className="info-card">
              <h3>Pledge details stay private</h3>
              <p>
                Pledges are optional follow-up records for the MpaMpe team. They
                do not count toward the public campaign total until a payment is
                confirmed.
              </p>
            </div>

            <h2>Need help?</h2>
            <p>
              Contact MpaMpe before donating if you need clarification about
              the campaign or payment process.
            </p>
            <p>
              <Link className="text-link" href="/contact">
                Contact campaign support
              </Link>
            </p>
          </article>
          <div id="donate">
            <DonationPanel
              campaignSlug={campaign.slug}
              campaignTitle={campaign.title}
              campaignAccessToken={access}
            />
            <PledgePanel
              campaignSlug={campaign.slug}
              campaignTitle={campaign.title}
              campaignAccessToken={access}
            />
          </div>
        </div>
      </section>
    </>
  );
}
