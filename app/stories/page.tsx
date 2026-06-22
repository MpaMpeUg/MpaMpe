import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { stories } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Stories & Updates",
  description:
    "Campaign lessons, community stories and updates from MpaMpe.",
};

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories & updates"
        title="The lessons, people and progress behind the platform."
        description="Follow campaign outcomes, Mavericks community stories and what MpaMpe is learning about trusted digital giving."
      />
      <section className="section">
        <div className="container story-grid">
          {stories.map((story) => (
            <article className="story-card" key={story.slug}>
              <div className="story-image">
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 680px) 100vw, 33vw"
                />
              </div>
              <div className="story-content">
                <span className="story-meta">
                  {story.category} · {formatDate(story.date)}
                </span>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
