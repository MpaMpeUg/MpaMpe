import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";

describe("private campaign management", () => {
  it("defines non-enumerable public and private campaign access", () => {
    const migrationName = readdirSync("database/migrations").find((name) =>
      name.endsWith("_private_campaigns.sql"),
    );
    assert.ok(migrationName, "private campaign migration is missing");
    const migration = readFileSync(`database/migrations/${migrationName}`, "utf8");
    assert.match(migration, /visibility[^\n]+public[^\n]+private/i);
    assert.match(migration, /share_token/);
    assert.match(migration, /get_shared_campaign/);
    assert.match(migration, /get_campaign_backers/);
    assert.match(migration, /visibility\s*=\s*'public'/);
    assert.match(migration, /p_share_token/);
    assert.match(migration, /auth\.uid\(\)/);
    assert.match(migration, /set_organizer_campaign_visibility/);
    assert.match(migration, /campaign_row\.visibility[\s\S]+gen_random_uuid/);
    assert.doesNotMatch(migration, /grant select[^;]+share_token/i);
  });

  it("excludes private campaigns from discovery and validates direct links", () => {
    const repository = readFileSync("lib/repository.ts", "utf8");
    const page = readFileSync("app/campaigns/[slug]/page.tsx", "utf8");
    assert.match(repository, /visibility/);
    assert.match(repository, /get_shared_campaign/);
    assert.match(repository, /get_campaign_backers/);
    assert.match(page, /searchParams/);
    assert.match(page, /access/);
    assert.match(page, /robots/);
    assert.match(page, /campaignAccessToken/);
  });

  it("gives approved organizers a responsive visibility control", () => {
    const dashboard = readFileSync("components/creator-dashboard.tsx", "utf8");
    const repository = readFileSync("lib/creator-dashboard-repository.ts", "utf8");
    const route = readFileSync(
      "app/api/organizer/campaigns/[id]/visibility/route.ts",
      "utf8",
    );
    assert.match(dashboard, /campaign-visibility-switch/);
    assert.match(dashboard, /Private campaign/);
    assert.match(dashboard, /Copy private link/);
    assert.match(repository, /visibility,share_token/);
    assert.match(route, /getCurrentSupabaseUser/);
    assert.match(route, /set_organizer_campaign_visibility/);
    assert.match(route, /revalidatePath/);
  });

  it("threads private access through donations without leaking it to providers", () => {
    const donationPanel = readFileSync("components/donation-panel.tsx", "utf8");
    const pledgePanel = readFileSync("components/pledge-panel.tsx", "utf8");
    const payments = readFileSync("lib/payments.ts", "utf8");
    const validation = readFileSync("lib/validation.ts", "utf8");
    const donationRoute = readFileSync("app/api/donations/initiate/route.ts", "utf8");
    const pledgeRoute = readFileSync("app/api/pledges/route.ts", "utf8");
    assert.match(donationPanel, /campaignAccessToken/);
    assert.match(pledgePanel, /campaignAccessToken/);
    assert.match(payments, /campaignAccessToken/);
    assert.match(validation, /campaignAccessToken/);
    assert.match(donationRoute, /getCampaign/);
    assert.match(pledgeRoute, /getCampaign/);
    assert.match(donationPanel, /useState\(0\)/);
    assert.match(donationPanel, /anonymous/);
    const campaignPage = readFileSync("app/campaigns/[slug]/page.tsx", "utf8");
    assert.match(campaignPage, /role="progressbar"/);
    assert.doesNotMatch(payments, /meta:\s*\{[^}]*campaignAccessToken/);
  });
});
