import { getAuditLog } from "@/lib/cms";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const log = await getAuditLog();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="Audit Log"
        description="A chronological record of every admin action across the Command Center. Retains the last 500 entries."
      />
      <div className="p-4 sm:p-6">
        <AdminCard title="Recent activity">
          {log.length === 0 ? (
            <p className="text-sm text-ink-400">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {log.map((entry) => (
                <li key={entry.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-ink-700">
                        <span className="font-semibold text-navy-900">{entry.actor}</span>{" "}
                        <span className="text-ink-400">·</span>{" "}
                        <span className="capitalize">{entry.action}</span>{" "}
                        <span className="text-ink-400">·</span> {entry.summary}
                      </p>
                      <p className="text-xs text-ink-400">
                        {entry.entity}
                        {entry.entityId ? ` · ${entry.entityId}` : ""} · {relativeTime(entry.at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-navy-700">
                      {entry.entity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}