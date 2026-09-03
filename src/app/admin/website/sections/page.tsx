import Link from "next/link";
import { getHomeWorking } from "@/lib/cms";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { ArrowUpRight } from "lucide-react";

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

export default async function SectionsIndexPage() {
  const home = await getHomeWorking();
  const sections = home.sections.filter((s) => sectionLabels[s.key]);

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Homepage Sections"
        description="Every section that can appear on the homepage. Toggle them on/off, set their order, and edit each section's copy."
      />
      <div className="p-4 sm:p-6">
        <AdminCard title={`${sections.length} sections`}>
          <ul className="divide-y divide-ink-900/5">
            {sections.map((s, i) => (
              <li key={s.key} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-2 rounded-full ${s.enabled ? "bg-success" : "bg-ink-300"}`}
                    title={s.enabled ? "Enabled" : "Disabled"}
                  />
                  <span className="text-sm font-medium text-navy-900">{sectionLabels[s.key]}</span>
                  <span className="text-xs text-ink-400">order {i + 1}</span>
                </div>
                <Link
                  href={`/admin/website/sections/${s.key}`}
                  className="inline-flex items-center gap-1 rounded-full border border-ink-900/10 px-3 py-1 text-xs font-semibold text-navy-900 hover:border-gold-500"
                >
                  Edit <ArrowUpRight size={12} />
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}