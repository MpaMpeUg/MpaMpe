export type CampaignStatus =
  | "active"
  | "funded"
  | "completed"
  | "paused"
  | "under-review";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  story: string[];
  category: string;
  location: string;
  image: string;
  goal: number;
  raised: number;
  supporters: number;
  currency: "UGX";
  status: CampaignStatus;
  organizer: string;
  organizerType: string;
  verified: boolean;
  featured: boolean;
  visibility: "public" | "private";
  shareToken?: string;
  endDate: string | null;
  updates: CampaignUpdate[];
  budget: { label: string; amount: number }[];
  backers?: Backer[];
};

export type CampaignUpdate = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
};

export type Backer = {
  id: string;
  campaignSlug: string;
  displayName: string;
  amount: number;
  currency: "UGX";
  anonymous: boolean;
  createdAt: string;
};

export type Pledge = {
  id: string;
  campaignSlug: string;
  name: string;
  email?: string;
  phone?: string;
  amount?: number;
  message?: string;
  anonymous: boolean;
  createdAt: string;
};

export type MaverickOpportunity = {
  id: string;
  title: string;
  type: string;
  location: string;
  commitment: string;
  closingDate: string;
  spaces: number;
  summary: string;
  skills: string[];
};

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string[];
  image: string;
  date: string;
  category: string;
  sourceHref?: string;
  sourceLabel?: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  summary: string;
};
