import crypto from "node:crypto";
import { getSql } from "@/lib/db";
import { calculateDonationTotals } from "@/lib/platform";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export type PaymentRequest = {
  campaignSlug: string;
  campaignAccessToken?: string;
  amount: number;
  tipAmount: number;
  donorName?: string;
  email?: string;
  phone?: string;
  anonymous: boolean;
  paymentMethod: "mobile-money" | "card" | "bank";
  mobileMoneyNetwork?: "MTN" | "AIRTEL";
  pledge: boolean;
};

export const MPAMPE_SETTLEMENT_ACCOUNT = "mpampe_merchant";

export type DonationRecord = {
  id: string;
  reference: string;
  campaignSlug: string;
  campaignAccessToken?: string;
  amount: number;
  tipAmount: number;
  totalAmount: number;
  currency: "UGX";
  status: "initiated";
  provider: string;
  settlementAccount: typeof MPAMPE_SETTLEMENT_ACCOUNT;
  donorPayload: {
    name?: string;
    email?: string;
    phone?: string;
    anonymous: boolean;
    paymentMethod: PaymentRequest["paymentMethod"];
    mobileMoneyNetwork?: PaymentRequest["mobileMoneyNetwork"];
    pledge: boolean;
  };
};

export type FlutterwaveUgandaPayload = {
  phone_number: string;
  network: "MTN" | "AIRTEL";
  amount: number;
  currency: "UGX";
  email: string;
  tx_ref: string;
  fullname?: string;
  meta: {
    campaign_slug: string;
    campaign_amount: number;
    tip_amount: number;
    settlement_account: typeof MPAMPE_SETTLEMENT_ACCOUNT;
  };
};

export function createPaymentReference() {
  return `MP-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

export function buildDonationRecord(
  request: PaymentRequest,
  reference = createPaymentReference(),
): DonationRecord {
  const totals = calculateDonationTotals(request.amount, request.tipAmount);

  return {
    id: crypto.randomUUID(),
    reference,
    campaignSlug: request.campaignSlug,
    campaignAccessToken: request.campaignAccessToken,
    amount: totals.campaignAmount,
    tipAmount: totals.tipAmount,
    totalAmount: totals.totalAmount,
    currency: "UGX",
    status: "initiated",
    provider: process.env.PAYMENT_PROVIDER || "demo",
    settlementAccount: MPAMPE_SETTLEMENT_ACCOUNT,
    donorPayload: {
      name: request.donorName || undefined,
      email: request.email || undefined,
      phone: request.phone || undefined,
      anonymous: request.anonymous,
      paymentMethod: request.paymentMethod,
      mobileMoneyNetwork: request.mobileMoneyNetwork,
      pledge: request.pledge,
    },
  };
}

export function buildFlutterwaveUgandaPayload(
  record: DonationRecord,
): FlutterwaveUgandaPayload {
  if (!record.donorPayload.phone) {
    throw new Error("Phone number is required for Uganda Mobile Money.");
  }

  if (!record.donorPayload.email) {
    throw new Error("Email is required for Flutterwave receipts.");
  }

  if (!record.donorPayload.mobileMoneyNetwork) {
    throw new Error("Select MTN or Airtel for Uganda Mobile Money.");
  }

  return {
    phone_number: record.donorPayload.phone,
    network: record.donorPayload.mobileMoneyNetwork,
    amount: record.totalAmount,
    currency: "UGX",
    email: record.donorPayload.email,
    tx_ref: record.reference,
    fullname: record.donorPayload.name,
    meta: {
      campaign_slug: record.campaignSlug,
      campaign_amount: record.amount,
      tip_amount: record.tipAmount,
      settlement_account: record.settlementAccount,
    },
  };
}

async function initiateFlutterwaveUgandaCharge(record: DonationRecord) {
  if (record.donorPayload.paymentMethod !== "mobile-money") {
    throw new Error(
      "Flutterwave Uganda integration is configured for Mobile Money.",
    );
  }

  const secretKey = process.env.PAYMENT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Flutterwave secret key is not configured.");
  }

  const response = await fetch(
    "https://api.flutterwave.com/v3/charges?type=mobile_money_uganda",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildFlutterwaveUgandaPayload(record)),
    },
  );
  const payload = (await response.json()) as {
    status?: string;
    message?: string;
    meta?: {
      authorization?: {
        redirect?: string;
        mode?: string;
      };
    };
  };

  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message || "Flutterwave charge initiation failed.");
  }

  return {
    checkoutUrl: payload.meta?.authorization?.redirect,
    message: payload.message || "Flutterwave Mobile Money charge initiated.",
  };
}

export async function initiatePayment(request: PaymentRequest) {
  const record = buildDonationRecord(request);
  const provider = process.env.PAYMENT_PROVIDER || "demo";
  const sql = getSql();

  if (sql) {
    const campaigns = await sql`
      select id
      from campaigns
      where slug = ${record.campaignSlug}
        and status in ('active', 'funded')
        and (
          visibility = 'public'
          or (
            visibility = 'private'
            and share_token::text = ${record.campaignAccessToken ?? ""}
          )
        )
      limit 1
    `;
    if (!campaigns.length) {
      throw new Error("This campaign is not available for donations.");
    }
    await sql`
      insert into donations (
        id, campaign_id, campaign_slug, amount, tip_amount, total_amount, currency, status,
        provider, provider_reference, settlement_account, donor_payload,
        donor_name, donor_email, donor_phone, anonymous, created_at, updated_at
      )
      values (
        ${record.id},
        ${campaigns[0].id},
        ${record.campaignSlug},
        ${record.amount},
        ${record.tipAmount},
        ${record.totalAmount},
        ${record.currency},
        ${record.status},
        ${provider},
        ${record.reference},
        ${record.settlementAccount},
        ${sql.json(record.donorPayload as Parameters<typeof sql.json>[0])},
        ${record.donorPayload.name ?? null},
        ${record.donorPayload.email ?? null},
        ${record.donorPayload.phone ?? null},
        ${record.donorPayload.anonymous},
        now(),
        now()
      )
    `;
  } else {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { error } = await supabase.rpc("create_campaign_donation", {
        p_id: record.id,
        p_campaign_slug: record.campaignSlug,
        p_access_token: record.campaignAccessToken || null,
        p_amount: record.amount,
        p_tip_amount: record.tipAmount,
        p_total_amount: record.totalAmount,
        p_currency: record.currency,
        p_provider: provider,
        p_reference: record.reference,
        p_settlement_account: record.settlementAccount,
        p_donor_payload: record.donorPayload,
        p_donor_name: record.donorPayload.name || "",
        p_donor_email: record.donorPayload.email || "",
        p_donor_phone: record.donorPayload.phone || "",
        p_anonymous: record.donorPayload.anonymous,
      });
      const functionMissing = ["PGRST202", "42883"].includes(error?.code || "");
      if (error && !(functionMissing && provider === "demo" && !record.campaignAccessToken)) {
        throw new Error(error.message);
      }
    }
  }

  if (provider === "demo") {
    return {
      reference: record.reference,
      mode: "demo" as const,
      message:
        "Demo payment request created. No money has been transferred. Connect an approved payment provider to enable checkout.",
      totalAmount: record.totalAmount,
      tipAmount: record.tipAmount,
    };
  }

  if (!process.env.PAYMENT_SECRET_KEY) {
    throw new Error("The payment provider is not fully configured.");
  }

  if (provider === "flutterwave") {
    const flutterwave = await initiateFlutterwaveUgandaCharge(record);
    if (sql && flutterwave.checkoutUrl) {
      await sql`
        update donations
        set checkout_url = ${flutterwave.checkoutUrl}, status = 'pending', updated_at = now()
        where provider_reference = ${record.reference}
      `;
    }

    return {
      reference: record.reference,
      mode: "flutterwave" as const,
      checkoutUrl: flutterwave.checkoutUrl,
      message: flutterwave.message,
      totalAmount: record.totalAmount,
      tipAmount: record.tipAmount,
    };
  }

  // Provider-specific checkout creation belongs here. The platform intentionally
  // does not fabricate a successful payment until a signed webhook is verified.
  return {
    reference: record.reference,
    mode: "configured" as const,
    message:
      "Payment provider configuration is present, but its checkout adapter must be completed after provider onboarding.",
    totalAmount: record.totalAmount,
    tipAmount: record.tipAmount,
  };
}

export function verifyWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  if ((process.env.PAYMENT_PROVIDER || "demo") === "flutterwave") {
    const left = Buffer.from(secret);
    const right = Buffer.from(signature);
    return left.length === right.length && crypto.timingSafeEqual(left, right);
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
