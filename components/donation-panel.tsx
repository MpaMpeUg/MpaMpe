"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/toast-provider";
import { formatMoney } from "@/lib/format";
import { calculateDonationTotals, platformTipOptions } from "@/lib/platform";

const amounts = [10_000, 25_000, 50_000, 100_000];

export function DonationPanel({
  campaignSlug,
  campaignTitle,
  campaignAccessToken,
}: {
  campaignSlug: string;
  campaignTitle: string;
  campaignAccessToken?: string;
}) {
  const toast = useToast();
  const [amount, setAmount] = useState(25_000);
  const [tipAmount, setTipAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const totals = calculateDonationTotals(amount, tipAmount);
  const tipOptions = platformTipOptions(amount);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setStatus("Preparing secure payment…");

    try {
      const response = await fetch("/api/donations/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignSlug,
          campaignAccessToken,
          amount,
          tipAmount,
          donorName: data.get("donorName"),
          email: data.get("email"),
          phone: data.get("phone"),
          anonymous: data.get("anonymous") === "on",
          paymentMethod: data.get("paymentMethod"),
          mobileMoneyNetwork: data.get("mobileMoneyNetwork"),
          pledge: data.get("pledge") === "on",
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        reference?: string;
        checkoutUrl?: string;
        totalAmount?: number;
      };
      if (!response.ok) throw new Error(result.error || "Unable to prepare payment.");
      if (result.checkoutUrl) {
        toast({ title: "Payment ready", message: "Opening secure checkout.", tone: "success" });
        window.location.href = result.checkoutUrl;
        return;
      }
      const message = `${result.message ?? "Payment request prepared."} Reference: ${
        result.reference ?? "pending"
      }.`;
      setStatus(message);
      toast({ title: "Payment request prepared", message, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to prepare payment.";
      setStatus(message);
      toast({ title: "Payment could not start", message, tone: "error" });
    } finally {
      setSubmitting(false);
    }
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
            onClick={() => {
              setAmount(value);
            }}
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
          onChange={(event) => {
            const nextAmount = Number(event.target.value);
            setAmount(nextAmount);
          }}
        />
      </label>
      <div className="tip-box">
        <div>
          <span className="eyebrow">Optional MpaMpe tip</span>
          <p>
            Tips help MpaMpe cover platform, verification and support costs.
            Campaign progress only counts your campaign gift.
          </p>
        </div>
        <div className="tip-grid">
          {tipOptions.map((option) => (
            <button
              className={tipAmount === option.amount ? "selected" : undefined}
              key={option.label}
              type="button"
              onClick={() => setTipAmount(option.amount)}
            >
              <strong>{option.label}</strong>
              <span>{formatMoney(option.amount)}</span>
            </button>
          ))}
        </div>
        <label>
          Custom MpaMpe tip (UGX)
          <input
            type="number"
            min={0}
            step={1000}
            value={tipAmount}
            onChange={(event) => setTipAmount(Number(event.target.value))}
          />
        </label>
      </div>
      <form onSubmit={submit}>
        <label>
          Name or display name (optional when giving anonymously)
          <input name="donorName" autoComplete="name" />
        </label>
        <label>
          Email for receipt
          <input name="email" type="email" autoComplete="email" />
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
        <label>
          Mobile Money network
          <select name="mobileMoneyNetwork" defaultValue="MTN">
            <option value="MTN">MTN Mobile Money</option>
            <option value="AIRTEL">Airtel Money</option>
          </select>
        </label>
        <label className="consent-line">
          <input name="anonymous" type="checkbox" />
          <span>Hide my name from the public supporter list</span>
        </label>
        <label className="consent-line">
          <input name="pledge" type="checkbox" />
          <span>
            This is a pledge or offline giving request — MpaMpe may contact me
            to complete it.
          </span>
        </label>
        <div className="donation-summary">
          <div>
            <span>Campaign gift</span>
            <strong>{formatMoney(totals.campaignAmount)}</strong>
          </div>
          <div>
            <span>MpaMpe tip</span>
            <strong>{formatMoney(totals.tipAmount)}</strong>
          </div>
          <div>
            <span>Total charge</span>
            <strong>{formatMoney(totals.totalAmount)}</strong>
          </div>
        </div>
        <button className="button button-full" type="submit" disabled={submitting}>
          {submitting ? "Preparing payment…" : `Continue with ${formatMoney(totals.totalAmount)}`}
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
