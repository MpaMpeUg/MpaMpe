"use client";

import { FormEvent, useState } from "react";

export function CampaignApplicationForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("submitting");
    setMessage("Submitting your campaign for initial review…");

    try {
      const response = await fetch("/api/campaign-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          acceptedTerms: data.acceptedTerms === "on",
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
        reference?: string;
      };
      if (!response.ok) throw new Error(result.error || "Submission failed");
      form.reset();
      setStatus("success");
      setMessage(
        `${result.message} Reference: ${result.reference ?? "pending"}.`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form className="form-card campaign-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Organizer name
          <input name="organizerName" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone
          <input name="phone" autoComplete="tel" required />
        </label>
        <label>
          Location
          <input name="location" required />
        </label>
        <label>
          Campaign title
          <input name="campaignTitle" minLength={8} required />
        </label>
        <label>
          Category
          <select name="category" defaultValue="" required>
            <option value="" disabled>
              Select category
            </option>
            <option>Medical</option>
            <option>Education</option>
            <option>Emergency</option>
            <option>Community</option>
            <option>Creative</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Fundraising goal (UGX)
          <input name="goal" type="number" min={50000} step={1000} required />
        </label>
      </div>
      <label>
        Tell us the campaign story
        <textarea
          name="summary"
          rows={7}
          minLength={80}
          placeholder="Who needs support, what happened, and why is the campaign important?"
          required
        />
      </label>
      <label>
        How will the funds be used?
        <textarea
          name="useOfFunds"
          rows={5}
          minLength={40}
          placeholder="Provide a clear budget or breakdown."
          required
        />
      </label>
      <label className="consent-line">
        <input name="acceptedTerms" type="checkbox" required />
        <span>
          I confirm that the information is accurate and I have permission to
          represent the beneficiary.
        </span>
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button className="button" disabled={status === "submitting"}>
        Submit for review
      </button>
      {message ? (
        <p
          className={`form-notice form-notice-${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
