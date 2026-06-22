import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveSubmission } from "@/lib/repository";
import { campaignApplicationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`campaign:${clientIp(request)}`, 3, 60_000);
  if (!limit.allowed) {
    return jsonError("Please wait before submitting another campaign.", 429);
  }

  try {
    const data = campaignApplicationSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Application received." });
    const result = await saveSubmission("campaign", {
      ...data.data,
      applicationStatus: "received",
    });
    return Response.json(
      {
        message:
          "Your initial campaign application has been received for review.",
        reference: result.id,
        mode: result.mode,
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to receive the campaign right now.", 500);
  }
}
