"use client";

import Link from "next/link";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section className="section section-muted" role="alert">
      <div className="container form-card">
        <span className="eyebrow">Administration unavailable</span>
        <h1>We could not load the admin portal.</h1>
        <p>Your data was not changed. Retry the request or return to your dashboard.</p>
        <div className="hero-actions">
          <button className="button" type="button" onClick={() => reset()}>
            Retry
          </button>
          <Link className="button button-secondary" href="/dashboard">
            Go to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
