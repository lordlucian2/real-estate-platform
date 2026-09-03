import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Landmark, MapPin } from "lucide-react";
import { getLocation, locations } from "@/lib/locations";
import { getAllProperties } from "@/lib/store";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading, Button } from "@/components/ui";
import { listingLabels } from "@/lib/data";
import type { ListingType, PropertyType } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: "Location not found" };
  return {
    title: `Properties in ${loc.name}, Liberia — Houses, Rooms, Apartments & Land`,
    description: `Browse available properties in ${loc.name}, Liberia — houses for rent, apartments, rooms, land and commercial spaces, personally verified by a local property agent.`,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const allProps = await getAllProperties();
  const props = allProps.filter(
    (p) => p.availabilityStatus === "available" && p.locationId === loc.id,
  );

  // Average price per category — only computed from actual listings, never invented.
  const prices = props.map((p) => p.price).sort((a, b) => a - b);
  const avg =
    prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;

  const byType = new Map<PropertyType, number>();
  props.forEach((p) => byType.set(p.type, (byType.get(p.type) ?? 0) + 1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: loc.name,
    description: loc.intro,
    address: { "@type": "PostalAddress", addressLocality: loc.name, addressCountry: "LR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm font-medium text-cream-50/60 hover:text-gold-300">
            <ArrowLeft size={15} /> All properties
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300">
              <MapPin size={26} />
            </span>
            <div>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
                Properties in {loc.name}
              </h1>
              <p className="text-sm text-cream-50/60">
                {loc.type === "city" ? "Capital district of Liberia" : loc.type === "town" ? "Suburb of Greater Monrovia" : "Neighborhood of Monrovia"}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl leading-relaxed text-cream-50/70">{loc.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/5 px-4 py-2 font-medium text-cream-50/80">
              {props.length} live listing{props.length === 1 ? "" : "s"}
            </span>
            {avg ? (
              <span className="rounded-full bg-gold-500/15 px-4 py-2 font-semibold text-gold-200">
                Avg listing price here: ${avg.toLocaleString()}
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
              Nothing publicly listed in {loc.name} right now
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
              Off-market options often exist. Send your requirement and I&apos;ll
              search {loc.name} and the surrounding areas for you.
            </p>
            <Button href="/find" size="lg" className="mt-6">
              Request Properties in {loc.name}
            </Button>
          </div>
        )}
      </section>

      {/* Market snapshot + landmarks + categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">Available by</h3>
            <ul className="mt-4 space-y-3">
              {(["rent", "buy"] as const).map((l) => {
                const count = props.filter((p) => p.listingType === l).length;
                return (
                  <li key={l} className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">{listingLabels[l as ListingType]}</span>
                    <span className="font-semibold text-navy-900">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">Property types</h3>
            <ul className="mt-4 space-y-3">
              {[...byType.entries()].map(([type, count]) => (
                <li key={type} className="flex items-center justify-between text-sm capitalize">
                  <span className="text-ink-700">{type.replace("-", " ")}</span>
                  <span className="font-semibold text-navy-900">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-gold-600">
              <Landmark size={14} /> Nearby landmarks
            </h3>
            <ul className="mt-4 space-y-2.5">
              {loc.landmarks.map((l) => (
                <li key={l} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Other locations */}
      <section className="border-t border-ink-900/5 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading align="left" title={`Explore other areas`} />
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {locations
              .filter((l) => l.id !== loc.id)
              .map((l) => {
                const count = allProps.filter((p) => p.locationId === l.id && p.availabilityStatus === "available").length;
                return (
                  <Link
                    key={l.id}
                    href={`/locations/${l.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-ink-900/5 px-4 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-700"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold-600" /> {l.name}
                    </span>
                    <span className="text-xs text-ink-400">{count}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}
export const dynamic = "force-dynamic";
