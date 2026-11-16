import {
  ArrowUpRight,
  BookOpen,
  Gift,
  HeartHandshake,
  Phone,
  Shirt,
  Users,
  Utensils,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { mxmGalleryImages } from "@/lib/data";

const registrationUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScx0a2XHXGysO1n-_cE_5-GxuHQjiqLfCXi-5JhePgxzfSeaA/viewform";

export const metadata: Metadata = {
  title: "MpaMpe Xmas Mission 2026",
  description:
    "Join MpaMpe Xmas Mission 2026 by donating clothes, shoes, scholastic materials, food or money, or by volunteering with the mission.",
};

export default function MxMPage() {
  return (
    <>
      <PageHero
        eyebrow="MxM 2026 · Call open"
        title="MpaMpe Xmas Mission 2026 is here."
        description="Register to donate goods, contribute money or volunteer for the 2026 Christmas mission."
        actions={
          <>
            <a
              className="button"
              href={`${registrationUrl}?usp=sf_link`}
              target="_blank"
              rel="noreferrer"
            >
              Register for the mission <ArrowUpRight />
            </a>
            <a className="button button-secondary" href="tel:+256753361120">
              <Phone /> 0753 361 120
            </a>
          </>
        }
      />

      <section className="section mxm-intro-section">
        <div className="container mxm-intro-grid">
          <div className="mxm-story" data-reveal>
            <span className="eyebrow">MxM 2026</span>
            <h2>Donate or volunteer for the 2026 mission.</h2>
            <p>
              MpaMpe will distribute donated goods and coordinate volunteers in
              selected communities during the Christmas period.
            </p>
            <p>
              Register if you can contribute clothes, shoes, scholastic
              materials, food items, money or volunteer time.
            </p>
          </div>
          <div className="mxm-action-grid" data-reveal-stagger>
            <article className="mxm-action-card">
              <Gift aria-hidden="true" />
              <h3>Donate</h3>
              <p>
                Give clothes, shoes, scholastic materials, food items or money.
              </p>
            </article>
            <article className="mxm-action-card">
              <HeartHandshake aria-hidden="true" />
              <h3>Volunteer</h3>
              <p>Join the team supporting collection, coordination and distribution.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-teal mxm-impact-section">
        <div className="container">
          <div className="section-heading section-heading-light" data-reveal>
            <span className="eyebrow eyebrow-light">MxM 2025 results</span>
            <h2>Recorded results from Makerere Kivulu.</h2>
            <p>
              The mission reached Makerere Kivulu with practical support,
              shared meals, games and moments of connection.
            </p>
          </div>
          <div className="mxm-stat-grid" data-reveal-stagger>
            <article>
              <strong>17 Mavericks</strong>
              <span>mobilised for the mission</span>
            </article>
            <article>
              <strong>UGX 520,000</strong>
              <span>raised in two weeks</span>
            </article>
            <article>
              <strong>254 people</strong>
              <span>reached in Makerere Kivulu</span>
            </article>
          </div>
          <div className="mxm-gift-list" data-reveal>
            <div><Shirt /> Clothing packs and 101 pairs of shoes</div>
            <div><Users /> Sanitary support for 30 women</div>
            <div><Utensils /> Food, treats and shared celebration</div>
            <div><Gift /> Four large Christmas gift hampers</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Mission moments</span>
            <h2>MxM 2025 in Makerere Kivulu.</h2>
          </div>
          <div className="mxm-gallery" data-reveal-stagger>
            {mxmGalleryImages.slice(0, 6).map((image, index) => (
              <figure className={`mxm-gallery-item mxm-gallery-item-${index + 1}`} key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </figure>
            ))}
          </div>
          <div className="mxm-story-link">
            <Link className="button button-secondary" href="/gallery">
              View the full gallery
            </Link>
            <Link className="card-link" href="/blog/mxm-2025-impact">
              <BookOpen /> Read the full 2025 impact story
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-muted" id="register">
        <div className="container">
          <div className="mxm-form-heading" data-reveal>
            <div>
              <span className="eyebrow">Join MxM 2026</span>
              <h2>Register for the mission.</h2>
              <p>
                Complete the form below to volunteer, donate or receive mission
                updates.
              </p>
            </div>
            <a
              className="button button-secondary"
              href={registrationUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open form separately <ArrowUpRight />
            </a>
          </div>
          <div className="mxm-form-frame" data-reveal>
            <iframe
              src={`${registrationUrl}?embedded=true`}
              title="MpaMpe Xmas Mission 2026 registration form"
              loading="lazy"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
}
