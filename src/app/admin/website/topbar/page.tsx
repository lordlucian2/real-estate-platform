import { getSettings } from "@/lib/cms";
import { cmsSaveSettingsGeneral } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { TopBarForm } from "./topbar-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function TopBarEditorPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Top Bar"
        description="The slim dark strip above the main header with phone, hours and areas served."
      />
      <div className="p-4 sm:p-6">
        <TopBarForm
          settings={settings}
          action={cmsSaveSettingsGeneral as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
        />
      </div>
    </div>
  );
}