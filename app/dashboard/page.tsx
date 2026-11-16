import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth-panel";
import { CreatorDashboard } from "@/components/creator-dashboard";
import { PageHero } from "@/components/page-hero";
import { getCreatorDashboardData } from "@/lib/creator-dashboard-repository";
import { getCurrentSupabaseUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your Dashboard",
  description:
    "Sign in to your MpaMpe donor, campaign organizer or Maverick dashboard.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const requested = (await searchParams).next;
  const nextPath =
    requested?.startsWith("/") && !requested.startsWith("//")
      ? requested
      : "/dashboard";
  const user = await getCurrentSupabaseUser();
  const dashboardData = user
    ? await getCreatorDashboardData(user.id, user.email || "")
    : null;
  return (
    <>
      <PageHero
        eyebrow="Your MpaMpe"
        title="Keep your giving and community activity in one place."
        description="Sign in to follow your giving, prepare trusted campaigns and stay connected to the communities you support."
      />
      <section id="account" className="section section-muted">
        <div className="container">
          {dashboardData ? (
            <CreatorDashboard data={dashboardData} />
          ) : (
            <AuthPanel nextPath={nextPath} />
          )}
        </div>
      </section>
    </>
  );
}
