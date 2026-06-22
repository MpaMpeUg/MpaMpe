import { getCampaign } from "@/lib/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) {
    return Response.json({ error: "Campaign not found" }, { status: 404 });
  }
  return Response.json(
    { campaign },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control":
          "public, durable, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
