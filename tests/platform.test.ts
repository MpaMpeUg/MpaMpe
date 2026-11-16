import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCampaignProgress,
  calculateDonationTotals,
  platformTipOptions,
  publicBackerName,
} from "../lib/platform";

describe("platform donation helpers", () => {
  it("caps public campaign progress at 100 percent", () => {
    assert.equal(calculateCampaignProgress(120_000, 100_000), 100);
  });

  it("keeps campaign amount separate from platform tip", () => {
    assert.deepEqual(calculateDonationTotals(50_000, 5_000), {
      campaignAmount: 50_000,
      tipAmount: 5_000,
      totalAmount: 55_000,
    });
  });

  it("uses Anonymous for public backers that hide their name", () => {
    assert.equal(publicBackerName("Amina", true), "Anonymous");
  });

  it("offers default tip suggestions derived from the donation amount", () => {
    assert.deepEqual(
      platformTipOptions(50_000).map((option) => option.amount),
      [0, 2_500, 5_000, 7_500],
    );
  });
});
