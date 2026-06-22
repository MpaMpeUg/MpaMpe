import crypto from "node:crypto";
import { getSql } from "@/lib/db";

export type PaymentRequest = {
  campaignSlug: string;
  amount: number;
  donorName?: string;
  email: string;
  phone?: string;
  anonymous: boolean;
  paymentMethod: "mobile-money" | "card" | "bank";
};

export async function initiatePayment(request: PaymentRequest) {
  const reference = `MP-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
  const provider = process.env.PAYMENT_PROVIDER || "demo";
  const sql = getSql();

  if (sql) {
    await sql`
      insert into donations (
        id, campaign_slug, amount, currency, status, provider_reference,
        donor_payload, created_at, updated_at
      )
      values (
        ${crypto.randomUUID()},
        ${request.campaignSlug},
        ${request.amount},
        'UGX',
        'initiated',
        ${reference},
        ${sql.json({
          name: request.donorName,
          email: request.email,
          phone: request.phone,
          anonymous: request.anonymous,
          paymentMethod: request.paymentMethod,
        })},
        now(),
        now()
      )
    `;
  }

  if (provider === "demo") {
    return {
      reference,
      mode: "demo" as const,
      message:
        "Demo payment request created. No money has been transferred. Connect an approved payment provider to enable checkout.",
    };
  }

  if (!process.env.PAYMENT_SECRET_KEY) {
    throw new Error("The payment provider is not fully configured.");
  }

  // Provider-specific checkout creation belongs here. The platform intentionally
  // does not fabricate a successful payment until a signed webhook is verified.
  return {
    reference,
    mode: "configured" as const,
    message:
      "Payment provider configuration is present, but its checkout adapter must be completed after provider onboarding.",
  };
}

export function verifyWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
