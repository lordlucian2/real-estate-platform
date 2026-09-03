"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ShieldCheck, X } from "lucide-react";
import type { ListingType, Property } from "@/lib/types";
import { propertyTypeOptions, listingLabels } from "@/lib/data";
import { getLocation } from "@/lib/locations";
import { PropertyCard } from "@/components/property/property-card";
import { Select, Input, Pill, Button } from "@/components/ui";

type SortKey = "recent" | "price_asc" | "price_desc" | "newest";

export function PropertyBrowser({
  properties,
  initialListing,
  initialLocation,
}: {
  properties: Property[];
  initialListing?: string;
  initialLocation?: string;
}) {
  const [query, setQuery] = useState("");
  const [listing, setListing] = useState<string>(initialListing ?? "");
  const [types, setTypes] = useState<string[]>([]);
  const [location, setLocation] = useState(initialLocation ?? "");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");

  const toggleType = (t: string) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filtered = useMemo(() => {
    const matchesBudget = (price: number, listingType: ListingType): boolean => {
      if (!budget) return true;
      const [min, max] = budget.split("-").map(Number);
      const monthly = listingType === "buy" ? price / 72 : price;
      if (!max) return monthly <= min;
      return monthly >= min && monthly <= max;
    };

    const q = query.toLowerCase().trim();
    let list = properties.filter((p) => p.availabilityStatus === "available");

    if (listing) list = list.filter((p) => p.listingType === listing);
    if (types.length) list = list.filter((p) => types.includes(p.type));
    if (location) list = list.filter((p) => p.locationId === location || getLocation(p.locationId)?.name === location);
    if (bedrooms) list = list.filter((p) => (bedrooms === "5" ? p.bedrooms >= 5 : p.bedrooms === Number(bedrooms)));
    if (verifiedOnly)
      list = list.filter((p) => p.verificationStatus === "verified" || p.verificationStatus === "recently_checked");
    if (budget) list = list.filter((p) => matchesBudget(p.price, p.listingType));
    if (q)
      list = list.filter((p) =>
        [p.title, p.address, getLocation(p.locationId)?.name ?? "", p.description]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );

    switch (sort) {
      case "recent":
        return [...list].sort((a, b) => (a.lastVerifiedAt < b.lastVerifiedAt ? 1 : -1));
      case "newest":
        return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      case "price_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...list].sort((a, b) => b.price - a.price);
    }
  }, [properties, query, listing, types, location, budget, bedrooms, verifiedOnly, sort]);

  const activeFilterCount =
    Number(Boolean(listing)) + types.length + Number(Boolean(location)) + Number(Boolean(budget)) + Number(Boolean(bedrooms)) + Number(verifiedOnly);

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-3xl border border-ink-900/5 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area, keyword…"
              className="pl-10"
            />
          </label>
          <Select value={listing} onChange={(e) => setListing(e.target.value)}>
            <option value="">Rent or Buy</option>
            <option value="rent">For Rent</option>
            <option value="buy">For Sale</option>
            <option value="short-term">Short Stay</option>
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            {["monrovia", "sinkor", "paynesville", "congo-town", "elwa", "rehab", "new-georgia", "barnesville", "brewerville"].map(
              (id) => (
                <option key={id} value={id}>
                  {getLocation(id)?.name}
                </option>
              ),
            )}
          </Select>
          <Select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">Any bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <SlidersHorizontal size={13} /> Type
          </span>
          {propertyTypeOptions.map((t) => (
            <Pill
              key={t.value}
              active={types.includes(t.value)}
              onClick={() => toggleType(t.value)}
            >
              {t.label}
            </Pill>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-900/5 pt-3">
          <Select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-auto">
            <option value="">Any budget (monthly est.)</option>
            <option value="0-150">Under $150/mo</option>
            <option value="150-350">$150 – $350/mo</option>
            <option value="350-650">$350 – $650/mo</option>
            <option value="650-1200">$650 – $1,200/mo</option>
            <option value="1200">$1,200+/mo</option>
          </Select>
          <Pill
            active={verifiedOnly}
            onClick={() => setVerifiedOnly((v) => !v)}
            className="gap-2"
          >
            <ShieldCheck size={14} /> Verified only
          </Pill>
          <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="ml-auto w-auto">
            <option value="recent">Recently verified</option>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
          </Select>
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setListing("");
                setTypes([]);
                setLocation("");
                setBudget("");
                setBedrooms("");
                setVerifiedOnly(false);
              }}
              className="flex items-center gap-1 rounded-full border border-danger/25 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
            >
              <X size={13} /> Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-500">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} available
        </p>
        <p className="hidden text-xs text-ink-400 sm:block">
          All verified · {listingLabels.rent} / {listingLabels.buy}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <p className="font-display text-2xl font-semibold text-navy-900">No exact matches right now</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
            The market moves fast. Tell me your exact requirements and I&apos;ll
            search my network for something suitable — including off-market options.
          </p>
          <Button href="/find" variant="gold" size="lg" className="mt-6">
            Tell Me What You Need
          </Button>
        </div>
      )}
    </div>
  );
}