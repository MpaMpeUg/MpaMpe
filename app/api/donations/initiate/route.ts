import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { initiatePayment } from "@/lib/payments";
import { rateLimit } from "@/lib/rate-limit";
import { donationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = rateLimit(`donation:${clientIp(request)}`, 8, 60_000);
  if (!limit.allowed) {
    return jsonError("Too many payment attempts. Please wait and try again.", 429);
  }

  try {
    const parsed = donationSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(validationMessage(parsed.error));
    const payment = await initiatePayment(parsed.data);
    return Response.json(payment, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Unable to prepare the payment request.",
      503,
    );
  }
}
