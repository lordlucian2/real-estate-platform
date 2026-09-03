import Link from "next/link";
import { SectionRenderer } from "@/components/home/home-sections";
import { getHomeWorking, getSettings, getLocationsCms } from "@/lib/cms";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const [home, settings, locations] = await Promise.all([
    getHomeWorking(),
    getSettings(),
    getLocationsCms(),
  ]);

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-gold-500/30 bg-navy-900 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-gold-300">
          <Eye size={16} /> Draft preview — these changes are NOT live
        </p>
        <Link
          href="/admin/website/homepage"
          className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-semibold text-navy-950 hover:bg-gold-400"
        >
          Back to editor
        </Link>
      </div>
      {home.sections.map((section) => (
        <SectionRenderer key={section.key} section={section} home={home} settings={settings} locations={locations} />
      ))}
    </>
  );
}