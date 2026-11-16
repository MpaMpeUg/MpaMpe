export type CampaignPublicationDraft = {
  applicationId: string;
  slug: string;
  shortTitle: string;
  imageUrl: string;
  status: "active";
};

export function normalizeCampaignSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

export function buildCampaignPublicationDraft(input: {
  applicationId: string;
  slug: string;
  shortTitle: string;
  imageUrl: string;
}): CampaignPublicationDraft {
  return {
    applicationId: input.applicationId,
    slug: normalizeCampaignSlug(input.slug),
    shortTitle: input.shortTitle.trim(),
    imageUrl: input.imageUrl,
    status: "active",
  };
}
