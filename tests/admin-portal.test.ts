import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { User } from "@supabase/supabase-js";
import { readAdminResponse } from "../lib/admin-http";
import { parseJsonBody } from "../lib/http";
import { isSupabaseAdmin } from "../lib/supabase/server";

function appUser(metadata: Record<string, unknown>) {
  return { app_metadata: metadata } as User;
}

describe("admin portal", () => {
  it("uses one canonical, server-controlled admin role", () => {
    assert.equal(isSupabaseAdmin(appUser({ role: "admin" })), true);
    assert.equal(isSupabaseAdmin(appUser({ roles: ["admin"] })), false);
    assert.equal(isSupabaseAdmin(appUser({ role: "organizer" })), false);
  });

  it("handles JSON, empty and non-JSON admin responses", async () => {
    assert.deepEqual(
      await readAdminResponse(
        new Response(JSON.stringify({ message: "Updated." }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
      { message: "Updated." },
    );

    await assert.rejects(
      () => readAdminResponse(new Response("Gateway failure", { status: 502 })),
      /Admin action failed \(502\)/,
    );
  });

  it("turns malformed JSON request bodies into validation input", async () => {
    const request = new Request("https://example.test/admin", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: "{broken",
    });
    assert.equal(await parseJsonBody(request), null);
  });

  it("uses Supabase for the protected submissions endpoint", () => {
    const route = readFileSync("app/api/admin/submissions/route.ts", "utf8");
    assert.match(route, /createServerSupabaseClient/);
    assert.match(route, /\.from\("submissions"\)/);
    assert.doesNotMatch(route, /getSql|listDemoSubmissions/);
  });

  it("does not report successful updates for missing admin records", () => {
    const routes = [
      "app/api/admin/campaign-applications/[id]/status/route.ts",
      "app/api/admin/campaigns/[id]/status/route.ts",
      "app/api/admin/gallery/[id]/status/route.ts",
    ];
    for (const routePath of routes) {
      const route = readFileSync(routePath, "utf8");
      assert.match(route, /select\("id/);
      assert.match(route, /404/);
    }
  });

  it("lands signed-out administrators at the account form", () => {
    const adminPage = readFileSync("app/admin/page.tsx", "utf8");
    const dashboardPage = readFileSync("app/dashboard/page.tsx", "utf8");
    assert.match(adminPage, /dashboard\?next=\/admin#account/);
    assert.match(dashboardPage, /id="account"/);
  });

  it("provides loading and recovery screens for the dynamic admin page", () => {
    assert.equal(existsSync("app/admin/loading.tsx"), true);
    assert.equal(existsSync("app/admin/error.tsx"), true);
    assert.match(readFileSync("app/admin/error.tsx", "utf8"), /reset\(\)/);
  });

  it("loads the campaign evidence administrators need for review", () => {
    const repository = readFileSync("lib/admin-repository.ts", "utf8");
    const operations = readFileSync("components/admin-operations.tsx", "utf8");
    assert.match(repository, /summary,use_of_funds/);
    assert.match(repository, /document_paths/);
    assert.match(operations, /Review details/);
    assert.match(operations, /Needs information/);
  });

  it("tracks the hardened role-management database function", () => {
    const migration = readFileSync(
      "database/migrations/20261115190000_harden_admin_operations.sql",
      "utf8",
    );
    assert.match(migration, /Campaign platform user was not found/);
    assert.match(migration, /raw_app_meta_data/);
  });
});
