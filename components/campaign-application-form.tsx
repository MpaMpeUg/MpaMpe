"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/toast-provider";

export function CampaignApplicationForm() {
  const toast = useToast();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("submitting");
    setMessage("Uploading your campaign information…");

    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("Sign in and confirm your email before submitting a campaign.");
      }

      const image = formData.get("campaignImage");
      if (!(image instanceof File) || image.size === 0) {
        throw new Error("Add a campaign image before submitting.");
      }

      const imageExtension = image.name.split(".").pop()?.toLowerCase() || "webp";
      const imagePath = `${authData.user.id}/${crypto.randomUUID()}.${imageExtension}`;
      const documents = formData
        .getAll("documents")
        .filter((item): item is File => item instanceof File && item.size > 0)
        .slice(0, 5);
      const imageUpload = supabase.storage
        .from("campaign-images")
        .upload(imagePath, image, { contentType: image.type, upsert: false });
      const documentUploads = Promise.all(
        documents.map(async (document) => {
          const extension =
            document.name.split(".").pop()?.toLowerCase() || "pdf";
          const path = `${authData.user.id}/${crypto.randomUUID()}.${extension}`;
          const { error } = await supabase.storage
            .from("campaign-documents")
            .upload(path, document, {
              contentType: document.type,
              upsert: false,
            });
          if (error) throw new Error(`Document upload failed: ${error.message}`);
          return path;
        }),
      );
      const [{ error: imageError }, documentPaths] = await Promise.all([
        imageUpload,
        documentUploads,
      ]);
      if (imageError) throw new Error(`Image upload failed: ${imageError.message}`);

      const data = Object.fromEntries(
        Array.from(formData.entries()).filter(
          ([name]) => name !== "campaignImage" && name !== "documents",
        ),
      );
      const response = await fetch("/api/campaign-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          imagePath,
          documentPaths,
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
      toast({
        title: "Campaign submitted",
        message: `Reference: ${result.reference ?? "pending"}`,
        tone: "success",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      setStatus("error");
      setMessage(errorMessage);
      toast({ title: "Campaign submission failed", message: errorMessage, tone: "error" });
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
      <label>
        Campaign image
        <input
          name="campaignImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
        />
        <span className="field-help">JPG, PNG or WebP, up to 5 MB.</span>
      </label>
      <label>
        Supporting documents (optional)
        <input
          name="documents"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          multiple
        />
        <span className="field-help">
          Up to five consent, budget or verification files. These remain private.
        </span>
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
      <p className="field-help">
        Need an account? <Link href="/dashboard">Sign in or create one first.</Link>
      </p>
    </form>
  );
}
