"use client";

import { FormEvent, useState } from "react";
import { formatMoney } from "@/lib/format";

const amounts = [10_000, 25_000, 50_000, 100_000];

export function DonationPanel({
  campaignSlug,
  campaignTitle,
}: {
  campaignSlug: string;
  campaignTitle: string;
}) {
  const [amount, setAmount] = useState(25_000);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("Preparing secure payment…");

    const response = await fetch("/api/donations/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignSlug,
        amount,
        donorName: data.get("donorName"),
        email: data.get("email"),
        phone: data.get("phone"),
        anonymous: data.get("anonymous") === "on",
        paymentMethod: data.get("paymentMethod"),
      }),
    });
    const result = (await response.json()) as {
      error?: string;
      message?: string;
      reference?: string;
      checkoutUrl?: string;
    };

    if (!response.ok) {
      setStatus(result.error || "Unable to prepare payment.");
      return;
    }

    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    setStatus(
      `${result.message ?? "Payment request prepared."} Reference: ${
        result.reference ?? "pending"
      }.`,
    );
  }

  return (
    <aside className="donation-panel" aria-label={`Donate to ${campaignTitle}`}>
      <span className="eyebrow">Support this campaign</span>
      <h2>Choose an amount</h2>
      <div className="amount-grid">
        {amounts.map((value) => (
          <button
            className={amount === value ? "selected" : undefined}
            key={value}
            type="button"
            onClick={() => setAmount(value)}
          >
            {formatMoney(value)}
          </button>
        ))}
      </div>
      <label>
        Custom amount (UGX)
        <input
          type="number"
          min={1000}
          step={1000}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
        />
      </label>
      <form onSubmit={submit}>
        <label>
          Name
          <input name="donorName" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone
          <input name="phone" autoComplete="tel" />
        </label>
        <label>
          Payment method
          <select name="paymentMethod" defaultValue="mobile-money">
            <option value="mobile-money">Mobile Money</option>
            <option value="card">Card</option>
            <option value="bank">Bank transfer</option>
          </select>
        </label>
        <label className="consent-line">
          <input name="anonymous" type="checkbox" />
          <span>Hide my name from the public supporter list</span>
        </label>
        <button className="button button-full" type="submit">
          Continue with {formatMoney(amount)}
        </button>
        <p className="secure-note">
          Payment credentials are handled only by the approved payment
          provider. MpaMpe never asks for your Mobile Money PIN.
        </p>
        {status ? <p className="form-notice">{status}</p> : null}
      </form>
    </aside>
  );
}
