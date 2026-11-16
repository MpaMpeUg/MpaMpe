import "server-only";

import type {
  CreatorApplication,
  CreatorCampaign,
  CreatorDashboardData,
  CreatorDashboardInsights,
} from "@/lib/creator-dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function fileName(path: string) {
  return decodeURIComponent(path.split("/").pop() || "Campaign document");
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function mapInsights(value: unknown): CreatorDashboardInsights {
  const insight = record(value);
  return {
    currency: String(insight.currency || "UGX"),
    confirmedGiftCount: Number(insight.confirmedGiftCount || 0),
    averageGift: Number(insight.averageGift || 0),
    last30Days: Number(insight.last30Days || 0),
    previous30Days: Number(insight.previous30Days || 0),
    anonymousGiftCount: Number(insight.anonymousGiftCount || 0),
    monthly: list(insight.monthly).map((month) => ({
      month: String(month.month || ""),
      label: String(month.label || ""),
      amount: Number(month.amount || 0),
      supporters: Number(month.supporters || 0),
    })),
    campaigns: list(insight.campaigns).map((campaign) => ({
      campaignId: String(campaign.campaignId || ""),
      slug: String(campaign.slug || ""),
      title: String(campaign.title || "Campaign"),
      amount: Number(campaign.amount || 0),
      goalAmount: Number(campaign.goalAmount || 0),
      supporters: Number(campaign.supporters || 0),
    })),
  };
}

function fallbackInsights(
  campaigns: CreatorCampaign[],
  backers: CreatorCampaign["backers"],
): CreatorDashboardInsights {
  const now = new Date();
  const monthStarts = Array.from({ length: 6 }, (_, index) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1)),
  );
  const last30Start = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const previous30Start = now.getTime() - 60 * 24 * 60 * 60 * 1000;
  const inRange = (backer: CreatorCampaign["backers"][number], start: number, end: number) => {
    const time = new Date(backer.createdAt).getTime();
    return time >= start && time < end;
  };

  return {
    currency: "UGX",
    confirmedGiftCount: campaigns.reduce((total, campaign) => total + campaign.supporterCount, 0),
    averageGift: backers.length
      ? Math.round(backers.reduce((total, backer) => total + backer.amount, 0) / backers.length)
      : 0,
    last30Days: backers.filter((backer) => inRange(backer, last30Start, now.getTime())).reduce((total, backer) => total + backer.amount, 0),
    previous30Days: backers.filter((backer) => inRange(backer, previous30Start, last30Start)).reduce((total, backer) => total + backer.amount, 0),
    anonymousGiftCount: backers.filter((backer) => backer.anonymous).length,
    monthly: monthStarts.map((monthStart) => {
      const nextMonth = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1));
      const rows = backers.filter((backer) => inRange(backer, monthStart.getTime(), nextMonth.getTime()));
      return {
        month: monthStart.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat("en-UG", { month: "short", timeZone: "UTC" }).format(monthStart),
        amount: rows.reduce((total, backer) => total + backer.amount, 0),
        supporters: rows.length,
      };
    }),
    campaigns: campaigns.map((campaign) => ({
      campaignId: campaign.id,
      slug: campaign.slug,
      title: campaign.shortTitle,
      amount: campaign.raisedAmount,
      goalAmount: campaign.goalAmount,
      supporters: campaign.supporterCount,
    })),
  };
}

export async function getCreatorDashboardData(
  userId: string,
  fallbackEmail = "",
): Promise<CreatorDashboardData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const [profileResult, applicationsResult, initialCampaignsResult, insightsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,email,phone,role")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("campaign_applications")
      .select("id,campaign_title,category,location,goal_amount,status,reviewer_notes,image_path,document_paths,created_at")
      .eq("organizer_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("campaigns")
      .select("id,slug,title,short_title,summary,story,location,goal_amount,raised_amount,supporter_count,currency,status,visibility,share_token,verified,end_date,created_at")
      .eq("organizer_id", userId)
      .order("created_at", { ascending: false }),
    supabase.rpc("get_organizer_dashboard_insights"),
  ]);

  let campaignsData = (initialCampaignsResult.data ?? []) as Record<string, unknown>[];
  let campaignsError = initialCampaignsResult.error;
  if (
    campaignsError
    && /visibility|share_token/i.test(campaignsError.message)
  ) {
    const legacyCampaignsResult = await supabase
      .from("campaigns")
      .select("id,slug,title,short_title,summary,story,location,goal_amount,raised_amount,supporter_count,currency,status,verified,end_date,created_at")
      .eq("organizer_id", userId)
      .order("created_at", { ascending: false });
    campaignsData = (legacyCampaignsResult.data ?? []) as Record<string, unknown>[];
    campaignsError = legacyCampaignsResult.error;
  }

  const missingInsightsFunction = ["PGRST202", "42883"].includes(insightsResult.error?.code || "");
  const firstError = [
    profileResult,
    applicationsResult,
    { error: campaignsError },
    ...(missingInsightsFunction ? [] : [insightsResult]),
  ].find(
    (result) => result.error,
  )?.error;
  if (firstError) throw firstError;

  const applicationRows = applicationsResult.data ?? [];
  const campaignRows = campaignsData;
  const campaignIds = campaignRows.map((campaign) => String(campaign.id));
  const campaignSlugs = campaignRows.map((campaign) => String(campaign.slug));
  const allDocumentPaths = applicationRows.flatMap((application) =>
    Array.isArray(application.document_paths)
      ? application.document_paths.map(String)
      : [],
  );

  const [updatesResult, backersResult, documentResult] = await Promise.all([
    campaignIds.length
      ? supabase
          .from("campaign_updates")
          .select("id,campaign_id,title,body,published_at")
          .in("campaign_id", campaignIds)
          .order("published_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    campaignSlugs.length
      ? (async () => {
          const organizerBackers = await supabase.rpc("get_organizer_campaign_backers");
          if (!organizerBackers.error) return organizerBackers;
          return supabase
            .from("public_campaign_backers")
            .select("id,campaign_slug,display_name,amount,currency,anonymous,created_at")
            .in("campaign_slug", campaignSlugs)
            .order("created_at", { ascending: false })
            .limit(100);
        })()
      : Promise.resolve({ data: [], error: null }),
    allDocumentPaths.length
      ? supabase.storage
          .from("campaign-documents")
          .createSignedUrls(allDocumentPaths, 60 * 60)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const relatedError = [updatesResult, backersResult, documentResult].find(
    (result) => result.error,
  )?.error;
  if (relatedError) throw relatedError;

  const signedDocuments = new Map(
    (documentResult.data ?? [])
      .filter((document) => document.signedUrl)
      .map((document) => [String(document.path), String(document.signedUrl)]),
  );

  const applications: CreatorApplication[] = applicationRows.map((application) => {
    const imagePath = application.image_path
      ? String(application.image_path)
      : null;
    const imageUrl = imagePath
      ? supabase.storage.from("campaign-images").getPublicUrl(imagePath).data
          .publicUrl
      : null;
    const paths = Array.isArray(application.document_paths)
      ? application.document_paths.map(String)
      : [];

    return {
      id: String(application.id),
      title: String(application.campaign_title),
      category: String(application.category),
      location: String(application.location),
      goalAmount: Number(application.goal_amount),
      status: String(application.status),
      reviewerNotes: application.reviewer_notes
        ? String(application.reviewer_notes)
        : null,
      imageUrl,
      documents: paths.flatMap((path) => {
        const url = signedDocuments.get(path);
        return url ? [{ name: fileName(path), url }] : [];
      }),
      createdAt: String(application.created_at),
    };
  });

  const updateRows = updatesResult.data ?? [];
  const backerRows = (backersResult.data ?? []) as Record<string, unknown>[];
  const campaigns: CreatorCampaign[] = campaignRows.map((campaign) => ({
    id: String(campaign.id),
    slug: String(campaign.slug),
    title: String(campaign.title),
    shortTitle: String(campaign.short_title),
    summary: String(campaign.summary),
    story: Array.isArray(campaign.story) ? campaign.story.map(String) : [],
    location: String(campaign.location),
    goalAmount: Number(campaign.goal_amount),
    raisedAmount: Number(campaign.raised_amount),
    supporterCount: Number(campaign.supporter_count),
    currency: String(campaign.currency || "UGX"),
    status: String(campaign.status),
    verified: Boolean(campaign.verified),
    visibility: campaign.visibility === "private" ? "private" : "public",
    shareToken: campaign.share_token ? String(campaign.share_token) : null,
    endDate: campaign.end_date ? String(campaign.end_date) : null,
    updates: updateRows
      .filter((update) => String(update.campaign_id) === String(campaign.id))
      .map((update) => ({
        id: String(update.id),
        title: String(update.title),
        body: String(update.body),
        publishedAt: String(update.published_at),
      })),
    backers: backerRows
      .filter((backer) => String(backer.campaign_slug) === String(campaign.slug))
      .map((backer) => ({
        id: String(backer.id),
        displayName: String(backer.display_name),
        amount: Number(backer.amount),
        currency: String(backer.currency || "UGX"),
        anonymous: Boolean(backer.anonymous),
        createdAt: String(backer.created_at),
      })),
  }));
  const recentBackers = campaigns.flatMap((campaign) => campaign.backers);

  return {
    profile: {
      fullName: String(profileResult.data?.full_name || "MpaMpe member"),
      email: String(profileResult.data?.email || fallbackEmail),
      phone: String(profileResult.data?.phone || ""),
      role: String(profileResult.data?.role || "donor"),
    },
    applications,
    campaigns,
    insights: missingInsightsFunction
      ? fallbackInsights(campaigns, recentBackers)
      : mapInsights(insightsResult.data),
  };
}
