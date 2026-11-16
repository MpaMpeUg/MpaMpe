import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveNewsletterSubscription } from "@/lib/repository";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${clientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return jsonError("Please wait before submitting again.", 429);
  }

  try {
    const data = newsletterSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Subscribed." });
    await saveNewsletterSubscription(data.data.email);
    return Response.json(
      { message: "Thank you. You are on the MpaMpe update list." },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to subscribe right now.", 500);
  }
}
