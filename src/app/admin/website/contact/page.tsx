import { getSettings } from "@/lib/cms";
import { cmsSaveAgent } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AgentForm } from "./agent-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ContactEditorPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website · Contact"
        title="Contact Page & Agent Profile"
        description="The agent details and profile used across the Contact, About and Why Me sections."
      />
      <div className="p-4 sm:p-6">
        <AgentForm agent={settings.agent} action={cmsSaveAgent as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}