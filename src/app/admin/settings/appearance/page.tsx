import { getSettings } from "@/lib/cms";
import { cmsSaveAppearanceSettings } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AppearanceForm } from "./appearance-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AppearanceSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="Appearance"
        description="Design tokens that shape the look and feel of the public site."
      />
      <div className="p-4 sm:p-6">
        <AppearanceForm settings={settings} action={cmsSaveAppearanceSettings as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}