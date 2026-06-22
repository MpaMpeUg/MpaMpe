import crypto from "node:crypto";
import { getSql } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { verifyWebhook } from "@/lib/payments";

type PaymentEvent = {
  id?: string;
  reference?: string;
  type?: string;
  status?: string;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-payment-signature");
  if (!verifyWebhook(rawBody, signature)) {
    return jsonError("Invalid webhook signature.", 401);
  }

  let event: PaymentEvent;
  try {
    event = JSON.parse(rawBody) as PaymentEvent;
  } catch {
    return jsonError("Invalid webhook payload.");
  }

  if (!event.reference || !event.type) {
    return jsonError("Missing payment event fields.");
  }

  const sql = getSql();
  if (!sql) {
    return jsonError("Payment storage is not configured.", 503);
  }

  const eventId = event.id || crypto.randomUUID();
  const inserted = await sql`
    insert into payment_events (
      id, provider, provider_reference, event_type, payload, processed_at
    )
    values (
      ${eventId},
      ${process.env.PAYMENT_PROVIDER || "configured"},
      ${event.reference},
      ${event.type},
      ${sql.json(event as Parameters<typeof sql.json>[0])},
      now()
    )
    on conflict (provider_reference) do nothing
    returning id
  `;

  if (!inserted.length) {
    return Response.json({ received: true, duplicate: true });
  }

  const normalizedStatus =
    event.status === "successful"
      ? "successful"
      : event.status === "failed"
        ? "failed"
        : event.status === "reversed"
          ? "reversed"
          : "pending";

  await sql`
    update donations
    set status = ${normalizedStatus}, updated_at = now()
    where provider_reference = ${event.reference}
  `;

  return Response.json({ received: true });
}
