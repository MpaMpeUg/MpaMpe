import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveSubmission } from "@/lib/repository";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many requests. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const data = contactSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Message received." });

    const result = await saveSubmission("contact", data.data);
    return Response.json(
      {
        message: "Message received. The MpaMpe team will respond shortly.",
        reference: result.id,
        mode: result.mode,
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to receive your message right now.", 500);
  }
}
