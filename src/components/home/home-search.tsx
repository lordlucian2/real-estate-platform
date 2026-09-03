"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import { locations } from "@/lib/locations";
import { cn } from "@/lib/utils";

const listingOptions = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
];

const needOptions = [
  { value: "room", label: "Room" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "compound", label: "Compound" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
  { value: "land", label: "Land" },
  { value: "short-term", label: "Short Stay" },
];

const budgetOptions = [
  { value: "", label: "Any budget" },
  { value: "150", label: "Up to $150/mo" },
  { value: "300", label: "Up to $300/mo" },
  { value: "500", label: "Up to $500/mo" },
  { value: "800", label: "Up to $800/mo" },
  { value: "1200", label: "Up to $1,200/mo" },
  { value: "2000", label: "Up to $2,000/mo" },
];

export function HomeSearch({ tone = "light" }: { tone?: "light" | "dark" }) {
  const router = useRouter();
  const [listing, setListing] = useState("rent");
  const [need, setNeed] = useState("house");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listing) params.set("listing", listing);
    if (need) params.set("need", need);
    if (location) params.set("location", location);
    if (budget) params.set("budget", budget);
    if (bedrooms) params.set("bedrooms", bedrooms);
    router.push(`/find?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-3xl p-5 sm:p-7 shadow-2xl",
        tone === "light"
          ? "border border-ink-900/5 bg-white"
          : "border border-white/10 bg-navy-850/90 backdrop-blur",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className={cn(
            "font-display text-xl font-semibold",
            tone === "light" ? "text-navy-900" : "text-cream-50",
          )}
        >
          What are you looking for?
        </p>
        <span className="gold-rule w-16" aria-hidden />
      </div>

      {/* Rent / Buy */}
      <div className="mt-5 inline-flex w-full rounded-full border border-ink-900/10 bg-cream-100 p-1 sm:w-fit">
        {listingOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setListing(o.value)}
            className={cn(
              "flex-1 rounded-full px-6 py-2.5 text-sm font-semibold transition-all sm:flex-none",
              listing === o.value
                ? "bg-navy-900 text-cream-50 shadow-md shadow-navy-900/20"
                : "text-ink-500 hover:text-navy-900",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Need type */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {needOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setNeed(o.value)}
            className={cn(
              "rounded-full border px-4.5 py-2.5 text-[13px] font-medium transition-all",
              need === o.value
                ? "border-gold-500 bg-gold-500 text-navy-900 font-semibold shadow-sm shadow-gold-500/30"
                : tone === "dark"
                  ? "border-white/15 bg-white/5 text-cream-50/80 hover:border-gold-400/60 hover:bg-white/10 hover:text-cream-50"
                  : "border-ink-900/10 bg-white text-ink-700 hover:border-gold-400 hover:text-gold-700",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="relative block">
          <span className="sr-only">Preferred location</span>
          <ChevronsUpDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={cn(
              "w-full appearance-none rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors focus:border-gold-500",
              tone === "dark"
                ? "border-white/10 bg-white/5 text-cream-50 focus:bg-white/10"
                : "border-ink-900/10 bg-white text-ink-700",
            )}
          >
            <option value="">Any location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>

        <label className="relative block">
          <span className="sr-only">Budget</span>
          <ChevronsUpDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={cn(
              "w-full appearance-none rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors focus:border-gold-500",
              tone === "dark"
                ? "border-white/10 bg-white/5 text-cream-50 focus:bg-white/10"
                : "border-ink-900/10 bg-white text-ink-700",
            )}
          >
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="relative block">
          <span className="sr-only">Bedrooms</span>
          <ChevronsUpDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={cn(
              "w-full appearance-none rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors focus:border-gold-500",
              tone === "dark"
                ? "border-white/10 bg-white/5 text-cream-50 focus:bg-white/10"
                : "border-ink-900/10 bg-white text-ink-700",
            )}
          >
            <option value="">Any bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-base font-bold text-navy-900 shadow-lg shadow-gold-500/25 transition-all hover:bg-gold-400 active:scale-[0.99]"
      >
        <Search size={18} strokeWidth={2.4} />
        Help Me Find It
      </button>
      <p className="mt-3 text-center text-xs text-ink-400">
        No scrolling through hundreds of listings — tell me what you need and I&apos;ll do the searching.
      </p>
    </form>
  );
}