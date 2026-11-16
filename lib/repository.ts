import crypto from "node:crypto";
import { campaigns as seededCampaigns } from "@/lib/data";
import { normalizeCampaignAccessToken } from "@/lib/campaign-access";
import { getSql, hasDatabase } from "@/lib/db";
import { publicBackerName } from "@/lib/platform";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Backer, Campaign, Pledge } from "@/lib/types";

type SubmissionRecord = {
  id: string;
  type:
    | "contact"
    | "newsletter"
    | "campaign"
    | "maverick"
    | "donation"
    | "pledge"
    | "account";
  createdAt: string;
  payload: Record<string, unknown>;
};

declare global {
  var mpampeDemoSubmissions: SubmissionRecord[] | undefined;
  var mpampeDemoPledges: Pledge[] | undefined;
}

function demoSubmissions() {
  global.mpampeDemoSubmissions ??= [];
  return global.mpampeDemoSubmissions;
}

function demoPledges() {
  global.mpampeDemoPledges ??= [];
  return global.mpampeDemoPledges;
}

function rowToCampaign(
  row: Record<string, unknown>,
  updates: Campaign["updates"] = [],
): Campaign {
  const payload = row.payload as Partial<Campaign> | null;
  if (payload?.title && payload.slug) {
    return {
      ...(payload as Campaign),
      raised: Number(row.raised_amount ?? payload.raised ?? 0),
      supporters: Number(row.supporter_count ?? payload.supporters ?? 0),
      status: (row.status as Campaign["status"]) ?? payload.status,
      visibility: (row.visibility as Campaign["visibility"]) ?? payload.visibility ?? "public",
      shareToken: row.share_token ? String(row.share_token) : payload.shareToken,
      updates: updates.length ? updates : (payload.updates ?? []),
    };
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    shortTitle: String(row.short_title || row.title),
    summary: String(row.summary),
    story: Array.isArray(row.story) ? (row.story as string[]) : [],
    category: String(row.category),
    location: String(row.location),
    image: String(row.image_url),
    goal: Number(row.goal_amount),
    raised: Number(row.raised_amount ?? 0),
    supporters: Number(row.supporter_count ?? 0),
    currency: "UGX",
    status: row.status as Campaign["status"],
    organizer: String(row.organizer_name),
    organizerType: String(row.organizer_type),
    verified: Boolean(row.verified),
    featured: Boolean(row.featured),
    visibility: row.visibility === "private" ? "private" : "public",
    shareToken: row.share_token ? String(row.share_token) : undefined,
    endDate: row.end_date ? new Date(String(row.end_date)).toISOString() : null,
    updates,
    budget: Array.isArray(row.budget)
      ? (row.budget as Campaign["budget"])
      : [],
  };
}

export async function listCampaigns(): Promise<Campaign[]> {
  const sql = getSql();
  if (!sql) {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return seededCampaigns;
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .in("status", ["active", "funded", "completed", "paused"])
      .eq("visibility", "public")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error || !data?.length) return seededCampaigns;
    return data.map((row) => rowToCampaign(row));
  }

  try {
    const rows = await sql`
      select
        id::text,
        slug,
        title,
        short_title,
        summary,
        story,
        category,
        location,
        image_url,
        goal_amount,
        raised_amount,
        supporter_count,
        currency,
        status,
        organizer_name,
        organizer_type,
        verified,
        featured,
        visibility,
        end_date,
        budget,
        payload
      from campaigns
      where status in ('active', 'funded', 'completed', 'paused')
        and visibility = 'public'
      order by featured desc, created_at desc
    `;
    if (!rows.length) return seededCampaigns;
    return rows.map((row) => rowToCampaign(row));
  } catch {
    return seededCampaigns;
  }
}

export async function getCampaign(
  slug: string,
  accessToken?: string,
): Promise<Campaign | null> {
  accessToken = normalizeCampaignAccessToken(accessToken);
  const sql = getSql();
  if (!sql) {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { data: sharedCampaign } = await supabase.rpc("get_shared_campaign", {
        p_slug: slug,
        p_share_token: accessToken || null,
      });
      if (sharedCampaign && typeof sharedCampaign === "object") {
        const campaign = sharedCampaign as Record<string, unknown>;
        const updates = Array.isArray(campaign.updates)
          ? campaign.updates as Record<string, unknown>[]
          : [];
        return rowToCampaign(
          campaign,
          updates.map((row) => ({
            id: String(row.id),
            title: String(row.title),
            body: String(row.body),
            publishedAt: new Date(String(row.published_at)).toISOString(),
          })),
        );
      }

      if (!accessToken) {
        const { data: campaign } = await supabase
          .from("campaigns")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (campaign) {
          const { data: updates } = await supabase
            .from("campaign_updates")
            .select("id,title,body,published_at")
            .eq("campaign_id", campaign.id)
            .order("published_at", { ascending: false });
          return rowToCampaign(
            campaign,
            (updates ?? []).map((row) => ({
              id: String(row.id),
              title: String(row.title),
              body: String(row.body),
              publishedAt: new Date(String(row.published_at)).toISOString(),
            })),
          );
        }
      }
    }
  }
  if (sql) {
    try {
      const rows = await sql`
        select
          id::text,
          slug,
          title,
          short_title,
          summary,
          story,
          category,
          location,
          image_url,
          goal_amount,
          raised_amount,
          supporter_count,
          currency,
          status,
          organizer_name,
          organizer_type,
          verified,
          featured,
          visibility,
          share_token,
          end_date,
          budget,
          payload
        from campaigns
        where slug = ${slug}
          and (
            visibility = 'public'
            or (visibility = 'private' and share_token::text = ${accessToken ?? ""})
          )
        limit 1
      `;
      if (rows.length) {
        const updateRows = await sql`
          select id::text, title, body, published_at
          from campaign_updates
          where campaign_id = ${rows[0].id}
          order by published_at desc
        `;
        return rowToCampaign(
          rows[0],
          updateRows.map((row) => ({
            id: row.id,
            title: row.title,
            body: row.body,
            publishedAt: new Date(row.published_at).toISOString(),
          })),
        );
      }
    } catch {
      // The seeded campaign remains a safe fallback during database setup.
    }
  }

  return seededCampaigns.find((campaign) => campaign.slug === slug && campaign.visibility === "public") ?? null;
}

export async function listCampaignBackers(
  campaignSlug: string,
  accessToken?: string,
): Promise<Backer[]> {
  accessToken = normalizeCampaignAccessToken(accessToken);
  const seeded =
    seededCampaigns.find((campaign) => campaign.slug === campaignSlug)
      ?.backers ?? [];
  const sql = getSql();
  if (!sql) {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return seeded;
    const { data, error } = await supabase.rpc("get_campaign_backers", {
      p_slug: campaignSlug,
      p_share_token: accessToken || null,
    });
    if (error && !accessToken) {
      const fallback = await supabase
        .from("public_campaign_backers")
        .select("id,campaign_slug,display_name,amount,currency,anonymous,created_at")
        .eq("campaign_slug", campaignSlug)
        .order("created_at", { ascending: false })
        .limit(25);
      if (fallback.error) return seeded;
      return ((fallback.data ?? []) as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        campaignSlug: String(row.campaign_slug),
        displayName: String(row.display_name),
        amount: Number(row.amount),
        currency: "UGX" as const,
        anonymous: Boolean(row.anonymous),
        createdAt: new Date(String(row.created_at)).toISOString(),
      }));
    }
    if (error) return seeded;
    return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      campaignSlug: String(row.campaign_slug),
      displayName: String(row.display_name),
      amount: Number(row.amount),
      currency: "UGX" as const,
      anonymous: Boolean(row.anonymous),
      createdAt: new Date(String(row.created_at)).toISOString(),
    }));
  }

  try {
    const rows = await sql`
      select
        id,
        campaign_slug,
        amount,
        currency,
        anonymous,
        donor_name,
        created_at
      from donations
      where campaign_slug = ${campaignSlug}
        and status in ('successful', 'completed')
        and exists (
          select 1 from campaigns c
          where c.slug = donations.campaign_slug
            and (
              c.visibility = 'public'
              or (c.visibility = 'private' and c.share_token::text = ${accessToken ?? ""})
            )
        )
      order by created_at desc
      limit 25
    `;

    return rows.map((row) => ({
      id: row.id,
      campaignSlug: row.campaign_slug,
      displayName: publicBackerName(row.donor_name, row.anonymous),
      amount: Number(row.amount),
      currency: row.currency,
      anonymous: Boolean(row.anonymous),
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } catch {
    return seeded;
  }
}

export async function listCampaignPledges(
  campaignSlug: string,
): Promise<Pledge[]> {
  const sql = getSql();
  if (!sql) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return demoPledges().filter((pledge) => pledge.campaignSlug === campaignSlug);
    }
    // Pledges contain private contact details and are intentionally not
    // publicly readable. Organizer/admin views will use a privileged endpoint.
    return [];
  }

  try {
    const rows = await sql`
      select id, campaign_slug, name, email, phone, amount, message, anonymous, created_at
      from pledges
      where campaign_slug = ${campaignSlug}
      order by created_at desc
      limit 25
    `;

    return rows.map((row) => ({
      id: row.id,
      campaignSlug: row.campaign_slug,
      name: publicBackerName(row.name, row.anonymous),
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      amount: row.amount ? Number(row.amount) : undefined,
      message: row.message ?? undefined,
      anonymous: Boolean(row.anonymous),
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function savePledge(payload: Record<string, unknown>) {
  const campaignAccessToken = payload.campaignAccessToken
    ? String(payload.campaignAccessToken)
    : undefined;
  const storedPayload = { ...payload };
  delete storedPayload.campaignAccessToken;
  const record: Pledge = {
    id: crypto.randomUUID(),
    campaignSlug: String(payload.campaignSlug),
    name: String(payload.name || ""),
    email: payload.email ? String(payload.email) : undefined,
    phone: payload.phone ? String(payload.phone) : undefined,
    amount: payload.amount ? Number(payload.amount) : undefined,
    message: payload.message ? String(payload.message) : undefined,
    anonymous: Boolean(payload.anonymous),
    createdAt: new Date().toISOString(),
  };

  const sql = getSql();
  let usedSupabase = false;
  if (sql) {
    const campaigns = await sql`
      select id
      from campaigns
      where slug = ${record.campaignSlug}
        and status in ('active', 'funded')
        and (
          visibility = 'public'
          or (visibility = 'private' and share_token::text = ${campaignAccessToken ?? ""})
        )
      limit 1
    `;
    if (!campaigns.length) throw new Error("This campaign is not available for pledges.");
    await sql`
      insert into pledges (
        id, campaign_id, campaign_slug, name, email, phone, amount, message, anonymous, payload, created_at
      )
      values (
        ${record.id},
        ${campaigns[0].id},
        ${record.campaignSlug},
        ${record.name || null},
        ${record.email ?? null},
        ${record.phone ?? null},
        ${record.amount ?? null},
        ${record.message ?? null},
        ${record.anonymous},
        ${sql.json(storedPayload as Parameters<typeof sql.json>[0])},
        ${record.createdAt}
      )
    `;
  } else {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.rpc("create_campaign_pledge", {
        p_id: record.id,
        p_campaign_slug: record.campaignSlug,
        p_access_token: campaignAccessToken || null,
        p_name: record.name || "",
        p_email: record.email || "",
        p_phone: record.phone || "",
        p_amount: record.amount ?? null,
        p_message: record.message || "",
        p_anonymous: record.anonymous,
        p_payload: storedPayload,
      });
      const functionMissing = ["PGRST202", "42883"].includes(error?.code || "");
      if (error && functionMissing && !campaignAccessToken) {
        const fallback = await supabase.from("pledges").insert({
          id: record.id,
          campaign_slug: record.campaignSlug,
          name: record.name || null,
          email: record.email ?? null,
          phone: record.phone ?? null,
          amount: record.amount ?? null,
          message: record.message ?? null,
          anonymous: record.anonymous,
          payload: storedPayload,
        });
        if (fallback.error) throw fallback.error;
        usedSupabase = true;
      } else if (error) {
        throw error;
      } else {
        usedSupabase = true;
      }
    } else {
      demoPledges().push(record);
    }
  }

  return {
    id: record.id,
    mode: hasDatabase() || usedSupabase ? "database" : "demo",
  } as const;
}

export async function saveCampaignApplication(
  payload: Record<string, unknown>,
) {
  const sql = getSql();
  if (!sql) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return saveSubmission("campaign", {
        ...payload,
        applicationStatus: "received",
      });
    }
    if (!payload.organizerId) throw new Error("Authenticated organizer required");
    const { data, error } = await supabase
      .from("campaign_applications")
      .insert({
        organizer_id: String(payload.organizerId),
        organizer_name: String(payload.organizerName),
        email: String(payload.email),
        phone: String(payload.phone),
        campaign_title: String(payload.campaignTitle),
        category: String(payload.category),
        location: String(payload.location),
        goal_amount: Number(payload.goal),
        summary: String(payload.summary),
        use_of_funds: String(payload.useOfFunds),
        image_path: String(payload.imagePath),
        document_paths: Array.isArray(payload.documentPaths)
          ? payload.documentPaths.map(String)
          : [],
        payload,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: String(data.id), mode: "database" } as const;
  }

  const rows = await sql`
    insert into campaign_applications (
      organizer_name,
      email,
      phone,
      campaign_title,
      category,
      location,
      goal_amount,
      summary,
      use_of_funds,
      status,
      payload
    )
    values (
      ${String(payload.organizerName)},
      ${String(payload.email)},
      ${String(payload.phone)},
      ${String(payload.campaignTitle)},
      ${String(payload.category)},
      ${String(payload.location)},
      ${Number(payload.goal)},
      ${String(payload.summary)},
      ${String(payload.useOfFunds)},
      'submitted',
      ${sql.json(payload as Parameters<typeof sql.json>[0])}
    )
    returning id
  `;

  return {
    id: String(rows[0].id),
    mode: "database",
  } as const;
}

export async function saveNewsletterSubscription(email: string) {
  const sql = getSql();
  if (!sql) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return saveSubmission("newsletter", { email });
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .insert({ id, email, source: "website", status: "subscribed" });
    if (error?.code === "23505") {
      return { id: email, mode: "database" } as const;
    }
    if (error) throw error;
    return { id, mode: "database" } as const;
  }

  const rows = await sql`
    insert into newsletter_subscriptions (email, source)
    values (${email}, 'website')
    on conflict (email)
    do update set status = 'subscribed', updated_at = now()
    returning id
  `;

  return {
    id: String(rows[0].id),
    mode: "database",
  } as const;
}

export async function saveSubmission(
  type: SubmissionRecord["type"],
  payload: Record<string, unknown>,
) {
  const record: SubmissionRecord = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload,
  };

  const sql = getSql();
  let usedSupabase = false;
  if (sql) {
    await sql`
      insert into submissions (id, submission_type, payload, created_at)
      values (
        ${record.id},
        ${type},
        ${sql.json(payload as Parameters<typeof sql.json>[0])},
        ${record.createdAt}
      )
    `;
  } else {
    const supabase = await createServerSupabaseClient();
    if (supabase && ["contact", "maverick"].includes(type)) {
      const { error } = await supabase.from("submissions").insert({
        id: record.id,
        submission_type: type,
        payload,
        created_at: record.createdAt,
      });
      if (error) throw error;
      usedSupabase = true;
    } else {
      demoSubmissions().push(record);
    }
  }

  return {
    id: record.id,
    mode: hasDatabase() || usedSupabase ? "database" : "demo",
  } as const;
}

export async function listDemoSubmissions() {
  return demoSubmissions();
}
