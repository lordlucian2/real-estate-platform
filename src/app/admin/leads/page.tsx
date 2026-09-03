import type { Metadata } from "next";
import { Users } from "lucide-react";
import { getLeads } from "@/lib/store";
import { relativeTime } from "@/lib/utils";
import { LeadStageControl } from "@/components/admin/status-controls";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Leads</h1>
        <p className="text-sm text-ink-500">
          Every inbound touchpoint, tracked from new → closed.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <Users size={28} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-xl font-semibold text-navy-900">No leads yet</p>
          <p className="text-sm text-ink-500">Leads are created automatically when clients reach out.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/5 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Interest</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900">{l.name}</p>
                      <p className="text-xs text-ink-400">{relativeTime(l.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs capitalize text-ink-600">
                        {l.source.replace("_", " ")}
                      </span>
                    </td>
                    <td className="max-w-64 px-4 py-3 text-ink-600">
                      <p className="truncate">{l.interest}</p>
                      {l.notes ? <p className="truncate text-xs text-ink-400">{l.notes}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-ink-600">{l.whatsapp || l.phone || l.email || "—"}</td>
                    <td className="px-4 py-3">
                      <LeadStageControl leadId={l.id} stage={l.stage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}