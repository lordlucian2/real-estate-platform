import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { getViewings, getAllProperties } from "@/lib/store";
import { formatDate, relativeTime } from "@/lib/utils";
import { ViewingStatusControl } from "@/components/admin/status-controls";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Viewing Requests" };
export const dynamic = "force-dynamic";

export default async function AdminViewingsPage() {
  const [viewings, properties] = await Promise.all([
    getViewings(),
    getAllProperties(),
  ]);

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Viewing Requests</h1>
        <p className="text-sm text-ink-500">Confirm dates, coordinate with owners, follow through.</p>
      </div>

      {viewings.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <KeyRound size={28} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-xl font-semibold text-navy-900">No viewing requests yet</p>
          <p className="text-sm text-ink-500">Requests from property pages will land here.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/5 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Visitor</th>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Preferred</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {viewings.map((v) => {
                  const p = properties.find((x) => x.id === v.propertyId);
                  return (
                    <tr key={v.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy-900">{v.name}</p>
                        <p className="text-xs text-ink-400">{relativeTime(v.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/properties/${p?.slug}`} className="font-medium text-navy-800 hover:text-gold-600">
                          {p?.title ?? "Unknown property"}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-ink-600">
                        {v.preferredDate ? formatDate(v.preferredDate, { month: "short", day: "numeric", year: "numeric" }) : "Flexible"}
                        {v.preferredTime ? <span className="block text-xs text-ink-400">{v.preferredTime}</span> : null}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-ink-600">{v.whatsapp || v.phone || "—"}</span>
                          {v.whatsapp ? (
                            <a
                              href={whatsappLink(`Hello ${v.name}, regarding your viewing request — let's confirm the time.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex size-7 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp-dark hover:bg-whatsapp hover:text-white"
                              aria-label="WhatsApp visitor"
                            >
                              <WhatsAppIcon size={13} />
                            </a>
                          ) : null}
                        </div>
                        {v.notes ? <p className="mt-1 max-w-56 truncate text-xs text-ink-400">{v.notes}</p> : null}
                      </td>
                      <td className="px-4 py-3">
                        <ViewingStatusControl viewingId={v.id} status={v.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}