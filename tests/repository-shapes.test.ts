import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDonationRecord,
  buildFlutterwaveUgandaPayload,
} from "../lib/payments";

describe("donation records", () => {
  it("records campaign amount, tip, total, and MpaMpe merchant settlement", () => {
    const record = buildDonationRecord({
      campaignSlug: "test-campaign",
      campaignAccessToken: "private-token",
      amount: 50_000,
      tipAmount: 5_000,
      donorName: "Amina",
      email: "amina@example.com",
      phone: "+256700000000",
      anonymous: false,
      paymentMethod: "mobile-money",
      mobileMoneyNetwork: "MTN",
      pledge: false,
    });

    assert.equal(record.amount, 50_000);
    assert.equal(record.tipAmount, 5_000);
    assert.equal(record.totalAmount, 55_000);
    assert.equal(record.settlementAccount, "mpampe_merchant");
    assert.equal(record.campaignAccessToken, "private-token");
    assert.equal("campaignAccessToken" in record.donorPayload, false);
  });

  it("builds a Flutterwave Uganda Mobile Money charge for the total amount", () => {
    const record = buildDonationRecord(
      {
        campaignSlug: "test-campaign",
        campaignAccessToken: "private-token",
        amount: 50_000,
        tipAmount: 5_000,
        donorName: "Amina",
        email: "amina@example.com",
        phone: "+256700000000",
        anonymous: false,
        paymentMethod: "mobile-money",
        mobileMoneyNetwork: "MTN",
        pledge: false,
      },
      "MP-TEST-123",
    );

    assert.deepEqual(buildFlutterwaveUgandaPayload(record), {
      phone_number: "+256700000000",
      network: "MTN",
      amount: 55_000,
      currency: "UGX",
      email: "amina@example.com",
      tx_ref: "MP-TEST-123",
      fullname: "Amina",
      meta: {
        campaign_slug: "test-campaign",
        campaign_amount: 50_000,
        tip_amount: 5_000,
        settlement_account: "mpampe_merchant",
      },
    });
  });
});
