import { getSettings } from "@/lib/cms";
import { cmsSaveWhatsappSettings } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { WhatsappForm } from "./whatsapp-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function WhatsappSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings · WhatsApp & Social"
        title="WhatsApp & Social"
        description="The WhatsApp number used to build every wa.me link, the message templates, and your social profiles."
      />
      <div className="p-4 sm:p-6">
        <WhatsappForm settings={settings} action={cmsSaveWhatsappSettings as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}