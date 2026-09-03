import { getSettings } from "@/lib/cms";
import { cmsSaveSeoSettings } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SeoForm } from "./seo-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function SeoSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="SEO / Search"
        description="Search-engine title, description, keywords and crawling options."
      />
      <div className="p-4 sm:p-6">
        <SeoForm settings={settings} action={cmsSaveSeoSettings as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}