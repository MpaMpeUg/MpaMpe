import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminOperations } from "@/components/admin-operations";
import { PageHero } from "@/components/page-hero";
import { getAdminDashboardData } from "@/lib/admin-repository";
import { getCurrentSupabaseUser, isSupabaseAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentSupabaseUser();
  if (!user) redirect("/dashboard?next=/admin#account");
  if (!isSupabaseAdmin(user)) redirect("/dashboard");
  const data = await getAdminDashboardData();

  return (
    <>
      <PageHero
        eyebrow="MpaMpe administration"
        title="Review, publish and manage platform activity."
        description="A protected operating view for campaign applications, public campaigns, users, giving records and community submissions."
      />
      <section className="section section-muted">
        <div className="container admin-layout">
          <aside className="dashboard-nav admin-sticky-nav">
            <span className="eyebrow">Operations</span>
            <ul>
              <li><a href="#applications">Applications</a></li>
              <li><a href="#campaigns">Campaigns</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#users">Users</a></li>
              <li><a href="#donations">Donations</a></li>
              <li><a href="#pledges">Pledges</a></li>
              <li><a href="#subscribers">Subscribers</a></li>
              <li><a href="#form-submissions">Form submissions</a></li>
            </ul>
          </aside>
          <AdminOperations data={data} />
        </div>
      </section>
    </>
  );
}
