import Link from "next/link";
import { getSettings, getAuditLog, getUsers, getPages, getMedia } from "@/lib/cms";
import { getAllProperties } from "@/lib/store";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { ChangePasswordCard } from "./change-password";
import { Globe, Database, FileJson, MessageCircle, Cloud } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SystemSettingsPage() {
  const [settings, users, pages, media, props, audit] = await Promise.all([
    getSettings(),
    getUsers(),
    getPages(),
    getMedia(),
    getAllProperties(),
    getAuditLog(),
  ]);

  const checklist = [
    {
      label: "WhatsApp number",
      value: settings.whatsapp.number,
      note: settings.whatsapp.number === "231770000000" ? "Still placeholder — update it." : "Set",
      ok: settings.whatsapp.number !== "231770000000",
    },
    {
      label: "Site domain",
      value: settings.general.domain,
      note: settings.general.domain === "https://ericrealty.example" ? "Still placeholder — set your real domain." : "Set",
      ok: settings.general.domain !== "https://ericrealty.example",
    },
    {
      label: "Contact email",
      value: settings.general.email,
      note: settings.general.email === "eric@example.com" ? "Still placeholder." : "Set",
      ok: settings.general.email !== "eric@example.com",
    },
    {
      label: "Admin password",
      note: "Change it below — keep it strong and unique.",
      ok: true,
    },
  ];

  const totals = {
    users: users.length,
    pages: pages.length,
    media: media.length,
    properties: props.length,
    audit: audit.length,
  };

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings · System"
        title="System"
        description="Storage overview and a quick readiness checklist for going live."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <AdminCard title="Data store" description="This site persists to a Neon PostgreSQL database.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Database, label: "Properties", value: totals.properties },
              { icon: FileJson, label: "Pages", value: totals.pages },
              { icon: FileJson, label: "Media files", value: totals.media },
              { icon: Globe, label: "Team members", value: totals.users },
              { icon: FileJson, label: "Audit entries", value: totals.audit },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-ink-900/10 bg-cream-50/50 p-4 text-center">
                <s.icon size={18} className="mx-auto text-gold-600" />
                <p className="mt-2 font-display text-2xl font-semibold text-navy-900">{s.value}</p>
                <p className="text-xs text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Go-live checklist" description="Confirm these before marketing the site.">
          <ul className="space-y-3">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-cream-50/40 p-3">
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${
                    c.ok ? "bg-success/10 text-success" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.ok ? "✓" : "!"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {c.label}
                    {c.value ? <span className="ml-2 font-normal text-ink-400">{c.value}</span> : null}
                  </p>
                  <p className="text-xs text-ink-500">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard title="About this Command Center" description="Everything here is editable from the sidebar — nothing requires touching code.">
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <Cloud size={15} className="text-gold-600" /> Runtime storage is backed by a{" "}
            <code className="rounded bg-cream-100 px-1.5 py-0.5 text-xs">Neon PostgreSQL</code> database.
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <MessageCircle size={15} className="text-gold-600" /> Replace WhatsApp, domain and email placeholders in{" "}
            <Link href="/admin/website/homepage" className="font-semibold text-gold-700 hover:underline">General Settings</Link>.
          </p>
        </AdminCard>
        <ChangePasswordCard />
      </div>
    </div>
  );
}