import type { Metadata } from "next";
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
      <section className="section">
        <div className="container content-grid">
          <article className="rich-content">
            {(story.body ?? [story.excerpt]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {story.sourceHref ? (
              <a
                className="button button-secondary"
                href={story.sourceHref}
                target="_blank"
                rel="noreferrer"
              >
                {story.sourceLabel ?? "View original update"}
              </a>
            ) : null}
          </article>
          <aside className="image-panel">
            <Image
              src={story.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 38vw"
            />
          </aside>
        </div>
      </section>
    </>
  );
}
