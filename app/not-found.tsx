import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function NotFoundPage() {
  return (
    <PageHero
      eyebrow="Page not found"
      title="That path does not lead anywhere yet."
      description="Return home or explore MpaMpe campaigns."
      actions={
        <>
          <Link className="button" href="/">
            Return home
          </Link>
          <Link className="button button-secondary" href="/campaigns">
            Explore campaigns
          </Link>
        </>
      }
    />
  );
}
