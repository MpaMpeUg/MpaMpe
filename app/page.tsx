import {
  ArrowRight,
  BadgeCheck,
  HandHeart,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { SectionHeading } from "@/components/section-heading";
import { impactStats, stories } from "@/lib/data";
import { listCampaigns } from "@/lib/repository";

export const revalidate = 300;

export default async function Home() {
  const campaigns = (await listCampaigns()).filter(
    (campaign) => campaign.featured,
  );

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Trusted community giving</span>
            <h1>
              <span className="hero-line">Reach more.</span>
              <span className="hero-line hero-line-accent">Raise more.</span>
              <span className="hero-line">Do more.</span>
            </h1>
            <p>
              MpaMpe connects people, verified needs and caring communities so
              practical support can move with clarity and trust.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/campaigns">
                Explore campaigns <ArrowRight />
              </Link>
              <Link className="button button-secondary" href="/start">
                Start a campaign
              </Link>
            </div>
            <ul className="hero-trust">
              <li>
                <ShieldCheck /> Campaign review
              </li>
              <li>
                <BadgeCheck /> Transparent updates
              </li>
              <li>
                <HeartHandshake /> Community-led impact
              </li>
            </ul>
          </div>
          <div className="hero-visual" aria-label="MpaMpe community members">
            <div className="hero-image-main">
              <Image
                src="/images/hero.webp"
                alt="Young people gathered for a MpaMpe community activity"
                fill
                priority
                sizes="(max-width: 900px) 95vw, 48vw"
              />
            </div>
            <div className="hero-float-card">
              <strong>Give money, goods or time.</strong>
              <p>
                Different forms of support. One goal: helping someone rise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="impact-strip">
        <div className="container impact-strip-inner">
          {impactStats.map((stat) => (
            <div className="impact-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Campaigns"
            title="Real needs. Clear goals. Communities that care."
            description="Explore current and completed MpaMpe campaigns, follow their updates and see how every contribution moves the work forward."
            action={
              <Link className="text-link" href="/campaigns">
                View all campaigns <ArrowRight />
              </Link>
            }
          />
          <div className="campaign-grid">
            {campaigns.map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="A simpler path from need to accountable support."
            align="center"
          />
          <div className="process-grid">
            <article className="process-card">
              <h3>Tell the story</h3>
              <p>
                Organizers submit the need, budget, beneficiary permission and
                supporting information.
              </p>
            </article>
            <article className="process-card">
              <h3>Review and publish</h3>
              <p>
                MpaMpe checks the campaign information and works with the
                organizer before publication.
              </p>
            </article>
            <article className="process-card">
              <h3>Give and follow</h3>
              <p>
                Supporters contribute through approved channels and follow
                campaign and impact updates.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div className="image-panel">
            <Image
              src="/images/mavericks.webp"
              alt="MpaMpe Mavericks volunteer community identity"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="content-panel">
            <span className="eyebrow">MpaMpe Mavericks</span>
            <h2>Turn your skills and time into practical community impact.</h2>
            <p>
              Mavericks help verified campaigns reach further through
              storytelling, digital advocacy, field support, events, creative
              work and technology.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-list-icon">
                  <Megaphone />
                </span>
                <div>
                  <strong>Amplify trusted stories</strong>
                  <p>
                    Share approved campaign content responsibly through your
                    networks.
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <Sparkles />
                </span>
                <div>
                  <strong>Learn while serving</strong>
                  <p>
                    Access orientation, safeguarding and practical community
                    engagement training.
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-list-icon">
                  <Users />
                </span>
                <div>
                  <strong>Join a purposeful community</strong>
                  <p>
                    Meet people committed to using their talents in service of
                    others.
                  </p>
                </div>
              </li>
            </ul>
            <div className="hero-actions">
              <Link className="button" href="/mavericks">
                Meet the Mavericks
              </Link>
              <Link className="button button-secondary" href="/mavericks#apply">
                Apply to join
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="Trust by design"
            title="Giving should feel human—and be operationally disciplined."
            description="MpaMpe is building clear controls around campaign review, payment confirmation, updates, privacy and support."
          />
          <div className="value-grid">
            <article className="value-card">
              <ShieldCheck />
              <h3>Reviewed campaigns</h3>
              <p>
                Campaign information and organizer details are reviewed before
                public fundraising.
              </p>
            </article>
            <article className="value-card">
              <HandHeart />
              <h3>Transparent progress</h3>
              <p>
                Verified transactions, clear goals and campaign updates replace
                vague progress claims.
              </p>
            </article>
            <article className="value-card">
              <HeartHandshake />
              <h3>Respectful storytelling</h3>
              <p>
                Beneficiary dignity, consent and data protection guide how
                stories are shared.
              </p>
            </article>
          </div>
          <div className="hero-actions">
            <Link className="button button-secondary" href="/trust-and-safety">
              Read about trust & safety
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Stories & updates"
            title="What the community is learning as MpaMpe grows."
            action={
              <Link className="text-link" href="/stories">
                Browse stories <ArrowRight />
              </Link>
            }
          />
          <div className="story-grid">
            {stories.map((story) => (
              <article className="story-card" key={story.slug}>
                <Link className="story-image" href="/stories">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 680px) 100vw, 33vw"
                  />
                </Link>
                <div className="story-content">
                  <span className="story-meta">{story.category}</span>
                  <h3>
                    <Link href="/stories">{story.title}</Link>
                  </h3>
                  <p>{story.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container cta-band">
          <div>
            <span className="eyebrow eyebrow-light">Ready to act?</span>
            <h2>Start with one clear next step.</h2>
            <p>
              Support a campaign, submit a trusted need, join the Mavericks or
              explore a partnership with MpaMpe.
            </p>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/campaigns">
              Give now
            </Link>
            <Link className="button button-ghost" href="/contact">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
