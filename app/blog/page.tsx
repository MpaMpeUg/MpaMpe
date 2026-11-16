import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { stories } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "MpaMpe Blog",
  description:
    "Campaign lessons, platform updates, Mavericks stories and transparent giving notes from MpaMpe.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Campaign updates and practical guides."
        description="Read campaign results, platform updates and guidance for organizers and donors."
        actions={
          <Link className="button" href="/subscribe">
            Subscribe for updates
          </Link>
        }
      />
      <section className="section">
        <div className="container story-grid" data-reveal-stagger>
          {stories.map((story) => (
            <article className="story-card" key={story.slug}>
              <Link className="story-image" href={`/blog/${story.slug}`}>
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 680px) 100vw, 33vw"
                />
              </Link>
              <div className="story-content">
                <span className="story-meta">
                  {story.category} · {formatDate(story.date)}
                </span>
                <h3>
                  <Link href={`/blog/${story.slug}`}>{story.title}</Link>
                </h3>
                <p>{story.excerpt}</p>
                <Link className="card-link" href={`/blog/${story.slug}`}>
                  Read post <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
