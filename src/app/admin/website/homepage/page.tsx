import { cmsOverview } from "@/lib/admin-stats";
import { getHomeWorking, getHomePublished } from "@/lib/cms";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { PublishHomeForm, ResetDraftForm } from "./forms";
import { RestoreRevisionButton } from "./revision-button";
import Link from "next/link";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const sectionLabels: Record<string, string> = {
  hero: "Hero Section",
  featured: "Featured Properties",
  "needs-help": "Concierge (Can't Find What You're Looking For)",
  "browse-types": "Browse by Property Type",
  "how-it-works": "How It Works",
  locations: "Browse by Location",
  "recently-verified": "Recently Verified",
  "why-me": "Why Me",
  testimonials: "Testimonials",
  "owner-cta": "Owner CTA",
  "whatsapp-band": "WhatsApp Band",
};

export default async function HomepageEditorPage() {
  const [working, published, overview] = await Promise.all([
    getHomeWorking(),
    getHomePublished(),
    cmsOverview(),
  ]);

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website · Homepage"
        title="Homepage Editor"
        description="Compose, preview and publish your site. Work in a draft, then publish when happy. Every publish is saved to version history."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {/* Draft vs published status */}
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminCard title="Current draft">
            <p className="text-sm text-ink-500">
              Last edited{" "}
              <span className="font-semibold text-navy-900">{relativeTime(working.updatedAt)}</span>
              {overview.draftsDiff ? (
                <span className="mt-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Unpublished changes
                </span>
              ) : (
                <span className="mt-1 inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                  In sync
                </span>
              )}
            </p>
          <Link href="/admin/website/preview" target="_blank" className="mt-2 inline-block text-xs font-semibold text-gold-700 hover:underline">
              Preview draft →
            </Link>
          </AdminCard>
          <AdminCard title="Live on site">
            <p className="text-sm text-ink-500">
              Published{" "}
              <span className="font-semibold text-navy-900">{relativeTime(published.updatedAt)}</span>
            </p>
            <Link href="/" target="_blank" className="mt-2 inline-block text-xs font-semibold text-gold-700 hover:underline">
              Preview live site →
            </Link>
          </AdminCard>
          <AdminCard title="Quick actions">
            <div className="flex flex-wrap gap-2 pt-1">
              <PublishHomeForm />
              <ResetDraftForm />
            </div>
          </AdminCard>
        </div>

        {/* Section registry / order */}
        <AdminCard
          title="Sections & order"
          description="The order shown here is the order they appear on the homepage. Toggle each section on or off, then fine-tune its copy from its own page."
        >
          <ul className="space-y-2">
            {working.sections.map((s, i) => (
              <li
                key={s.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-900/10 bg-cream-50/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {sectionLabels[s.key] ?? s.key}
                    </p>
                    <p className="text-xs text-ink-400">
                      {s.enabled ? "Enabled" : "Hidden"}
                      {s.title ? ` · ${s.title}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                      s.enabled ? "bg-success/10 text-success" : "bg-ink-900/5 text-ink-400"
                    }`}
                  >
                    {s.enabled ? "On" : "Off"}
                  </span>
                  <Link
                    href={s.key === "hero" ? "/admin/website/hero" : `/admin/website/sections/${s.key}`}
                    className="rounded-full border border-ink-900/10 px-4 py-1.5 text-xs font-semibold text-navy-900 hover:border-gold-500 hover:text-gold-700"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>

        {/* Version history */}
        <AdminCard
          title="Version history"
          description="Every published homepage snapshot, available to restore as a new draft."
        >
          {overview.revisions.length === 0 ? (
            <p className="text-sm text-ink-400">
              No published versions yet. Publish the homepage to start a history.
            </p>
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {overview.revisions.slice(0, 12).map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">
                        {r.label}
                        <span className="ml-2 font-normal text-ink-400">by {r.actor}</span>
                      </p>
                      <p className="text-xs text-ink-400">{relativeTime(r.at)}</p>
                    </div>
                    <RestoreRevisionButton id={r.id} />
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