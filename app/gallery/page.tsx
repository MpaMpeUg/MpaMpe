import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/page-hero";
import { galleryImages } from "@/lib/data";
import { getPublishedGalleryImages } from "@/lib/gallery-repository";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from MpaMpe campaigns, Mavericks and community missions.",
};

export default async function GalleryPage() {
  const managedImages = await getPublishedGalleryImages();
  const images = [...managedImages, ...galleryImages];

  return (
    <>
      <PageHero
        eyebrow="MpaMpe gallery"
        title="MpaMpe in photos."
        description="Campaigns, community activities, Mavericks and MpaMpe events."
        actions={<Link className="button" href="/campaigns">View campaigns</Link>}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Gallery</span>
            <h2>Campaigns and community activities.</h2>
          </div>
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
