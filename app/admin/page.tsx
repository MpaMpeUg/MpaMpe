import { getUser } from "@netlify/identity";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { listCampaigns, listDemoSubmissions } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();
  const roles = user?.roles ?? [];
  if (!user || !roles.includes("admin")) redirect("/dashboard");

  const campaigns = await listCampaigns();
  const submissions = await listDemoSubmissions();

  return (
    <>
      <PageHero
        eyebrow="Administration preview"
        title="A clearer operating view for the MpaMpe team."
        description="This preview shows the first administration structure. Production access must be restricted to verified administrator roles."
      />
      <section className="section section-muted">
        <div className="container dashboard-shell">
          <aside className="dashboard-nav">
            <span className="eyebrow">Operations</span>
            <ul>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#campaigns">Campaign reviews</a>
              </li>
              <li>
                <a href="#payments">Payments</a>
              </li>
              <li>
                <a href="#mavericks">Mavericks</a>
              </li>
              <li>
                <a href="#content">Content</a>
              </li>
            </ul>
          </aside>
          <div className="dashboard-content" id="overview">
            <span className="eyebrow">Platform status</span>
            <h1 style={{ marginTop: 12, fontSize: "2.6rem", color: "var(--teal-dark)" }}>
              Operations overview
            </h1>
            <p style={{ marginTop: 14, color: "var(--muted)" }}>
              Demo submissions are held only in the current server process.
              Connect PostgreSQL before using this view operationally.
            </p>
            <div className="admin-stats">
              <div className="admin-stat">
                <strong>{campaigns.length}</strong>
                <span>Campaign records</span>
              </div>
              <div className="admin-stat">
                <strong>
                  {campaigns.filter((campaign) => campaign.status === "active").length}
                </strong>
                <span>Active campaigns</span>
              </div>
              <div className="admin-stat">
                <strong>{submissions.length}</strong>
                <span>Demo submissions</span>
              </div>
              <div className="admin-stat">
                <strong>0</strong>
                <span>Payment exceptions</span>
              </div>
            </div>
            <div className="notice-box" style={{ marginTop: 30 }}>
              Before production use, enforce an administrator role on the page
              and every administration API route.
            </div>
            <Link className="button button-secondary" href="/dashboard">
              Sign in through Identity
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
