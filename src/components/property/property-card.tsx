import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/types";
import { listingLabels, verificationLabels, typeLabels } from "@/lib/data";
import { formatPriceAmount, relativeTime, cn } from "@/lib/utils";
import { getLocation } from "@/lib/locations";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui";
import { FavoriteButton } from "@/components/property/favorite-button";

export function VerificationBadge({
  status,
  lastVerifiedAt,
  size = "sm",
  className,
}: {
  status: Property["verificationStatus"];
  lastVerifiedAt?: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const meta = verificationLabels[status];
  const tone =
    status === "verified" ? "green" : status === "recently_checked" ? "amber" : status === "owner_submitted" ? "navy" : "red";

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <Badge tone={tone} className={size === "lg" ? "text-xs px-3 py-1.5" : ""}>
        <ShieldCheck size={13} strokeWidth={2.2} />
        {meta.label}
      </Badge>
      {lastVerifiedAt && status !== "owner_submitted" ? (
        <span className="text-[11px] text-ink-400">
          Last verified: {relativeTime(lastVerifiedAt)}
        </span>
      ) : null}
    </div>
  );
}

export function MatchScorePill({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-white",
        className,
      )}
    >
      {score}% Match
    </span>
  );
}

export function PropertyCard({
  property,
  matchScore,
  className,
  priority = false,
}: {
  property: Property;
  matchScore?: number;
  className?: string;
  priority?: boolean;
}) {
  const loc = getLocation(property.locationId);
  const cover = property.images[0];
  const inquiry = whatsappLink(
    `Hello, I am interested in the "${property.title}" in ${loc?.name ?? "Liberia"} listed on your website. Is it still available?`,
  );

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10",
        className,
      )}
    >
      <div className="relative block aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.slug}`} className="absolute inset-0 block">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-cream-200 text-ink-400">
              Photo coming soon
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 pr-12">
          <div className="pointer-events-auto flex flex-col gap-1.5">
            <Badge tone={property.listingType === "buy" ? "gold" : "navy"} className="shadow-sm">
              {listingLabels[property.listingType]}
            </Badge>
            {property.type === "land" ? null : (
              <Badge tone="cream" className="shadow-sm bg-white/85 text-navy-800 backdrop-blur">
                {typeLabels[property.type]}
              </Badge>
            )}
          </div>
        </div>

        {matchScore ? (
          <MatchScorePill score={matchScore} className="absolute left-3 top-14" />
        ) : (
          <Badge
            tone={property.verificationStatus === "verified" ? "green" : property.verificationStatus === "recently_checked" ? "amber" : "cream"}
            className="absolute left-3 top-14 shadow-sm"
          >
            <ShieldCheck size={12} strokeWidth={2.4} />
            {verificationLabels[property.verificationStatus].label}
          </Badge>
        )}

        <FavoriteButton slug={property.slug} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-lg font-bold leading-snug text-navy-900">
            <Link href={`/properties/${property.slug}`} className="hover:text-gold-600">
              {property.title}
            </Link>
          </h3>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin size={14} className="shrink-0 text-gold-600" />
          {loc?.name ?? property.address}
        </p>

        <div className="mt-4 flex items-center gap-4 border-y border-ink-900/5 py-3 text-[13px] font-medium text-ink-700">
          {property.bedrooms > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble size={15} className="text-ink-400" />
              {property.bedrooms} Bed{property.bedrooms > 1 ? "s" : ""}
            </span>
          ) : null}
          {property.bathrooms > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath size={15} className="text-ink-400" />
              {property.bathrooms} Bath{property.bathrooms > 1 ? "s" : ""}
            </span>
          ) : null}
          {property.size ? (
            <span className="inline-flex items-center gap-1.5">
              <Ruler size={15} className="text-ink-400" />
              {property.size} {property.sizeUnit ?? "m²"}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="leading-none">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-400">
              {property.listingType === "buy" ? "Asking price" : property.listingType === "short-term" ? "Per night" : "Per month"}
            </span>
            <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-navy-900">
              {formatPriceAmount(property.price, property.currency)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="rounded-xl border border-ink-900/10 px-4 py-2.5 text-[13px] font-semibold text-ink-700 transition-colors hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
            >
              View Details
            </Link>
            <a
              href={inquiry}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask about ${property.title} on WhatsApp`}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-whatsapp/10 text-whatsapp-dark transition-colors hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}