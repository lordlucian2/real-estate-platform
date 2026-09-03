import { getSettings } from "@/lib/cms";
import { cmsSaveTemplates } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { TemplatesForm } from "./templates-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function WhatsappTemplatesPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="CRM"
        title="WhatsApp Templates"
        description="Pre-filled messages used to contact clients and owners. Each field supports placeholders."
      />
      <div className="p-4 sm:p-6">
        <TemplatesForm settings={settings} action={cmsSaveTemplates as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}