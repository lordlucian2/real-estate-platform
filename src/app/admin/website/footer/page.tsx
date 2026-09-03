import { getSettings } from "@/lib/cms";
import { cmsSaveSettingsGeneral } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FooterForm } from "./footer-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function FooterEditorPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Footer"
        description="The about text, explore columns, legal line and closing note at the bottom of every page."
      />
      <div className="p-4 sm:p-6">
        <FooterForm settings={settings} action={cmsSaveSettingsGeneral as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}