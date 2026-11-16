"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { shuffleGalleryImages } from "@/lib/gallery";

type GalleryImage = {
  src: string;
  alt: string;
};

export function GalleryGrid({ images }: { images: readonly GalleryImage[] }) {
  const [displayImages, setDisplayImages] = useState<readonly GalleryImage[]>(images);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const imageCount = displayImages.length;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDisplayImages(shuffleGalleryImages(images));
      setSelectedIndex(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [images]);

  function select(index: number) {
    setSelectedIndex((index + imageCount) % imageCount);
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? null : (current - 1 + imageCount) % imageCount,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % imageCount,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [imageCount, selectedIndex]);

  return (
    <>
      <div className="gallery-card-grid">
        {displayImages.map((image, index) => (
          <button
            className="gallery-image-card"
            data-reveal
            type="button"
            aria-label={`Open photo ${index + 1} of ${displayImages.length}`}
            onClick={() => setSelectedIndex(index)}
            key={image.src}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index < 4}
              sizes="(max-width: 560px) 50vw, (max-width: 920px) 33vw, 25vw"
            />
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {selectedIndex !== null ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${selectedIndex + 1} of ${images.length}`}
        >
          <button
            className="gallery-lightbox-backdrop"
            type="button"
            aria-label="Close photo"
            onClick={() => setSelectedIndex(null)}
          />
          <div className="gallery-lightbox-frame">
            <Image
              src={displayImages[selectedIndex].src}
              alt={displayImages[selectedIndex].alt}
              fill
              priority
              unoptimized
              sizes="95vw"
            />
          </div>
          <span className="gallery-lightbox-count">
            {selectedIndex + 1} / {displayImages.length}
          </span>
          <button
            className="gallery-lightbox-close"
            type="button"
            aria-label="Close photo"
            onClick={() => setSelectedIndex(null)}
          >
            <X aria-hidden="true" />
          </button>
          <button
            className="gallery-lightbox-control gallery-lightbox-previous"
            type="button"
            aria-label="Previous photo"
            onClick={() => select(selectedIndex - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            className="gallery-lightbox-control gallery-lightbox-next"
            type="button"
            aria-label="Next photo"
            onClick={() => select(selectedIndex + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </>
  );
}
