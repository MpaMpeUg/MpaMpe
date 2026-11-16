"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CampaignCard } from "@/components/campaign-card";
import type { Campaign } from "@/lib/types";

type SortOption = "featured" | "newest" | "most-funded" | "closest";

export function CampaignExplorer({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All campaigns");
  const [sort, setSort] = useState<SortOption>("featured");
  const categories = [
    "All campaigns",
    ...new Set(campaigns.map((campaign) => campaign.category)),
  ];

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return campaigns
      .filter((campaign) => {
        const matchesCategory =
          category === "All campaigns" || campaign.category === category;
        const matchesQuery =
          !normalized ||
          [
            campaign.title,
            campaign.summary,
            campaign.category,
            campaign.location,
            campaign.organizer,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "most-funded") return b.raised - a.raised;
        if (sort === "closest") {
          return b.raised / b.goal - a.raised / a.goal;
        }
        if (sort === "newest") {
          return (b.endDate || "").localeCompare(a.endDate || "");
        }
        return Number(b.featured) - Number(a.featured);
      });
  }, [campaigns, category, query, sort]);

  return (
    <>
      <div className="explorer-tools">
        <label className="search-field">
          <span className="sr-only">Search campaigns</span>
          <Search />
          <input
            type="search"
            placeholder="Search campaigns, categories or locations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="sort-field">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="most-funded">Most funded</option>
            <option value="closest">Closest to goal</option>
          </select>
        </label>
      </div>
      <div className="filter-bar" aria-label="Campaign categories">
        {categories.map((item) => (
          <button
            className={`filter-pill ${category === item ? "active" : ""}`}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="campaign-grid">
          {visible.map((campaign, index) => (
            <CampaignCard campaign={campaign} key={campaign.id} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="info-card">
          <h3>No campaigns match those filters.</h3>
          <p>Try another category or a broader search term.</p>
        </div>
      )}
    </>
  );
}
