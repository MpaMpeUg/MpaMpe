import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
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
  const [featuredStory, ...moreStories] = stories;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Real campaigns. Useful lessons. Lasting impact."
        description="Follow the people, milestones and community action behind MpaMpe—and learn how thoughtful crowdfunding turns support into outcomes."
        actions={
          <Link className="button" href="/subscribe">
            Subscribe for updates
          </Link>
        }
      />
      <section className="section">
        <div className="container blog-journal">
          <div className="blog-section-intro">
            <div>
              <span className="eyebrow"><Sparkles /> Featured story</span>
              <h2>Stories worth following.</h2>
            </div>
            <p>Updates from campaigns, community missions and the people moving them forward.</p>
          </div>

          <article className="blog-featured">
            <Link className="blog-featured-media" href={`/blog/${featuredStory.slug}`}>
              <Image
                src={featuredStory.image}
                alt={featuredStory.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 56vw"
              />
            </Link>
            <div className="blog-featured-copy">
              <span className="story-meta">
                {featuredStory.category} · {formatDate(featuredStory.date)}
              </span>
              <h2>
                <Link href={`/blog/${featuredStory.slug}`}>{featuredStory.title}</Link>
              </h2>
              <p>{featuredStory.excerpt}</p>
              <Link className="button" href={`/blog/${featuredStory.slug}`}>
                Read the full story <ArrowRight />
              </Link>
            </div>
          </article>

          <div className="blog-feed-heading">
            <span><BookOpen /> More from MpaMpe</span>
            <small>{moreStories.length} stories</small>
          </div>
          <div className="blog-card-grid" data-reveal-stagger>
            {moreStories.map((story) => (
              <article className="story-card blog-story-card" key={story.slug}>
                <Link className="story-image" href={`/blog/${story.slug}`}>
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 680px) 100vw, 50vw"
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
        </div>
      </section>
    </>
  );
}
