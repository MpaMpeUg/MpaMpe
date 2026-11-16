import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import {
  calculateGrowthPercent,
  normalizeInsightBars,
  summarizeCreatorDashboard,
  type CreatorDashboardData,
} from "../lib/creator-dashboard";

function fixture(): CreatorDashboardData {
  return {
    profile: {
      fullName: "Amina Organizer",
      email: "amina@example.com",
      phone: "+256700000000",
      role: "organizer",
    },
    applications: [
      {
        id: "application-1",
        title: "Community water campaign",
        category: "Community",
        location: "Kampala",
        goalAmount: 2_000_000,
        status: "under_review",
        reviewerNotes: null,
        imageUrl: null,
        documents: [],
        createdAt: "2026-11-15T00:00:00.000Z",
      },
    ],
    campaigns: [
      {
        id: "campaign-1",
        slug: "community-water",
        title: "Community water campaign",
        shortTitle: "Community water",
        summary: "A public summary",
        story: ["A campaign story"],
        location: "Kampala",
        goalAmount: 2_000_000,
        raisedAmount: 750_000,
        supporterCount: 12,
        currency: "UGX",
        status: "active",
        verified: true,
        visibility: "public",
        shareToken: null,
        endDate: null,
        updates: [],
        backers: [],
      },
      {
        id: "campaign-2",
        slug: "school-supplies",
        title: "School supplies",
        shortTitle: "School supplies",
        summary: "A second public summary",
        story: [],
        location: "Wakiso",
        goalAmount: 1_000_000,
        raisedAmount: 250_000,
        supporterCount: 4,
        currency: "UGX",
        status: "paused",
        verified: true,
        visibility: "private",
        shareToken: "00000000-0000-4000-8000-000000000001",
        endDate: null,
        updates: [],
        backers: [],
      },
    ],
    insights: {
      currency: "UGX",
      confirmedGiftCount: 16,
      averageGift: 62_500,
      last30Days: 300_000,
      previous30Days: 200_000,
      anonymousGiftCount: 4,
      monthly: [
        { month: "2026-10-01", label: "Oct", amount: 200_000, supporters: 4 },
        { month: "2026-11-01", label: "Nov", amount: 300_000, supporters: 6 },
      ],
      campaigns: [
        {
          campaignId: "campaign-1",
          slug: "community-water",
          title: "Community water",
          amount: 750_000,
          goalAmount: 2_000_000,
          supporters: 12,
        },
      ],
    },
  };
}

describe("creator dashboard", () => {
  it("summarizes live creator records instead of placeholder values", () => {
    assert.deepEqual(summarizeCreatorDashboard(fixture()), {
      applicationCount: 1,
      campaignCount: 2,
      liveCampaignCount: 1,
      totalRaised: 1_000_000,
      supporterCount: 16,
    });
  });

  it("calculates safe growth and normalized insight bars", () => {
    assert.equal(calculateGrowthPercent(300_000, 200_000), 50);
    assert.equal(calculateGrowthPercent(0, 0), 0);
    assert.equal(calculateGrowthPercent(100_000, 0), null);
    assert.deepEqual(normalizeInsightBars(fixture().insights.monthly), [
      { month: "2026-10-01", label: "Oct", amount: 200_000, supporters: 4, height: 67 },
      { month: "2026-11-01", label: "Nov", amount: 300_000, supporters: 6, height: 100 },
    ]);
  });

  it("loads only records owned by the current creator", () => {
    const repository = readFileSync("lib/creator-dashboard-repository.ts", "utf8");
    assert.match(repository, /\.eq\("organizer_id", userId\)/);
    assert.match(repository, /public_campaign_backers/);
    assert.match(repository, /createSignedUrl/);
    assert.doesNotMatch(repository, /donor_email|donor_phone|provider_reference/);
    assert.match(repository, /get_organizer_dashboard_insights/);
  });

  it("renders a real signed-in dashboard and keeps sign-in for guests", () => {
    const page = readFileSync("app/dashboard/page.tsx", "utf8");
    const dashboard = readFileSync("components/creator-dashboard.tsx", "utf8");
    const authPanel = readFileSync("components/auth-panel.tsx", "utf8");
    assert.match(page, /getCreatorDashboardData/);
    assert.match(page, /<CreatorDashboard/);
    assert.match(page, /<AuthPanel/);
    assert.match(dashboard, /Applications/);
    assert.match(dashboard, /Campaign updates/);
    assert.match(dashboard, /Settlement/);
    assert.match(dashboard, /Insights/);
    assert.match(dashboard, /Supporters/);
    const insights = readFileSync("components/creator-insights.tsx", "utf8");
    assert.match(insights, /Giving over time/);
    assert.match(insights, /Campaign performance/);
    assert.match(insights, /Recent confirmed backers/);
    assert.match(insights, /Download CSV/);
    assert.match(insights, /aria-label/);
    assert.doesNotMatch(authPanel, /Campaigns created/);
  });

  it("uses an authenticated owner-scoped insight function", () => {
    const migrationName = readdirSync("database/migrations").find((name) =>
      name.endsWith("_organizer_dashboard_insights.sql"),
    );
    assert.ok(migrationName, "organizer insights migration is missing");
    const migration = readFileSync(`database/migrations/${migrationName}`, "utf8");
    assert.match(migration, /get_organizer_dashboard_insights/);
    assert.match(migration, /auth\.uid\(\)/);
    assert.match(migration, /organizer_id\s*=\s*auth\.uid\(\)/);
    assert.match(migration, /successful[\s\S]*completed|completed[\s\S]*successful/);
    assert.match(migration, /grant execute[\s\S]*to authenticated/i);
    assert.match(migration, /revoke all[\s\S]*from public, anon/i);
    assert.doesNotMatch(migration, /donor_email|donor_phone|provider_reference|donor_payload/);
  });

  it("uses authenticated, ownership-safe creator mutation routes", () => {
    const campaignRoute = readFileSync(
      "app/api/organizer/campaigns/[id]/route.ts",
      "utf8",
    );
    const updateRoute = readFileSync(
      "app/api/organizer/campaigns/[id]/updates/route.ts",
      "utf8",
    );
    const deleteRoute = readFileSync(
      "app/api/organizer/campaign-updates/[id]/route.ts",
      "utf8",
    );
    for (const route of [campaignRoute, updateRoute, deleteRoute]) {
      assert.match(route, /getCurrentSupabaseUser/);
      assert.match(route, /401/);
      assert.match(route, /404/);
      assert.match(route, /revalidatePath/);
    }
    assert.match(campaignRoute, /update_organizer_campaign/);
    assert.match(campaignRoute, /parseJsonBody/);
  });

  it("tracks database ownership and safe campaign fields", () => {
    const migrationName = readdirSync("database/migrations").find((name) =>
      name.endsWith("_creator_dashboard.sql"),
    );
    assert.ok(migrationName, "creator dashboard migration is missing");
    const migration = readFileSync(`database/migrations/${migrationName}`, "utf8");
    assert.match(migration, /update_organizer_campaign/);
    assert.match(migration, /auth\.uid\(\)/);
    assert.match(migration, /campaign_updates_organizer_insert/);
    assert.match(migration, /mark_campaign_applicant_as_organizer/);
    assert.doesNotMatch(migration, /p_raised_amount|p_supporter_count|p_verified/);
  });
});
