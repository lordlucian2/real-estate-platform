import { notFound } from "next/navigation";
import { getHomeWorking } from "@/lib/cms";
import { cmsSaveHomeSection } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SectionForm } from "./section-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

const meta: Record<string, { label: string; description: string }> = {
  featured: {
    label: "Featured Properties",
    description: "The hand-picked properties shown near the top of the page.",
  },
  "needs-help": {
    label: "Concierge (Can't Find What You're Looking For)",
    description: "The offer to help visitors search even when they can't find a match.",
  },
  "browse-types": {
    label: "Browse by Property Type",
    description: "The tile grid linking to each property type.",
  },
  "how-it-works": {
    label: "How It Works",
    description: "The three-step process explained to visitors.",
  },
  locations: {
    label: "Browse by Location",
    description: "The area grid on the dark band.",
  },
  "recently-verified": {
    label: "Recently Verified",
    description: "Listings ordered by most recently verified.",
  },
  "why-me": {
    label: "Why Me",
    description: "Your personal pitch and the quote card.",
  },
  testimonials: {
    label: "Testimonials",
    description: "The social proof carousel of client quotes.",
  },
  "owner-cta": {
    label: "Owner CTA",
    description: "The push for property owners to list with you.",
  },
  "whatsapp-band": {
    label: "WhatsApp Band",
    description: "The closing band encouraging WhatsApp contact.",
  },
};

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const home = await getHomeWorking();
  const section = home.sections.find((s) => s.key === key);
  if (!section || !meta[key]) notFound();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website · Sections"
        title={meta[key].label}
        description={meta[key].description}
      />
      <div className="p-4 sm:p-6">
        <SectionForm
          section={section}
          action={cmsSaveHomeSection as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
        />
      </div>
    </div>
  );
}