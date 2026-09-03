import Link from "next/link";
import {
  Building2,
  MessagesSquare,
  CalendarCheck,
  UserSearch,
  ClipboardList,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  AlertTriangle,
  Users,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  getAllProperties,
  getRequests,
  getViewings,
  getLeads,
  getOwnerSubmissions,
  getAlerts,
} from "@/lib/store";
import { getUsers, getPages, getMedia, getAuditLog, getHomePublished } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [props, requests, viewings, leads, owners, alerts] = await Promise.all([
    getAllProperties(),
    getRequests(),
    getViewings(),
    getLeads(),
    getOwnerSubmissions(),
    getAlerts(),
  ]);
  const [users, pages, media, audit, home] = await Promise.all([
    getUsers(),
    getPages(),
    getMedia(),
    getAuditLog(),
    getHomePublished(),
  ]);

  const published = props.filter((p) => p.status === "available").length;
  const pending = props.filter((p) => p.status === "archived").length;
  const unseenRequests = requests.filter((r) => r.status === "new").length;

  const statCards = [
    { label: "Properties", value: props.length, sub: `${published} published · ${pending} pending`, href: "/admin/properties", icon: Building2 },
    { label: "Client requests", value: requests.length, sub: `${unseenRequests} unseen`, href: "/admin/requests", icon: MessagesSquare },
    { label: "Viewings", value: viewings.length, href: "/admin/viewings", icon: CalendarCheck },
    { label: "Leads", value: leads.length, href: "/admin/leads", icon: UserSearch },
    { label: "Owner submissions", value: owners.length, href: "/admin/owners", icon: ClipboardList },
    { label: "Alerts", value: alerts.length, href: "/admin/alerts", icon: AlertTriangle },
  ];

  const draftFlag = home && home.updatedAt ? "Live" : "Draft";

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Command Center"
        title="Dashboard"
        description="A quick pulse on your inventory, inbox and site content."
      />

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {statCards.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition-colors hover:border-gold-500/50"
            >
              <div className="flex items-center justify-between">
                <s.icon size={18} className="text-gold-600" />
                <ArrowUpRight size={16} className="text-ink-300 transition-colors group-hover:text-gold-600" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-navy-900">{s.value}</p>
              <p className="text-sm font-medium text-ink-700">{s.label}</p>
              {s.sub ? <p className="text-xs text-ink-400">{s.sub}</p> : null}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Section title="Recent admin activity">
              {audit.length === 0 ? (
                <p className="text-sm text-ink-400">No activity yet.</p>
              ) : (
                <ul className="divide-y divide-ink-900/5">
                  {audit.slice(0, 10).map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                      <p className="text-sm text-ink-600">
                        <span className="font-semibold text-navy-900">{e.actor}</span>{" "}
                        <span className="capitalize">{e.action}</span>{" "}
                        <span className="text-ink-400">· {e.summary}</span>
                      </p>
                      <span className="shrink-0 rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-navy-700">
                        {e.entity}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>

          <div className="space-y-6">
            <Section title="Content status">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/website/homepage" className="rounded-xl border border-ink-900/10 bg-cream-50/40 p-3 hover:border-gold-500/50">
                  <LayoutGrid size={16} className="text-gold-600" />
                  <p className="mt-2 text-sm font-semibold text-navy-900">Homepage</p>
                  <p className="text-xs text-ink-400">{draftFlag}</p>
                </Link>
                <Link href="/admin/content/pages" className="rounded-xl border border-ink-900/10 bg-cream-50/40 p-3 hover:border-gold-500/50">
                  <FileText size={16} className="text-gold-600" />
                  <p className="mt-2 text-sm font-semibold text-navy-900">Pages</p>
                  <p className="text-xs text-ink-400">{pages.length}</p>
                </Link>
                <Link href="/admin/content/media" className="rounded-xl border border-ink-900/10 bg-cream-50/40 p-3 hover:border-gold-500/50">
                  <ImageIcon size={16} className="text-gold-600" />
                  <p className="mt-2 text-sm font-semibold text-navy-900">Media</p>
                  <p className="text-xs text-ink-400">{media.length} files</p>
                </Link>
                <Link href="/admin/settings/users" className="rounded-xl border border-ink-900/10 bg-cream-50/40 p-3 hover:border-gold-500/50">
                  <Users size={16} className="text-gold-600" />
                  <p className="mt-2 text-sm font-semibold text-navy-900">Team</p>
                  <p className="text-xs text-ink-400">{users.length} users</p>
                </Link>
              </div>
            </Section>

            <Section title="Quick actions">
              <div className="flex flex-col gap-2">
                {[
                  { label: "Add a property", href: "/admin/properties/new" },
                  { label: "Review owner submissions", href: "/admin/owners" },
                  { label: "Edit homepage", href: "/admin/website/homepage" },
                  { label: "View audit log", href: "/admin/settings/audit" },
                ].map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="rounded-xl border border-ink-900/10 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-gold-500/60"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-navy-900">{title}</h3>
      {children}
    </div>
  );
}