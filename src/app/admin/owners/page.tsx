import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { getOwnerSubmissions } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { amenityLabels } from "@/lib/data";
import { formatPrice, relativeTime } from "@/lib/utils";
import { OwnerStatusControl } from "@/components/admin/status-controls";

export const metadata: Metadata = { title: "Owner Submissions" };
export const dynamic = "force-dynamic";

export default async function AdminOwnersPage() {
  const owners = await getOwnerSubmissions();

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Owner Submissions</h1>
        <p className="text-sm text-ink-500">
          Never auto-published. Review the details, contact the owner, then verify to publish.
        </p>
      </div>

      {owners.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <Wallet size={28} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-xl font-semibold text-navy-900">No owner submissions yet</p>
          <p className="text-sm text-ink-500">They&apos;ll appear here when owners list properties.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {owners.map((o) => {
            const loc = getLocation(o.locationId);
            return (
              <article key={o.id} className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy-900">{o.ownerName}</h2>
                    <p className="text-sm text-ink-500">
                      {o.propertyType} · {o.listingType === "buy" ? "For sale" : "For rent"} ·{" "}
                      {loc?.name ?? o.locationId}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-semibold text-navy-900">
                        {o.price ? formatPrice(o.price, o.currency, o.listingType) : "Price TBD"}
                      </span>
                      <span className="mx-2 text-ink-400">·</span>
                      <span className="text-ink-500">{o.bedrooms} bed · {o.bathrooms} bath · {o.availability}</span>
                    </p>
                  </div>
                  <OwnerStatusControl submissionId={o.id} status={o.status} />
                </div>

                {o.description ? <p className="mt-3 text-sm leading-relaxed text-ink-600">{o.description}</p> : null}

                {o.amenities.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.amenities.map((a) => (
                      <span key={a} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-600">
                        {amenityLabels[a] ?? a}
                      </span>
                    ))}
                  </div>
                ) : null}

                <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/5 pt-3 text-xs text-ink-400">
                  <span>{relativeTime(o.createdAt)}</span>
                  <span>
                    {o.whatsapp || o.phone || "—"} {o.email ? `· ${o.email}` : ""}
                  </span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}