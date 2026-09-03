import { getLeads, getRequests } from "@/lib/store";
import { adminUpdateLead } from "@/app/actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { ClientStageSelect } from "./stage-select";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [leads, requests] = await Promise.all([getLeads(), getRequests()]);

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="CRM"
        title="Clients"
        description="Everyone in your pipeline — leads from any source plus all web-form property requests."
      />
      <div className="p-4 sm:p-6">
        <AdminCard title={`${leads.length} leads · ${requests.length} requests`}>
          {leads.length === 0 && requests.length === 0 ? (
            <p className="text-sm text-ink-400">No clients yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2.5 pr-3">Client</th>
                    <th className="pr-3">Interest</th>
                    <th className="pr-3">Contact</th>
                    <th className="pr-3">Stage</th>
                    <th className="text-right">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td className="py-3 pr-3 font-semibold text-navy-900">{l.name}</td>
                      <td className="pr-3 text-ink-600">{l.interest}</td>
                      <td className="pr-3 text-ink-500">{l.whatsapp || l.phone || l.email || "—"}</td>
                      <td className="pr-3">
                        <ClientStageSelect leadId={l.id} stage={l.stage} act={adminUpdateLead} />
                      </td>
                      <td className="text-right text-xs text-ink-400">{relativeTime(l.createdAt)}</td>
                    </tr>
                  ))}
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 pr-3 font-semibold text-navy-900">{r.name}</td>
                      <td className="pr-3 text-ink-600">{r.needType} · {r.purpose}</td>
                      <td className="pr-3 text-ink-500">{r.whatsapp || r.phone || r.email || "—"}</td>
                      <td className="pr-3">
                        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-navy-700">
                          {r.status}
                        </span>
                      </td>
                      <td className="text-right text-xs text-ink-400">{relativeTime(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}