import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveSubmission } from "@/lib/repository";
import { maverickSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`maverick:${clientIp(request)}`, 4, 60_000);
  if (!limit.allowed) {
    return jsonError("Please wait before submitting another application.", 429);
  }

  try {
    const data = maverickSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Application received." });
    const result = await saveSubmission("maverick", {
      ...data.data,
      applicationStatus: "received",
    });
    return Response.json(
      {
        message:
          "Application received. We will share orientation details after review.",
        reference: result.id,
        mode: result.mode,
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to receive the application right now.", 500);
  }
}
