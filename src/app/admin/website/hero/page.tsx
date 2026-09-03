import { getHomeWorking } from "@/lib/cms";
import { cmsSaveHomeHero } from "@/app/cms-actions";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { HeroForm } from "./hero-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function HeroEditorPage() {
  const home = await getHomeWorking();
  const hero = home.hero;

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website · Homepage"
        title="Hero Section"
        description="The first thing visitors see. Edits save to the draft — publish from the Homepage Editor to go live."
      />
      <div className="p-4 sm:p-6">
        <HeroForm
          hero={hero}
          action={cmsSaveHomeHero as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
        />
      </div>
    </div>
  );
}