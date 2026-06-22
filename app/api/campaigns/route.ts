import { listCampaigns } from "@/lib/repository";

export async function GET() {
  const campaigns = await listCampaigns();
  return Response.json(
    { campaigns },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control":
          "public, durable, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
