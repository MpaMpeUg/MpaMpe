"use client";

import { Linkedin, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const founders = [
  {
    name: "Maria Luzinda B",
    role: "Chief Executive Officer",
    image: "/images/optimized/team-3.webp",
    bio: "Maria leads MpaMpe's mission, community strategy and partnerships, keeping the platform grounded in dignity, trust and measurable impact.",
    profile: "https://ug.linkedin.com/in/luzinda-mariyah-002414222",
  },
  {
    name: "Ronnie Atuhaire",
    role: "Chief Technology Officer",
    image: "/images/optimized/team-2.webp",
    bio: "Ronnie leads product and technology, translating MpaMpe's community-giving model into secure, accessible digital experiences.",
    profile:
      "https://www.linkedin.com/in/ronnie-linslay-atuhaire-116108bb/",
  },
  {
    name: "Angella Bukirwa",
    role: "Chief Marketing Officer",
    image: "/images/optimized/team-1.webp",
    bio: "Angella leads communication and campaign visibility, helping verified stories reach people who are ready to support them.",
    profile: "https://ug.linkedin.com/in/angella-bukirwa",
  },
] as const;

export function FounderCards() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <div className="founder-grid">
      {founders.map((founder, index) => {
        const isOpen = openCard === index;
        return (
          <article className="founder-profile" key={founder.name}>
            <button
              type="button"
              className={`founder-card${isOpen ? " is-flipped" : ""}`}
              aria-pressed={isOpen}
              aria-label={`${isOpen ? "Show photo for" : "Read about"} ${founder.name}`}
              onClick={() => setOpenCard(isOpen ? null : index)}
            >
              <span className="founder-card-inner">
                <span className="founder-card-face founder-card-front">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                  <span className="founder-card-shade" />
                  <span className="founder-card-copy">
                    <small>{founder.role}</small>
                    <strong>{founder.name}</strong>
                    <span>
                      Tap to meet the founder <RotateCcw aria-hidden="true" />
                    </span>
                  </span>
                </span>
                <span className="founder-card-face founder-card-back">
                  <span className="founder-monogram" aria-hidden="true">
                    {founder.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <small>{founder.role}</small>
                  <strong>{founder.name}</strong>
                  <span>{founder.bio}</span>
                  <em>Tap to return</em>
                </span>
              </span>
            </button>
            <a
              className="founder-profile-link"
              href={founder.profile}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin aria-hidden="true" /> View LinkedIn profile
            </a>
          </article>
        );
      })}
    </div>
  );
}
