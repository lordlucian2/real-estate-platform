import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageSquareText } from "lucide-react";
import { getRequests } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { matchRequestToProperties } from "@/lib/matching";
import { amenityLabels } from "@/lib/data";
import { formatPrice, relativeTime, cn } from "@/lib/utils";
import { RequestStatusControl } from "@/components/admin/status-controls";
import { MatchScorePill } from "@/components/property/property-card";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Client Requests" };
export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const requests = await getRequests();
  const matchesByRequest = new Map(
    await Promise.all(requests.map(async (r) => [r.id, await matchRequestToProperties(r, 3)] as const)),
  );

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Client Requests</h1>
        <p className="text-sm text-ink-500">
          Every &quot;Tell Me What You Need&quot; submission, matched against your inventory.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <MessageSquareText size={28} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-xl font-semibold text-navy-900">No client requests yet</p>
          <p className="text-sm text-ink-500">They&apos;ll appear here the moment someone submits a request.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {requests.map((r) => {
            const matches = matchesByRequest.get(r.id) ?? [];
            const hasBudget = r.budgetMin || r.budgetMax;
            return (
              <article key={r.id} className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold capitalize text-navy-900">
                      {r.name} — {r.needType.replaceAll("_", " ")}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-gold-600" />
                        {r.locations.map((l) => getLocation(l)?.name ?? l).join(" / ") || "Any area"}
                      </span>
                      {hasBudget ? (
                        <span>
                          ${r.budgetMin ?? "?"}–${r.budgetMax ?? "?"}/mo
                        </span>
                      ) : (
                        <span>Open budget</span>
                      )}
                      <span>{r.bedrooms ? `${r.bedrooms} bed` : "Any beds"}</span>
                      <span className="capitalize">{r.purpose}</span>
                    </div>
                  </div>
                  <RequestStatusControl requestId={r.id} status={r.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.furnished && r.furnished !== "either" ? (
                    <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-600">{r.furnished}</span>
                  ) : null}
                  {r.specialRequirements.map((req) => (
                    <span key={req} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-600">
                      {amenityLabels[req] ?? req}
                    </span>
                  ))}
                  <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-600">Move-in: {r.timeline}</span>
                </div>

                {/* Matches */}
                {matches.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Smart matches</p>
                    {matches.map((m) => (
                      <div
                        key={m.property.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-success/15 bg-success/5 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <Link href={`/properties/${m.property.slug}`} className="font-semibold text-navy-900 hover:text-gold-600">
                            {m.property.title}
                          </Link>
                          <p className="text-xs text-ink-500">
                            {formatPrice(m.property.price, m.property.currency, m.property.listingType)} · {m.reasons.join(" · ")}
                          </p>
                          {m.warnings.length > 0 ? (
                            <p className="mt-0.5 text-xs text-warning">{m.warnings.join(" · ")}</p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <MatchScorePill score={m.score} />
                          <a
                            href={whatsappLink(`Hello, I found a good match for ${r.name}'s request: ${m.property.title}. Are you still interested?`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-8 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp-dark hover:bg-whatsapp hover:text-white"
                            aria-label="Send match on WhatsApp"
                          >
                            <WhatsAppIcon size={15} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-xl bg-cream-100 px-4 py-2.5 text-xs text-ink-500">
                    No inventory matches yet — check off-market sources or alert-powered owners.
                  </p>
                )}

                <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/5 pt-3 text-xs text-ink-400">
                  <span>{relativeTime(r.createdAt)}</span>
                  <span className={cn("font-semibold", r.status === "closed" ? "text-ink-400" : "text-success")}>
                    {r.status === "closed" ? "Closed" : "In progress"}
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