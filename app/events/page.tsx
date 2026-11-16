import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { events } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Events",
  description:
    "MpaMpe campaign clinics, Mavericks orientations and community events.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming MpaMpe events."
        description="View orientations, campaign workshops, community missions and partner events."
      />
      <section className="section">
        <div className="container opportunity-grid" data-reveal-stagger>
          {events.map((event) => (
            <article className="opportunity-card" key={event.id}>
              <span className="tag">{event.type}</span>
              <h3>{event.title}</h3>
              <p>{event.summary}</p>
              <div className="opportunity-details">
                <span>
                  <CalendarDays /> {formatDate(event.date)}
                </span>
                <span>
                  <MapPin /> {event.location}
                </span>
              </div>
              <a className="card-link" href="/contact">
                Ask about registration
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
