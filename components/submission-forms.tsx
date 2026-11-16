"use client";

import { FormEvent, useId, useState } from "react";
import { useToast } from "@/components/toast-provider";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialState: FormState = { status: "idle", message: "" };

async function submitJson(url: string, data: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = (await response.json()) as { message?: string; error?: string };
  if (!response.ok) throw new Error(payload.error || "Unable to submit form");
  return payload;
}

function FormNotice({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  return (
    <p
      className={`form-notice form-notice-${state.status}`}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

export function NewsletterForm() {
  const toast = useToast();
  const [state, setState] = useState<FormState>(initialState);
  const emailId = `newsletter-email-${useId().replaceAll(":", "")}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ status: "submitting", message: "Subscribing…" });
    try {
      const result = await submitJson("/api/newsletter", {
        email: data.get("email"),
        website: data.get("website"),
      });
      form.reset();
      setState({
        status: "success",
        message: result.message || "You are subscribed.",
      });
      toast({ title: "Subscribed", message: result.message, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setState({
        status: "error",
        message,
      });
      toast({ title: "Subscription failed", message, tone: "error" });
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={emailId}>
        Email address
      </label>
      <input
        id={emailId}
        name="email"
        type="email"
        placeholder="Email address"
        autoComplete="email"
        required
      />
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button disabled={state.status === "submitting"} type="submit">
        Subscribe
      </button>
      <FormNotice state={state} />
    </form>
  );
}

export function ContactForm() {
  const toast = useToast();
  const [state, setState] = useState<FormState>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "submitting", message: "Sending your message…" });
    try {
      const result = await submitJson("/api/contact", data);
      form.reset();
      setState({
        status: "success",
        message:
          result.message ||
          "Message received. The MpaMpe team will respond shortly.",
      });
      toast({ title: "Message received", message: result.message, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setState({
        status: "error",
        message,
      });
      toast({ title: "Message not sent", message, tone: "error" });
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field label="Phone" name="phone" autoComplete="tel" />
        <label>
          Inquiry type
          <select name="inquiryType" defaultValue="" required>
            <option value="" disabled>
              Select one
            </option>
            <option>Start a campaign</option>
            <option>Become a Maverick</option>
            <option>Partner with MpaMpe</option>
            <option>Payment or donation support</option>
            <option>General inquiry</option>
          </select>
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={6} minLength={10} required />
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button
        className="button"
        disabled={state.status === "submitting"}
        type="submit"
      >
        Send message
      </button>
      <FormNotice state={state} />
    </form>
  );
}

export function MaverickApplicationForm() {
  const toast = useToast();
  const [state, setState] = useState<FormState>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ status: "submitting", message: "Sending your application…" });
    try {
      const result = await submitJson("/api/mavericks", {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        location: data.get("location"),
        interests: data.getAll("interests"),
        availability: data.get("availability"),
        motivation: data.get("motivation"),
        acceptedConduct: data.get("acceptedConduct") === "on",
        website: data.get("website"),
      });
      form.reset();
      setState({
        status: "success",
        message:
          result.message ||
          "Application received. We will share orientation details after review.",
      });
      toast({ title: "Application received", message: result.message, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setState({
        status: "error",
        message,
      });
      toast({ title: "Application not sent", message, tone: "error" });
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Phone"
          name="phone"
          autoComplete="tel"
          required
        />
        <Field label="Location" name="location" required />
      </div>
      <fieldset>
        <legend>How would you like to contribute?</legend>
        <div className="check-grid">
          {[
            "Campaign amplification",
            "Storytelling",
            "Field support",
            "Events",
            "Creative work",
            "Technology",
          ].map((interest) => (
            <label className="check-option" key={interest}>
              <input name="interests" type="checkbox" value={interest} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Availability
        <select name="availability" defaultValue="" required>
          <option value="" disabled>
            Select your availability
          </option>
          <option>2–4 hours weekly</option>
          <option>One day monthly</option>
          <option>Project-based</option>
          <option>Events only</option>
        </select>
      </label>
      <label>
        Why do you want to become a Maverick?
        <textarea name="motivation" rows={6} minLength={30} required />
      </label>
      <label className="consent-line">
        <input name="acceptedConduct" type="checkbox" required />
        <span>
          I agree to follow the MpaMpe volunteer code of conduct, safeguarding
          rules and consent requirements.
        </span>
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button
        className="button"
        disabled={state.status === "submitting"}
        type="submit"
      >
        Apply to join
      </button>
      <FormNotice state={state} />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  );
}
