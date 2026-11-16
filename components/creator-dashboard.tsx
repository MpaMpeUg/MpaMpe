"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { useToast } from "@/components/toast-provider";
import { CreatorInsights } from "@/components/creator-insights";
import { readAdminResponse } from "@/lib/admin-http";
import {
  summarizeCreatorDashboard,
  type CreatorCampaign,
  type CreatorDashboardData,
} from "@/lib/creator-dashboard";
import { campaignProgress, formatDate, formatMoney } from "@/lib/format";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type ActionResult = { message?: string };

async function requestJson(
  url: string,
  method: "PATCH" | "POST" | "DELETE",
  body?: unknown,
) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return readAdminResponse(response);
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ").replaceAll("-", " ");
}

export function CreatorDashboard({ data }: { data: CreatorDashboardData }) {
  const router = useRouter();
  const toast = useToast();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [busy, setBusy] = useState("");
  const [, startTransition] = useTransition();
  const summary = useMemo(() => summarizeCreatorDashboard(data), [data]);
  const allBackers = useMemo(
    () =>
      data.campaigns
        .flatMap((campaign) =>
          campaign.backers.map((backer) => ({
            ...backer,
            campaign: campaign.shortTitle,
          })),
        )
        .toSorted((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 100),
    [data.campaigns],
  );

  async function run(key: string, action: () => Promise<ActionResult>) {
    if (busy) return false;
    setBusy(key);
    try {
      const result = await action();
      toast({
        title: "Saved",
        message: result.message,
        tone: "success",
      });
      startTransition(() => router.refresh());
      return true;
    } catch (error) {
      toast({
        title: "Action not completed",
        message: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
      return false;
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="creator-dashboard-shell">
      <aside className="dashboard-nav creator-dashboard-nav">
        <span className="eyebrow">Your account</span>
        <h2>{data.profile.fullName}</h2>
        <p>{data.profile.email}</p>
        <span className="creator-role">{statusLabel(data.profile.role)}</span>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#insights">Insights</a></li>
          <li><a href="#applications">Applications</a></li>
          <li><a href="#campaigns">Campaigns</a></li>
          <li><a href="#supporters">Supporters</a></li>
          <li><Link href="/settings">Settings</Link></li>
          {data.profile.role === "admin" ? <li><Link href="/admin">Admin portal</Link></li> : null}
        </ul>
        <button
          className="button button-secondary button-full"
          type="button"
          disabled={busy === "sign-out"}
          onClick={() => {
            if (!supabase) {
              toast({
                title: "Sign out unavailable",
                message: "Supabase is not configured in this environment.",
                tone: "error",
              });
              return;
            }
            setBusy("sign-out");
            void supabase.auth.signOut().then(({ error }) => {
              if (error) {
                toast({ title: "Sign out failed", message: error.message, tone: "error" });
                setBusy("");
                return;
              }
              router.push("/dashboard");
              router.refresh();
            });
          }}
        >
          {busy === "sign-out" ? "Signing out…" : "Sign out"}
        </button>
      </aside>

      <div className="creator-dashboard-main">
        <section className="creator-dashboard-welcome" id="overview">
          <div>
            <span className="eyebrow">Creator dashboard</span>
            <h1>Welcome back, {data.profile.fullName.split(" ")[0]}.</h1>
            <p>Review applications, track campaign progress and keep supporters informed.</p>
          </div>
          <Link className="button" href="/start">Start another campaign</Link>
        </section>

        <section className="creator-stat-grid" aria-label="Campaign overview">
          <div><strong>{summary.applicationCount}</strong><span>Applications</span></div>
          <div><strong>{summary.campaignCount}</strong><span>Campaigns</span></div>
          <div><strong>{formatMoney(data.insights.campaigns.reduce((total, campaign) => total + campaign.amount, 0))}</strong><span>Confirmed giving</span></div>
          <div><strong>{data.insights.confirmedGiftCount}</strong><span>Supporters</span></div>
        </section>

        <CreatorInsights insights={data.insights} supporters={allBackers} />

        <section className="creator-settlement-card" aria-labelledby="settlement-title">
          <div>
            <span className="eyebrow">Settlement</span>
            <h2 id="settlement-title">MpaMpe merchant account</h2>
            <p>Confirmed gifts settle to MpaMpe. Organizer payouts will be enabled when the Mobile Money provider is connected.</p>
          </div>
          <span className="status status-under-review">Provider setup pending</span>
        </section>

        <section className="creator-dashboard-section" id="applications">
          <div className="creator-section-heading">
            <div><span className="eyebrow">Review pipeline</span><h2>Applications</h2></div>
            <strong>{data.applications.length}</strong>
          </div>
          <div className="creator-application-grid">
            {data.applications.map((application) => (
              <article className="creator-application-card" key={application.id}>
                <div className="creator-card-topline">
                  <span className={`status status-${application.status.replaceAll("_", "-")}`}>
                    {statusLabel(application.status)}
                  </span>
                  <time dateTime={application.createdAt}>{formatDate(application.createdAt)}</time>
                </div>
                <h3>{application.title}</h3>
                <p>{application.category} · {application.location}</p>
                <strong>{formatMoney(application.goalAmount)} goal</strong>
                {application.reviewerNotes ? (
                  <div className="creator-review-note">
                    <span>Reviewer note</span>
                    <p>{application.reviewerNotes}</p>
                  </div>
                ) : null}
                {application.documents.length ? (
                  <div className="creator-documents">
                    <span>Submitted documents</span>
                    {application.documents.map((document) => (
                      <a key={document.url} href={document.url} target="_blank" rel="noreferrer">
                        {document.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
            {!data.applications.length ? (
              <div className="creator-empty">
                <h3>No applications yet</h3>
                <p>Submit a campaign for MpaMpe review.</p>
                <Link className="button" href="/start">Start a campaign</Link>
              </div>
            ) : null}
          </div>
        </section>

        <section className="creator-dashboard-section" id="campaigns">
          <div className="creator-section-heading">
            <div><span className="eyebrow">Campaign management</span><h2>Campaigns</h2></div>
            <strong>{data.campaigns.length}</strong>
          </div>
          <div className="creator-campaign-list">
            {data.campaigns.map((campaign) => (
              <CreatorCampaignCard
                key={campaign.id}
                campaign={campaign}
                busy={busy}
                run={run}
              />
            ))}
            {!data.campaigns.length ? (
              <div className="creator-empty">
                <h3>No published campaigns yet</h3>
                <p>Approved applications will appear here automatically.</p>
              </div>
            ) : null}
          </div>
        </section>

      </div>
    </div>
  );
}

function CreatorCampaignCard({
  campaign,
  busy,
  run,
}: {
  campaign: CreatorCampaign;
  busy: string;
  run: (key: string, action: () => Promise<ActionResult>) => Promise<boolean>;
}) {
  const toast = useToast();
  const progress = campaignProgress(campaign.raisedAmount, campaign.goalAmount);
  const canChangeVisibility = campaign.verified
    && ["active", "funded", "completed", "paused"].includes(campaign.status);

  function toggleVisibility() {
    const visibility = campaign.visibility === "private" ? "public" : "private";
    void run(`visibility-${campaign.id}`, () =>
      requestJson(`/api/organizer/campaigns/${campaign.id}/visibility`, "PATCH", {
        visibility,
      }),
    );
  }

  async function copyPrivateLink() {
    if (!campaign.shareToken) return;
    const url = `${window.location.origin}/campaigns/${campaign.slug}?access=${campaign.shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Private link copied", message: "Only people with this link can open the campaign.", tone: "success" });
    } catch {
      toast({ title: "Link not copied", message: "Copy the campaign link from your browser instead.", tone: "error" });
    }
  }

  function saveCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const story = String(form.get("story") || "")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    void run(`campaign-${campaign.id}`, () =>
      requestJson(`/api/organizer/campaigns/${campaign.id}`, "PATCH", {
        title: form.get("title"),
        shortTitle: form.get("shortTitle"),
        summary: form.get("summary"),
        story,
        location: form.get("location"),
        endDate: form.get("endDate") || null,
      }),
    );
  }

  function publishUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    void run(`update-${campaign.id}`, () =>
      requestJson(`/api/organizer/campaigns/${campaign.id}/updates`, "POST", {
        title: form.get("updateTitle"),
        body: form.get("updateBody"),
      }),
    ).then((saved) => {
      if (saved) formElement.reset();
    });
  }

  return (
    <article className="creator-campaign-card">
      <div className="creator-campaign-summary">
        <div className="creator-card-topline">
          <span className={`status status-${campaign.status.replaceAll("_", "-")}`}>
            {statusLabel(campaign.status)}
          </span>
          <Link href={`/campaigns/${campaign.slug}`}>View campaign</Link>
        </div>
        <h3>{campaign.title}</h3>
        <div className="campaign-total-row">
          <strong>{formatMoney(campaign.raisedAmount)}</strong>
          <span>{progress}% of {formatMoney(campaign.goalAmount)}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>{campaign.supporterCount} confirmed supporters</p>
      </div>

      <section className={`campaign-visibility-panel campaign-visibility-${campaign.visibility}`} aria-label="Campaign visibility">
        <div className="campaign-visibility-copy">
          <span className="eyebrow">Campaign access</span>
          <h4>{campaign.visibility === "private" ? "Private campaign" : "Public campaign"}</h4>
          <p>
            {campaign.visibility === "private"
              ? "Hidden from discovery. People can open and support it using the private link."
              : "Visible in campaign discovery and available through its normal link."}
          </p>
        </div>
        <div className="campaign-visibility-actions">
          <button
            className="campaign-visibility-switch"
            type="button"
            role="switch"
            aria-checked={campaign.visibility === "public"}
            aria-label="Make campaign public"
            disabled={!canChangeVisibility || Boolean(busy)}
            onClick={toggleVisibility}
          >
            <span />
          </button>
          <strong>{campaign.visibility === "public" ? "Public" : "Private"}</strong>
          {campaign.visibility === "private" && campaign.shareToken ? (
            <button className="button button-secondary campaign-copy-link" type="button" disabled={Boolean(busy)} onClick={() => void copyPrivateLink()}>
              Copy private link
            </button>
          ) : null}
        </div>
        {!canChangeVisibility ? <p className="campaign-visibility-note">Visibility controls unlock after MpaMpe approves the campaign.</p> : null}
      </section>

      <details className="creator-editor">
        <summary>Edit campaign details</summary>
        <form onSubmit={saveCampaign}>
          <label>Campaign title<input name="title" defaultValue={campaign.title} minLength={8} maxLength={160} required /></label>
          <label>Short title<input name="shortTitle" defaultValue={campaign.shortTitle} minLength={3} maxLength={120} required /></label>
          <label>Location<input name="location" defaultValue={campaign.location} minLength={2} maxLength={120} required /></label>
          <label>End date<input name="endDate" type="date" defaultValue={campaign.endDate || ""} /></label>
          <label className="creator-wide-field">Summary<textarea name="summary" defaultValue={campaign.summary} minLength={80} maxLength={3000} required /></label>
          <label className="creator-wide-field">Story<textarea name="story" defaultValue={campaign.story.join("\n\n")} placeholder="Separate paragraphs with a blank line" /></label>
          <button className="button" disabled={Boolean(busy)}>
            {busy === `campaign-${campaign.id}` ? "Saving…" : "Save campaign details"}
          </button>
        </form>
      </details>

      <div className="creator-updates-panel">
        <div className="creator-updates-heading">
          <div><span className="eyebrow">Supporter communication</span><h3>Campaign updates</h3></div>
          <p>Share milestones, mid-campaign reports, important changes or outcomes.</p>
        </div>
        <form onSubmit={publishUpdate}>
          <label>Update title<input name="updateTitle" minLength={5} maxLength={160} placeholder="Example: Mid-campaign progress report" required /></label>
          <label>Message<textarea name="updateBody" minLength={20} maxLength={5000} placeholder="Explain what has changed, what was achieved and what supporters should know next." required /></label>
          <button className="button button-secondary" disabled={Boolean(busy)}>
            {busy === `update-${campaign.id}` ? "Publishing…" : "Publish update"}
          </button>
        </form>
        <div className="creator-update-list">
          {campaign.updates.map((update) => (
            <article key={update.id}>
              <div><time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time><h4>{update.title}</h4></div>
              <p>{update.body}</p>
              <button
                className="text-button"
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void run(`delete-update-${update.id}`, () =>
                  requestJson(`/api/organizer/campaign-updates/${update.id}`, "DELETE"),
                )}
              >
                Remove
              </button>
            </article>
          ))}
          {!campaign.updates.length ? <p className="creator-empty-copy">No campaign updates yet.</p> : null}
        </div>
      </div>
    </article>
  );
}
