import { getSql } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { verifyWebhook } from "@/lib/payments";

type PaymentEvent = {
  id?: string;
  reference?: string;
  type?: string;
  status?: string;
  event?: string;
  data?: {
    id?: string | number;
    tx_ref?: string;
    status?: string;
  };
};

function normalizePaymentEvent(event: PaymentEvent) {
  return {
    id: event.id || event.data?.id?.toString(),
    reference: event.reference || event.data?.tx_ref,
    type: event.type || event.event,
    status: event.status || event.data?.status,
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-payment-signature") ||
    request.headers.get("verif-hash");
  if (!verifyWebhook(rawBody, signature)) {
    return jsonError("Invalid webhook signature.", 401);
  }

  let event: PaymentEvent;
  try {
    event = JSON.parse(rawBody) as PaymentEvent;
  } catch {
    return jsonError("Invalid webhook payload.");
  }

  const normalized = normalizePaymentEvent(event);

  if (!normalized.reference || !normalized.type) {
    return jsonError("Missing payment event fields.");
  }

  const sql = getSql();
  if (!sql) {
    return jsonError("Payment storage is not configured.", 503);
  }

  const provider = process.env.PAYMENT_PROVIDER || "configured";
  const eventId =
    normalized.id ||
    `${provider}:${normalized.reference}:${normalized.type}`;
  const inserted = await sql`
    insert into payment_events (
      id, provider, provider_reference, event_type, payload, processed_at
    )
    values (
      ${eventId},
      ${provider},
      ${normalized.reference},
      ${normalized.type},
      ${sql.json(event as Parameters<typeof sql.json>[0])},
      now()
    )
    on conflict (provider, provider_reference, event_type) do nothing
    returning id
  `;

  if (!inserted.length) {
    return Response.json({ received: true, duplicate: true });
  }

  const normalizedStatus =
    normalized.status === "successful"
      ? "successful"
      : normalized.status === "failed"
        ? "failed"
        : normalized.status === "reversed"
          ? "reversed"
          : "pending";

  const updated = await sql`
    update donations
    set
      status = ${normalizedStatus},
      confirmed_at = case
        when ${normalizedStatus} in ('successful', 'completed') then now()
        else confirmed_at
      end,
      updated_at = now()
    where provider_reference = ${normalized.reference}
    returning campaign_slug
  `;

  if (updated.length) {
    await sql`select public.refresh_campaign_totals(${updated[0].campaign_slug})`;
  }

  return Response.json({ received: true });
}
