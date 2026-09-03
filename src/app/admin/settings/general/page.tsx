import { getSettings } from "@/lib/cms";
import { cmsSaveSettingsGeneral } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { GeneralForm } from "./general-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="General & Identity"
        description="Business name, contact details, region, footer columns and notification preferences."
      />
      <div className="p-4 sm:p-6">
        <GeneralForm settings={settings} action={cmsSaveSettingsGeneral as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}