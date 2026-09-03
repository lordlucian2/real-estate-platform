import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  Landmark,
  MapPin,
  MessageSquare,
  Phone,
  Ruler,
  Sparkles,
} from "lucide-react";
import { getPropertyBySlug, getAllProperties } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { amenityLabels, listingLabels, typeLabels, verificationLabels } from "@/lib/data";
import { formatPrice, relativeTime } from "@/lib/utils";
import { site, whatsappLink, agent } from "@/lib/site";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyCard } from "@/components/property/property-card";
import { VerificationBadge } from "@/components/property/property-card";
import { WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };

  const loc = getLocation(property.locationId);
  const title = property.seo?.title ?? `${property.title} in ${loc?.name ?? "Liberia"} — ${formatPrice(property.price, property.currency, property.listingType)}`;
  const description =
    property.seo?.description ??
    `${property.title} in ${loc?.name ?? "Liberia"}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms. ${verificationLabels[property.verificationStatus].label}. Contact a trusted Liberian property agent for this and similar options.`;

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: property.images[0] ? [{ url: property.images[0].url }] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property || property.status === "archived") notFound();

  const loc = getLocation(property.locationId);
  const related = (await getAllProperties())
    .filter((p) => p.id !== property.id && p.availabilityStatus === "available")
    .sort((a, b) => (a.lastVerifiedAt < b.lastVerifiedAt ? 1 : -1))
    .slice(0, 3);

  const askAbout = whatsappLink(
    `Hello, I am interested in the "${property.title}" in ${loc?.name ?? "Liberia"} listed on your website. Is it still available?`,
  );
  const findMe = whatsappLink(`Hello ${agent.name}, I need help finding a property. Can you assist me?`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: property.title,
    image: property.images[0]?.url,
    description: property.description,
    address: { "@type": "PostalAddress", addressLocality: loc?.name ?? "Liberia", addressCountry: "LR" },
    offers: {
      ...(property.listingType === "buy"
        ? { "@type": "Offer", price: property.price, priceCurrency: property.currency }
        : {
            "@type": "AggregateOffer",
            priceSpecification: { "@type": "UnitPriceSpecification", price: property.price, priceCurrency: property.currency },
          }),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb bar */}
      <div className="border-b border-ink-900/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-[13px] text-ink-500 no-scrollbar sm:px-6">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-gold-600">Properties</Link>
          <span>/</span>
          <Link href={`/locations/${loc?.slug ?? ""}`} className="shrink-0 hover:text-gold-600">
            {loc?.name ?? "Liberia"}
          </Link>
          <span>/</span>
          <span className="shrink-0 font-medium text-navy-900">{property.title}</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Left column */}
          <div>
            <PropertyGallery images={property.images} title={property.title} />

            {/* Header */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={property.listingType === "buy" ? "gold" : "navy"}>
                  {listingLabels[property.listingType]}
                </Badge>
                <Badge tone="cream">{typeLabels[property.type]}</Badge>
                <VerificationBadge status={property.verificationStatus} lastVerifiedAt={property.lastVerifiedAt} />
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-[15px] text-ink-500">
                <MapPin size={16} className="shrink-0 text-gold-600" />
                {property.address}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="font-display text-3xl font-bold tracking-tight text-navy-900">
                  {formatPrice(property.price, property.currency, property.listingType)}
                </p>
                <p className="text-sm text-ink-400">
                  {property.listingType === "buy" ? "price upon agreed terms" : "per month · negotiable"}
                </p>
              </div>
            </div>

            {/* Key facts */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.bedrooms > 0 ? (
                <KeyFact icon={BedDouble} label="Bedrooms" value={String(property.bedrooms)} />
              ) : null}
              {property.bathrooms > 0 ? (
                <KeyFact icon={Bath} label="Bathrooms" value={String(property.bathrooms)} />
              ) : null}
              {property.size ? (
                <KeyFact icon={Ruler} label="Size" value={`${property.size} ${property.sizeUnit ?? "m²"}`} />
              ) : null}
              <KeyFact
                icon={CalendarDays}
                label="Status"
                value={property.availabilityStatus === "available" ? "Available now" : "Unavailable"}
              />
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-navy-900">About this property</h2>
              <p className="mt-3 leading-relaxed text-ink-700">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Features</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {(property.features.length ? property.features : ["Photos and final details shared privately"]).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 ? (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-navy-900">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-700"
                    >
                      <Check size={14} className="text-success" strokeWidth={3} />
                      {amenityLabels[a] ?? a}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Rules */}
            {property.rules.length > 0 ? (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-navy-900">Rules & requirements</h2>
                <ul className="mt-4 space-y-2.5">
                  {property.rules.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Landmarks */}
            {property.landmarks.length > 0 ? (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-navy-900">Nearby</h2>
                <ul className="mt-4 space-y-2.5">
                  {property.landmarks.map((l) => (
                    <li key={l} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                      <Landmark size={16} className="mt-0.5 shrink-0 text-gold-600" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Agent notes */}
            <div className="mt-10 rounded-3xl border border-gold-500/25 bg-gold-100/40 p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-gold-600" />
                <h2 className="font-display text-xl font-semibold text-navy-900">Agent notes</h2>
              </div>
              <p className="mt-3 leading-relaxed text-ink-700">
                {property.agentNotes || "Contact me for the full details on this property."}
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
                <MapPin size={14} className="text-gold-600" />
                Verified by {agent.name} · Last checked {relativeTime(property.lastVerifiedAt)}
              </p>
            </div>
          </div>

          {/* Right column — contact card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">Contact the agent</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">{agent.name}</h3>
              <p className="text-sm text-ink-500">{agent.tagline}</p>

              <VerificationBadge
                status={property.verificationStatus}
                lastVerifiedAt={property.lastVerifiedAt}
                className="mt-4"
              />

              <div className="mt-6 space-y-3">
                <a
                  href={askAbout}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-whatsapp-dark"
                >
                  <WhatsAppIcon size={19} /> Ask About This Property
                </a>
                <a
                  href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-[15px] font-bold text-cream-50 transition-colors hover:bg-navy-800"
                >
                  <Phone size={18} /> Call Agent
                </a>
                <Link
                  href={`/properties/${property.slug}/viewing`}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-500 bg-gold-500/10 px-5 py-3.5 text-[15px] font-bold text-gold-700 transition-colors hover:bg-gold-500 hover:text-navy-900"
                >
                  <MessageSquare size={18} /> Request Viewing
                </Link>
                <a
                  href={findMe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/15 px-5 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-gold-500 hover:text-gold-700"
                >
                  Not right? Find Me a Property
                </a>
              </div>

              <div className="mt-5 space-y-2 border-t border-ink-900/5 pt-5 text-sm text-ink-500">
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {site.phoneDisplay}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} /> Serving {agent.areasServed.slice(0, 3).join(", ")}
                </p>
                <p className="text-xs text-ink-400">
                  The owner&apos;s direct number is shared only once a viewing is agreed.
                </p>
              </div>
            </div>

            {property.listingType !== "buy" ? (
              <div className="mt-4 rounded-2xl border border-ink-900/5 bg-white p-5 text-sm text-ink-500 shadow-sm">
                <p className="font-semibold text-navy-900">Like this kind of place?</p>
                <p className="mt-1">
                  Tell me what you need and I&apos;ll flag similar verified options the moment they come up.
                </p>
                <Link href="/alerts" className="mt-2 inline-block font-semibold text-gold-700 hover:underline">
                  Set a property alert →
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-ink-900/5 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <a
            href={askAbout}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-bold text-white"
          >
            <WhatsAppIcon size={17} /> Ask
          </a>
          <Link
            href={`/properties/${property.slug}/viewing`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-900 px-4 py-3 text-sm font-bold text-cream-50"
          >
            Request Viewing
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Similar properties</h2>
            <Link href="/properties" className="text-sm font-semibold text-gold-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function KeyFact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-4">
      <Icon size={18} className="text-gold-600" />
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="font-display text-lg font-semibold text-navy-900">{value}</p>
    </div>
  );
}
export const dynamic = "force-dynamic";
