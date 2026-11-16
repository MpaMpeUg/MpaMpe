"use client";

import { BarChart3, Download, EyeOff, HandCoins, TrendingUp, UsersRound } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  calculateGrowthPercent,
  normalizeInsightBars,
  type CreatorBacker,
  type CreatorDashboardInsights,
} from "@/lib/creator-dashboard";
import { campaignProgress, formatDate, formatMoney } from "@/lib/format";

type SupporterRow = CreatorBacker & { campaign: string };

function csvCell(value: string | number) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function CreatorInsights({
  insights,
  supporters,
}: {
  insights: CreatorDashboardInsights;
  supporters: SupporterRow[];
}) {
  const bars = useMemo(() => normalizeInsightBars(insights.monthly), [insights.monthly]);
  const growth = calculateGrowthPercent(insights.last30Days, insights.previous30Days);
  const anonymousShare = insights.confirmedGiftCount
    ? Math.round((insights.anonymousGiftCount / insights.confirmedGiftCount) * 100)
    : 0;

  function downloadSupporters() {
    const rows = [
      ["Supporter", "Campaign", "Amount", "Currency", "Date"],
      ...supporters.map((supporter) => [
        supporter.displayName,
        supporter.campaign,
        supporter.amount,
        supporter.currency,
        supporter.createdAt,
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `mpampe-supporters-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="creator-dashboard-section creator-insights-section" id="insights">
        <div className="creator-section-heading">
          <div><span className="eyebrow">Performance</span><h2>Insights</h2></div>
          <span className="creator-live-label"><i /> Confirmed gifts</span>
        </div>

        <div className="creator-insight-kpis">
          <article><HandCoins aria-hidden="true" /><span>Average gift</span><strong>{formatMoney(insights.averageGift)}</strong></article>
          <article><TrendingUp aria-hidden="true" /><span>Last 30 days</span><strong>{formatMoney(insights.last30Days)}</strong><small>{growth === null ? "New activity" : `${growth >= 0 ? "+" : ""}${growth}% vs previous 30 days`}</small></article>
          <article><UsersRound aria-hidden="true" /><span>Confirmed gifts</span><strong>{insights.confirmedGiftCount}</strong></article>
          <article><EyeOff aria-hidden="true" /><span>Anonymous gifts</span><strong>{anonymousShare}%</strong><small>{insights.anonymousGiftCount} gifts</small></article>
        </div>

        <div className="creator-visual-grid">
          <article className="creator-visual-card">
            <div className="creator-visual-heading"><div><span>Giving over time</span><h3>Last six months</h3></div><BarChart3 aria-hidden="true" /></div>
            <div className="creator-bar-chart" role="img" aria-label="Confirmed giving by month for the last six months">
              {bars.map((bar) => (
                <div className="creator-bar-column" key={bar.month} aria-label={`${bar.label}: ${formatMoney(bar.amount)} from ${bar.supporters} supporters`}>
                  <div className="creator-bar-track"><span style={{ height: `${Math.max(bar.height, bar.amount ? 8 : 2)}%` }} /></div>
                  <strong>{bar.label}</strong>
                  <small>{bar.amount ? formatMoney(bar.amount).replace("UGX", "").trim() : "0"}</small>
                </div>
              ))}
            </div>
            {!bars.some((bar) => bar.amount) ? <p className="creator-chart-empty">Monthly activity will appear after the first confirmed gift.</p> : null}
          </article>

          <article className="creator-visual-card">
            <div className="creator-visual-heading"><div><span>Campaign performance</span><h3>Progress by campaign</h3></div><UsersRound aria-hidden="true" /></div>
            <div className="creator-performance-list">
              {insights.campaigns.map((campaign) => {
                const progress = campaignProgress(campaign.amount, campaign.goalAmount);
                return (
                  <div key={campaign.campaignId}>
                    <div><Link href={`/campaigns/${campaign.slug}`}>{campaign.title}</Link><strong>{progress}%</strong></div>
                    <div className="progress-track" role="progressbar" aria-label={`${campaign.title} progress`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
                    <p>{formatMoney(campaign.amount)} · {campaign.supporters} supporters</p>
                  </div>
                );
              })}
              {!insights.campaigns.length ? <p className="creator-empty-copy">Campaign comparisons will appear after a campaign is approved.</p> : null}
            </div>
          </article>
        </div>
      </section>

      <section className="creator-dashboard-section" id="supporters">
        <div className="creator-section-heading">
          <div><span className="eyebrow">Community</span><h2>Supporters</h2></div>
          <button className="button button-secondary creator-export-button" type="button" onClick={downloadSupporters} disabled={!supporters.length}>
            <Download aria-hidden="true" /> Download CSV
          </button>
        </div>
        <p className="creator-section-intro">Recent confirmed backers across your campaigns. Anonymous gifts remain anonymous.</p>
        {supporters.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Recent confirmed campaign supporters</caption>
              <thead><tr><th>Backer</th><th>Campaign</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {supporters.map((supporter) => (
                  <tr key={supporter.id}>
                    <td>{supporter.displayName}</td>
                    <td>{supporter.campaign}</td>
                    <td>{formatMoney(supporter.amount)}</td>
                    <td>{formatDate(supporter.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="creator-empty-copy">Confirmed supporters will appear here.</p>}
      </section>
    </>
  );
}
