import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { User } from "@supabase/supabase-js";
import { authenticatedUserFromResponse } from "../lib/auth-state";
import { storagePathsBelongToUser } from "../lib/platform";
import { isSupabaseAdmin } from "../lib/supabase/server";
import { campaignApplicationSchema } from "../lib/validation";

function userWithMetadata(appRole?: string, userRole?: string) {
  return {
    app_metadata: appRole ? { role: appRole } : {},
    user_metadata: userRole ? { role: userRole } : {},
  } as User;
}

describe("Supabase authorization boundaries", () => {
  it("does not grant admin access from user-editable metadata", () => {
    assert.equal(isSupabaseAdmin(userWithMetadata(undefined, "admin")), false);
    assert.equal(isSupabaseAdmin(userWithMetadata("admin")), true);
  });

  it("keeps validated campaign storage paths for the authenticated submission", () => {
    const result = campaignApplicationSchema.parse({
      organizerName: "Amina Organizer",
      email: "amina@example.com",
      phone: "+256700000000",
      campaignTitle: "Help build the community clinic",
      category: "Community",
      location: "Kampala",
      goal: 500000,
      summary: "A".repeat(100),
      useOfFunds: "B".repeat(60),
      imagePath: "user-id/clinic.webp",
      documentPaths: ["user-id/consent.pdf"],
      acceptedTerms: true,
    });

    assert.equal(result.imagePath, "user-id/clinic.webp");
    assert.deepEqual(result.documentPaths, ["user-id/consent.pdf"]);
  });

  it("does not treat an unconfirmed signup as an authenticated session", () => {
    const pendingUser = { id: "pending-user" } as User;

    assert.equal(
      authenticatedUserFromResponse({ user: pendingUser, session: null }),
      null,
    );
    assert.equal(
      authenticatedUserFromResponse({
        user: pendingUser,
        session: { user: pendingUser },
      }),
      pendingUser,
    );
  });

  it("accepts only campaign uploads owned by the authenticated organizer", () => {
    assert.equal(
      storagePathsBelongToUser("organizer-1", "organizer-1/cover.webp", [
        "organizer-1/consent.pdf",
      ]),
      true,
    );
    assert.equal(
      storagePathsBelongToUser("organizer-1", "another-user/cover.webp", []),
      false,
    );
  });
});
