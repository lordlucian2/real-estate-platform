import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, Video } from "lucide-react";
import { getPropertyBySlug } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { formatPrice } from "@/lib/utils";
import { site, agent } from "@/lib/site";
import { ViewingRequestForm } from "@/components/forms/viewing-request-form";
import { VerificationBadge } from "@/components/property/property-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  return {
    title: p ? `Request a Viewing — ${p.title}` : "Request a Viewing",
    description: p
      ? `Schedule a viewing for ${p.title}. Pick a date and time and the agent will confirm with you.`
      : "Schedule a property viewing",
    robots: { index: false },
  };
}

export default async function ViewingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const loc = getLocation(property.locationId);
  const cover = property.images[0];

  return (
    <>
      <section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Request a viewing</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-4xl">
            {property.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cream-50/70">
            <p className="flex items-center gap-1.5">
              <MapPin size={15} className="text-gold-300" /> {loc?.name ?? "Liberia"}
            </p>
            <p className="font-display text-xl font-bold text-gold-200">
              {formatPrice(property.price, property.currency, property.listingType)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* Property summary */}
          <div>

            {cover ? (
              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={cover.url} alt={property.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            ) : null}

            <div className="mt-5">
              <VerificationBadge status={property.verificationStatus} lastVerifiedAt={property.lastVerifiedAt} />
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-ink-900/5 bg-white p-5 text-sm text-ink-700">
              <p className="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-gold-600" />
                I&apos;ll confirm the exact date and time with you personally before the visit.
              </p>
              <p className="flex items-start gap-2.5">
                <Video size={16} className="mt-0.5 shrink-0 text-gold-600" />
                Can&apos;t visit in person? Ask about a WhatsApp video walkthrough.
              </p>
              <p className="flex items-start gap-2.5 text-ink-500">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-600" />
                {agent.name} accompanies viewings and coordinates directly with the owner.
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-xl sm:p-8">
            <p className="font-display text-xl font-semibold text-navy-900">Pick a time that works</p>
            <p className="mt-1 text-sm text-ink-500">
              {site.hours} · The owner&apos;s number is shared once the visit is agreed.
            </p>
            <div className="mt-6">
              <ViewingRequestForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}