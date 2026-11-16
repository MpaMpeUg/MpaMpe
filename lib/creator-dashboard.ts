export type CreatorDocument = {
  name: string;
  url: string;
};

export type CreatorApplication = {
  id: string;
  title: string;
  category: string;
  location: string;
  goalAmount: number;
  status: string;
  reviewerNotes: string | null;
  imageUrl: string | null;
  documents: CreatorDocument[];
  createdAt: string;
};

export type CreatorCampaignUpdate = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
};

export type CreatorBacker = {
  id: string;
  displayName: string;
  amount: number;
  currency: string;
  anonymous: boolean;
  createdAt: string;
};

export type CreatorCampaign = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  story: string[];
  location: string;
  goalAmount: number;
  raisedAmount: number;
  supporterCount: number;
  currency: string;
  status: string;
  verified: boolean;
  visibility: "public" | "private";
  shareToken: string | null;
  endDate: string | null;
  updates: CreatorCampaignUpdate[];
  backers: CreatorBacker[];
};

export type CreatorMonthlyInsight = {
  month: string;
  label: string;
  amount: number;
  supporters: number;
};

export type CreatorCampaignInsight = {
  campaignId: string;
  slug: string;
  title: string;
  amount: number;
  goalAmount: number;
  supporters: number;
};

export type CreatorDashboardInsights = {
  currency: string;
  confirmedGiftCount: number;
  averageGift: number;
  last30Days: number;
  previous30Days: number;
  anonymousGiftCount: number;
  monthly: CreatorMonthlyInsight[];
  campaigns: CreatorCampaignInsight[];
};

export type CreatorDashboardData = {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  applications: CreatorApplication[];
  campaigns: CreatorCampaign[];
  insights: CreatorDashboardInsights;
};

export function calculateGrowthPercent(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function normalizeInsightBars(monthly: CreatorMonthlyInsight[]) {
  const maximum = Math.max(0, ...monthly.map((bucket) => bucket.amount));
  return monthly.map((bucket) => ({
    ...bucket,
    height: maximum ? Math.round((bucket.amount / maximum) * 100) : 0,
  }));
}

export function summarizeCreatorDashboard(data: CreatorDashboardData) {
  return data.campaigns.reduce(
    (summary, campaign) => ({
      ...summary,
      liveCampaignCount:
        summary.liveCampaignCount + (campaign.status === "active" ? 1 : 0),
      totalRaised: summary.totalRaised + campaign.raisedAmount,
      supporterCount: summary.supporterCount + campaign.supporterCount,
    }),
    {
      applicationCount: data.applications.length,
      campaignCount: data.campaigns.length,
      liveCampaignCount: 0,
      totalRaised: 0,
      supporterCount: 0,
    },
  );
}
