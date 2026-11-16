import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { getCampaign, savePledge } from "@/lib/repository";
import { pledgeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`pledge:${clientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return jsonError("Please wait before submitting another pledge.", 429);
  }

  try {
    const data = pledgeSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Pledge saved." });
    const campaign = await getCampaign(
      data.data.campaignSlug,
      data.data.campaignAccessToken,
    );
    if (!campaign) return jsonError("Campaign was not found.", 404);
    if (!(["active", "funded"] as string[]).includes(campaign.status)) {
      return jsonError("This campaign is not accepting pledges.", 409);
    }

    const result = await savePledge({
      ...data.data,
      pledgeStatus: "open",
    });
    return Response.json(
      {
        message:
          "Your pledge has been saved. The MpaMpe team will follow up where needed.",
        reference: result.id,
        mode: result.mode,
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to save the pledge right now.", 500);
  }
}
