import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { stories } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) return { title: "Blog post not found" };

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${story.category} · ${formatDate(story.date)}`}
        title={story.title}
        description={story.excerpt}
        actions={
          <Link className="button button-secondary" href="/blog">
            Back to blog
          </Link>
        }
      />
      <section className="section blog-post-section">
        <div className="container blog-article-shell">
          <article className="blog-article">
            <div className="blog-article-kicker">
              <span><CalendarDays /> {formatDate(story.date)}</span>
              <span>{story.category}</span>
            </div>
            <div className="blog-article-lead">{story.excerpt}</div>
            {(story.body ?? [story.excerpt]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {story.sourceHref ? (
              <a
                className="blog-source-link"
                href={story.sourceHref}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <small>Original campaign update</small>
                  <strong>{story.sourceLabel ?? "View original update"}</strong>
                </span>
                <ArrowUpRight />
              </a>
            ) : null}
            <Link className="blog-back-link" href="/blog">
              <ArrowLeft /> Back to all stories
            </Link>
          </article>
          <aside className="blog-post-visual">
            <Image
              src={story.image}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 38vw"
            />
            <div className="blog-visual-label">
              <small>MpaMpe impact story</small>
              <strong>{story.category}</strong>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
