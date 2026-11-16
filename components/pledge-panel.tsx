"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/toast-provider";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export function PledgePanel({
  campaignSlug,
  campaignTitle,
  campaignAccessToken,
}: {
  campaignSlug: string;
  campaignTitle: string;
  campaignAccessToken?: string;
}) {
  const toast = useToast();
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({
      status: "submitting",
      message: "Saving pledge information…",
    });

    try {
      const response = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          campaignSlug,
          campaignAccessToken,
          anonymous: data.anonymous === "on",
          contactConsent: data.contactConsent === "on",
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
        reference?: string;
      };
      if (!response.ok) throw new Error(result.error || "Unable to save pledge");
      form.reset();
      setState({
        status: "success",
        message: `${result.message} Reference: ${result.reference ?? "pending"}.`,
      });
      toast({ title: "Pledge saved", message: result.message, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setState({
        status: "error",
        message,
      });
      toast({ title: "Pledge not saved", message, tone: "error" });
    }
  }

  return (
    <section className="pledge-panel" aria-label={`Pledge to ${campaignTitle}`}>
      <span className="eyebrow">Prefer to pledge first?</span>
      <h2>Share your giving intention</h2>
      <p>
        Use this if you want MpaMpe to follow up, coordinate an offline gift, or
        capture a pledge before payment.
      </p>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Pledge amount (UGX)
            <input name="amount" type="number" min={0} step={1000} />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            Phone
            <input name="phone" autoComplete="tel" />
          </label>
        </div>
        <label>
          Note
          <textarea
            name="message"
            rows={4}
            placeholder="Optional note for the MpaMpe team"
          />
        </label>
        <label className="consent-line">
          <input name="anonymous" type="checkbox" />
          <span>Keep my pledge anonymous in public summaries</span>
        </label>
        <label className="consent-line">
          <input name="contactConsent" type="checkbox" required />
          <span>I allow MpaMpe to contact me about this pledge.</span>
        </label>
        <input
          className="honeypot"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button className="button button-secondary" type="submit">
          Save pledge
        </button>
        {state.message ? (
          <p
            className={`form-notice form-notice-${state.status}`}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
