import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Globe2,
  Medal,
  Newspaper,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { globalStages, newsLinks, recognitions } from "@/lib/recognitions";

export const metadata: Metadata = {
  title: "MpaMpe Awards & Recognition",
  description:
    "Explore MpaMpe's awards, innovation milestones, global stages and media coverage from 2022 to 2026.",
};

export default function AwardsPage() {
  const sourcedCount = recognitions.filter(
    (item) => item.recordType === "independently sourced",
  ).length;

  return (
    <>
      <PageHero
        eyebrow="2022—2026"
        title="MpaMpe Awards & Recognition"
        description="From a student-built solution to a continental ecosystem award: the milestones, stages and independent coverage behind MpaMpe's journey."
        actions={
          <a className="button" href="#timeline">
            Explore the journey
          </a>
        }
      />

      <section className="section awards-intro-section">
        <div className="container awards-feature">
          <div className="awards-feature-mark" aria-hidden="true">
            <Trophy />
          </div>
          <div className="awards-feature-copy">
            <span className="eyebrow"><Sparkles /> Latest major win</span>
            <h2>Africa Startup Ecosystem Builders Awards 2026</h2>
            <p>
              MpaMpe was named <strong>Ecosystem Diversity, Equity &amp;
              Inclusion Champion of the Year</strong> in Johannesburg on 21
              October 2026.
            </p>
            <a
              className="card-link"
              href="https://www.asebs.com/winners/2026/mpampe"
              target="_blank"
              rel="noreferrer"
            >
              View the official winner profile <ArrowUpRight />
            </a>
          </div>
          <div className="awards-feature-stats" aria-label="Recognition summary">
            <div><strong>8+</strong><span>awards and milestones</span></div>
            <div><strong>{sourcedCount}</strong><span>independently sourced records</span></div>
            <div><strong>4</strong><span>international stages</span></div>
          </div>
        </div>
      </section>

      <section className="section section-muted" id="timeline">
        <div className="container">
          <SectionHeading
            eyebrow="Recognition timeline"
            title="Built one milestone at a time."
            description="Independent sources are linked directly. Items marked as a MpaMpe record are retained transparently while supporting organiser records are added to the archive."
          />
          <div className="recognition-timeline">
            {recognitions.map((recognition, index) => (
              <article
                className="recognition-card"
                key={`${recognition.year}-${recognition.title}`}
              >
                <div className="recognition-year">{recognition.year}</div>
                <div className="recognition-icon" aria-hidden="true">
                  {index === recognitions.length - 1 ? <Trophy /> : <Medal />}
                </div>
                <div className="recognition-copy">
                  <div className="recognition-status-row">
                    <span className="tag">{recognition.result}</span>
                    <span
                      className={`verification-badge${recognition.recordType === "MpaMpe record" ? " is-record" : ""}`}
                    >
                      {recognition.recordType === "independently sourced" ? (
                        <CheckCircle2 />
                      ) : (
                        <Award />
                      )}
                      {recognition.recordType}
                    </span>
                  </div>
                  <h3>{recognition.title}</h3>
                  <p>{recognition.description}</p>
                  {recognition.sourceHref ? (
                    <a
                      className="card-link"
                      href={recognition.sourceHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {recognition.sourceLabel ?? "View source"} <ArrowUpRight />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Global stages"
            title="Taking MpaMpe beyond the pitch deck."
            description="Public presentations and ecosystem gatherings where MpaMpe's model met new audiences."
          />
          <div className="global-stage-grid">
            {globalStages.map((stage) => (
              <article className="global-stage-card" key={`${stage.year}-${stage.title}`}>
                <Globe2 aria-hidden="true" />
                <span>{stage.year}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                {stage.href ? (
                  <a href={stage.href} target="_blank" rel="noreferrer">
                    View record <ArrowUpRight />
                  </a>
                ) : (
                  <small>MpaMpe programme record</small>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHeading
            eyebrow="Press room"
            title="MpaMpe in the news"
            description="Reporting and features from technology, business and impact publications."
          />
          <div className="news-link-grid">
            {newsLinks.map((item) => (
              <a
                className="news-link-card"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                key={item.href}
              >
                <Newspaper aria-hidden="true" />
                <span>{item.outlet}</span>
                <h3>{item.title}</h3>
                <strong>Read coverage <ArrowUpRight /></strong>
              </a>
            ))}
          </div>
          <div className="awards-cta">
            <p>For press enquiries, partnership conversations or supporting records.</p>
            <Link className="button" href="/contact">Contact MpaMpe</Link>
          </div>
        </div>
      </section>
    </>
  );
}
