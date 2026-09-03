import { getNavigation } from "@/lib/cms";
import { cmsSaveNavigation } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { NavigationForm } from "./navigation-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function NavigationEditorPage() {
  const nav = await getNavigation();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Navigation"
        description="The main menu, logo, header CTA and WhatsApp button shown in the site header."
      />
      <div className="p-4 sm:p-6">
        <NavigationForm nav={nav} action={cmsSaveNavigation as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
      </div>
    </div>
  );
}