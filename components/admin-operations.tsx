"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { normalizeCampaignSlug } from "@/lib/admin";
import { readAdminResponse } from "@/lib/admin-http";
import type { AdminDashboardData } from "@/lib/admin-repository";
import { useToast } from "@/components/toast-provider";

function text(value: unknown) {
  return value == null ? "—" : String(value);
}

function money(value: unknown) {
  return `UGX ${Number(value || 0).toLocaleString("en-UG")}`;
}

async function requestJson(url: string, method: "POST" | "PATCH", body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readAdminResponse(response);
}

async function requestForm(url: string, body: FormData) {
  const response = await fetch(url, { method: "POST", body });
  return readAdminResponse(response);
}

export function AdminOperations({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState("");

  async function run(key: string, action: () => Promise<{ message?: string }>) {
    setBusy(key);
    try {
      const result = await action();
      toast({ title: "Admin action completed", message: result.message, tone: "success" });
      router.refresh();
      return true;
    } catch (error) {
      toast({
        title: "Admin action failed",
        message: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
      return false;
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="admin-operations">
      <section id="applications" className="admin-section">
        <div className="admin-section-heading">
          <div><span className="eyebrow">Campaign pipeline</span><h2>Applications</h2></div>
          <strong>{data.applications.length}</strong>
        </div>
        <div className="admin-list">
          {data.applications.map((application) => {
            const id = text(application.id);
            const title = text(application.campaign_title);
            const status = text(application.status);
            return (
              <article className="admin-record" key={id}>
                <div>
                  <span className={`status status-${status.replace("_", "-")}`}>{status.replace("_", " ")}</span>
                  <h3>{title}</h3>
                  <p>{text(application.organizer_name)} · {text(application.email)} · {money(application.goal_amount)}</p>
                  <details className="admin-review-details">
                    <summary>Review details</summary>
                    <dl>
                      <div><dt>Category</dt><dd>{text(application.category)}</dd></div>
                      <div><dt>Location</dt><dd>{text(application.location)}</dd></div>
                      <div><dt>Summary</dt><dd>{text(application.summary)}</dd></div>
                      <div><dt>Use of funds</dt><dd>{text(application.use_of_funds)}</dd></div>
                      <div>
                        <dt>Documents</dt>
                        <dd>{Array.isArray(application.document_paths) ? application.document_paths.length : 0} attached</dd>
                      </div>
                    </dl>
                  </details>
                </div>
                {status !== "approved" ? (
                  <form
                    className="admin-approval-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      void run(`approve-${id}`, () =>
                        requestJson(`/api/admin/campaign-applications/${id}/approve`, "POST", {
                          slug: form.get("slug"),
                          shortTitle: form.get("shortTitle"),
                        }),
                      );
                    }}
                  >
                    <input name="shortTitle" defaultValue={title.slice(0, 70)} aria-label="Short campaign title" required />
                    <input name="slug" defaultValue={normalizeCampaignSlug(title)} aria-label="Campaign URL slug" required />
                    <textarea name="notes" aria-label="Reviewer notes" placeholder="Reviewer notes (optional)" maxLength={1000} />
                    <button className="button" disabled={Boolean(busy)}>Approve & publish</button>
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={Boolean(busy)}
                      onClick={(event) => {
                        const form = event.currentTarget.form;
                        const notes = form ? new FormData(form).get("notes") : "";
                        void run(`info-${id}`, () =>
                          requestJson(`/api/admin/campaign-applications/${id}/status`, "PATCH", {
                            status: "needs_info",
                            notes,
                          }),
                        );
                      }}
                    >
                      Needs information
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={Boolean(busy)}
                      onClick={(event) => {
                        const form = event.currentTarget.form;
                        const notes = form ? new FormData(form).get("notes") : "";
                        void run(`decline-${id}`, () =>
                          requestJson(`/api/admin/campaign-applications/${id}/status`, "PATCH", {
                            status: "declined",
                            notes,
                          }),
                        );
                      }}
                    >
                      Decline
                    </button>
                  </form>
                ) : null}
              </article>
            );
          })}
          {!data.applications.length ? <p className="admin-empty">No campaign applications yet.</p> : null}
        </div>
      </section>

      <section id="campaigns" className="admin-section">
        <div className="admin-section-heading"><div><span className="eyebrow">Published</span><h2>Campaigns</h2></div><strong>{data.campaigns.length}</strong></div>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr><th>Campaign</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>{data.campaigns.map((campaign) => (
              <tr key={text(campaign.id)}>
                <td><strong>{text(campaign.title)}</strong><small>/{text(campaign.slug)}</small></td>
                <td>{money(campaign.raised_amount)} / {money(campaign.goal_amount)}</td>
                <td>
                  <select
                    value={text(campaign.status)}
                    disabled={Boolean(busy)}
                    onChange={(event) => void run(`campaign-${text(campaign.id)}`, () =>
                      requestJson(`/api/admin/campaigns/${text(campaign.id)}/status`, "PATCH", { status: event.target.value }),
                    )}
                  >
                    {["active", "funded", "completed", "paused"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section id="gallery" className="admin-section">
        <div className="admin-section-heading">
          <div><span className="eyebrow">Media library</span><h2>Gallery</h2></div>
          <strong>{data.galleryItems.length}</strong>
        </div>
        <form
          className="admin-gallery-upload"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            void (async () => {
              const uploaded = await run("gallery-upload", () =>
                requestForm("/api/admin/gallery", formData),
              );
              if (uploaded) form.reset();
            })();
          }}
        >
          <label>
            <span>Photo</span>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required
            />
          </label>
          <label>
            <span>Accessible description</span>
            <input
              name="altText"
              placeholder="Who or what is shown in the photo?"
              minLength={3}
              maxLength={180}
              required
            />
          </label>
          <label>
            <span>Category</span>
            <select name="category" defaultValue="general">
              <option value="general">General</option>
              <option value="campaigns">Campaigns</option>
              <option value="mavericks">Mavericks</option>
              <option value="events">Events</option>
              <option value="mxm">MxM</option>
            </select>
          </label>
          <button className="button" disabled={busy === "gallery-upload"}>
            {busy === "gallery-upload" ? "Uploading…" : "Upload & publish"}
          </button>
        </form>
        <div className="admin-gallery-list">
          {data.galleryItems.map((item) => {
            const id = text(item.id);
            const status = text(item.status);
            return (
              <article className="admin-gallery-item" key={id}>
                <div className="admin-gallery-thumb">
                  <Image
                    src={text(item.image_url)}
                    alt={text(item.alt_text)}
                    fill
                    sizes="96px"
                  />
                </div>
                <div>
                  <strong>{text(item.alt_text)}</strong>
                  <small>{text(item.category)} · {status}</small>
                </div>
                <select
                  aria-label={`Visibility for ${text(item.alt_text)}`}
                  value={status}
                  disabled={Boolean(busy)}
                  onChange={(event) => void run(`gallery-${id}`, () =>
                    requestJson(`/api/admin/gallery/${id}/status`, "PATCH", {
                      status: event.target.value,
                    }),
                  )}
                >
                  <option value="active">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </article>
            );
          })}
          {!data.galleryItems.length ? (
            <p className="admin-empty">No administrator uploads yet.</p>
          ) : null}
        </div>
      </section>

      <section id="users" className="admin-section">
        <div className="admin-section-heading"><div><span className="eyebrow">Accounts</span><h2>Users</h2></div><strong>{data.profiles.length}</strong></div>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr><th>User</th><th>Contact</th><th>Role</th></tr></thead>
            <tbody>{data.profiles.map((profile) => (
              <tr key={text(profile.id)}>
                <td><strong>{text(profile.full_name)}</strong><small>{text(profile.email)}</small></td>
                <td>{text(profile.phone)}</td>
                <td>
                  <select
                    value={text(profile.role)}
                    disabled={Boolean(busy)}
                    onChange={(event) => void run(`profile-${text(profile.id)}`, () =>
                      requestJson(`/api/admin/profiles/${text(profile.id)}/role`, "PATCH", { role: event.target.value }),
                    )}
                  >
                    {["donor", "organizer", "maverick", "admin"].map((role) => <option key={role}>{role}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <AdminDataTable title="Donations" eyebrow="Giving" rows={data.donations} fields={["campaign_slug", "donor_name", "total_amount", "status"]} />
      <AdminDataTable title="Pledges" eyebrow="Follow-up" rows={data.pledges} fields={["campaign_slug", "name", "email", "amount", "status"]} />
      <AdminDataTable title="Subscribers" eyebrow="Audience" rows={data.subscriptions} fields={["email", "status", "source", "created_at"]} />
      <AdminDataTable title="Form submissions" eyebrow="Inbox" rows={data.submissions} fields={["submission_type", "created_at", "payload"]} />
    </div>
  );
}

function AdminDataTable({
  title,
  eyebrow,
  rows,
  fields,
}: {
  title: string;
  eyebrow: string;
  rows: Record<string, unknown>[];
  fields: string[];
}) {
  const sectionId = title.toLowerCase().replaceAll(" ", "-");
  return (
    <section className="admin-section" id={sectionId}>
      <div className="admin-section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><strong>{rows.length}</strong></div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{fields.map((field) => <th key={field}>{field.replaceAll("_", " ")}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => (
            <tr key={text(row.id ?? index)}>{fields.map((field) => (
              <td key={field}>{field === "payload" ? JSON.stringify(row[field]) : text(row[field])}</td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
