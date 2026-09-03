import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ListingType, Property } from "@/lib/types";
import { propertyTypeMap } from "@/lib/data";
import { getAllProperties } from "@/lib/store";
import { getLocation, locations } from "@/lib/locations";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading, Button } from "@/components/ui";


export async function TypeListing({
  listingType,
  types,
  title,
  locationSlug,
}: {
  listingType: ListingType;
  types: Property["type"][];
  title: string;
  locationSlug?: string;
}) {
  const priceLabel = listingType === "buy" ? "list price" : "monthly rent";

  let props = (await getAllProperties()).filter(
    (p) => p.availabilityStatus === "available" && p.listingType === listingType && types.includes(p.type),
  );

  const location = locationSlug ? await getLocation(locationSlug) : undefined;
  if (location) props = props.filter((p) => p.locationId === location.id);

  const prices = props
    .map((p) => (listingType === "buy" ? p.price : p.price))
    .sort((a, b) => a - b);
  const hasRange = prices.length >= 2;
  const range =
    hasRange && prices[0] !== prices[prices.length - 1]
      ? `$${prices[0].toLocaleString()} – $${prices[prices.length - 1].toLocaleString()}`
      : prices.length > 0
        ? `$${prices[0].toLocaleString()}`
        : null;

  const totalForLocation = (await getAllProperties())
    .filter(
      (p) => p.availabilityStatus === "available" && p.locationId === (location?.id ?? ""),
    ).length;

  return (
    <>
      <section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            {listingType === "buy" ? "For sale" : "For rent"}
            {location ? ` · ${location.name}` : " · Liberia"}
          </p>
          <SectionHeading
            align="left"
            tone="dark"
            title={title}
            subtitle={
              location ? (
                <>
                  {location.intro} Currently {props.length} matching option{props.length === 1 ? "" : "s"} here.
                </>
              ) : (
                <>
                  A focused selection of {title.toLowerCase()} across Greater
                  Monrovia — each one verified and available.
                </>
              )
            }
          />
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2 font-medium text-cream-50/80">
              {props.length} available
            </span>
            {range ? (
              <span className="rounded-full bg-gold-400/15 px-4 py-2 font-semibold text-gold-200">
                ${priceLabel} range: {range}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {props.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
            <p className="font-display text-2xl font-semibold text-navy-900">
              {location ? `Nothing available in ${location.name} right now` : "Nothing available right now"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
              The market moves fast — but I often have off-market options.
              Tell me what you need and I&apos;ll search for you.
            </p>
            <Button href="/find" size="lg" className="mt-6">
              Tell Me What You Need
            </Button>
          </div>
        )}

        {/* Nearby locations */}
        {!location ? (
          <section className="mt-14">
            <h3 className="font-display text-xl font-semibold text-navy-900">
              Browse by area
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {locations.map((l) => {
                const n = props.filter(
                  (p) =>
                    p.availabilityStatus === "available" &&
                    p.listingType === listingType &&
                    types.includes(p.type) &&
                    p.locationId === l.id,
                ).length;
                return (
                  <Link
                    key={l.id}
                    href={`/${listingType === "buy" ? "buy" : "rent"}/${primaryTypeSegment(types[0])}/${l.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-ink-900/5 bg-white px-4 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-700"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold-600" /> {l.name}
                    </span>
                    <span className="text-xs text-ink-400">{n}</span>
                  </Link>
                );
              })}
            </div>
            {locationSlug ? null : null}
          </section>
        ) : (
          <section className="mt-14 rounded-2xl border border-ink-900/5 bg-cream-50 p-6">
            <p className="text-sm text-ink-500">
              <strong className="text-navy-900">Looking beyond {location.name}?</strong>{" "}
              I match clients across Greater Monrovia and often hold off-market
              options in other neighborhoods.
            </p>
            {totalForLocation > 0 ? (
              <Link
                href={`/locations/${locationSlug}`}
                className="mt-3 inline-block text-sm font-semibold text-gold-700 hover:underline"
              >
                See everything available in {location.name} →
              </Link>
            ) : null}
          </section>
        )}
      </section>
    </>
  );
}

function primaryTypeSegment(type: Property["type"]): string {
  return propertyTypeMap[type];
}