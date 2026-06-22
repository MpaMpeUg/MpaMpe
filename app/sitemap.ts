import type { MetadataRoute } from "next";
import { listCampaigns } from "@/lib/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://mpampe.com";
  const staticRoutes = [
    "",
    "/campaigns",
    "/start",
    "/how-it-works",
    "/mavericks",
    "/impact",
    "/about",
    "/trust-and-safety",
    "/stories",
    "/partners",
    "/events",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/refunds",
  ];
  const campaigns = await listCampaigns();

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...campaigns.map((campaign) => ({
      url: `${base}/campaigns/${campaign.slug}`,
      lastModified: new Date(
        campaign.updates.at(-1)?.publishedAt || "2026-06-01",
      ),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
