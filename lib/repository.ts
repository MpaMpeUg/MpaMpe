import { campaigns as seededCampaigns } from "@/lib/data";
import { getSql, hasDatabase } from "@/lib/db";
import type { Campaign } from "@/lib/types";

type SubmissionRecord = {
  id: string;
  type: "contact" | "newsletter" | "campaign" | "maverick" | "donation";
  createdAt: string;
  payload: Record<string, unknown>;
};

declare global {
  var mpampeDemoSubmissions: SubmissionRecord[] | undefined;
}

function demoSubmissions() {
  global.mpampeDemoSubmissions ??= [];
  return global.mpampeDemoSubmissions;
}

export async function listCampaigns(): Promise<Campaign[]> {
  const sql = getSql();
  if (!sql) return seededCampaigns;

  try {
    const rows = await sql`
      select payload
      from campaigns
      where status in ('active', 'funded', 'completed', 'paused')
      order by featured desc, created_at desc
    `;
    if (!rows.length) return seededCampaigns;
    return rows.map((row) => row.payload as Campaign);
  } catch {
    return seededCampaigns;
  }
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = await sql`
        select payload from campaigns where slug = ${slug} limit 1
      `;
      if (rows.length) return rows[0].payload as Campaign;
    } catch {
      // The seeded campaign remains a safe fallback during database setup.
    }
  }

  return seededCampaigns.find((campaign) => campaign.slug === slug) ?? null;
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
    demoSubmissions().push(record);
  }

  return {
    id: record.id,
    mode: hasDatabase() ? "database" : "demo",
  } as const;
}

export async function listDemoSubmissions() {
  return demoSubmissions();
}
