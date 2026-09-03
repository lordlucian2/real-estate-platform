import { getSettings } from "@/lib/cms";
import { cmsSaveNotifications } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { NotificationsForm } from "./notifications-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function NotificationsSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="Notifications"
        description="Where alerts go and which events trigger a notification."
      />
      <div className="p-4 sm:p-6">
        <NotificationsForm settings={settings} action={cmsSaveNotifications as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}