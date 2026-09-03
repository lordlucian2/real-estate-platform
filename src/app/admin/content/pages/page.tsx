import { getPages } from "@/lib/cms";
import { cmsSavePage, cmsDeletePage, cmsPublishPage } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { PageForm } from "./page-form";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Content"
        title="Custom Pages"
        description="Lightweight pages you can build from blocks (hero, rich text, columns, CTA) and link from the navigation or footer."
      />
      <div className="space-y-6 p-4 sm:p-6">
        {pages.map((p) => (
          <AdminCard key={p.id} title={p.title}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Link
                href={`/${p.slug}`}
                className="text-sm font-semibold text-gold-700 hover:underline"
              >
                /{p.slug}
              </Link>
              <p className="text-xs text-ink-400">{p.sections.length} section{p.sections.length === 1 ? "" : "s"}</p>
              {p.published ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <CheckCircle2 size={12} /> Published
                </span>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await cmsPublishPage(p.id);
                  }}
                >
                  <button type="submit" className="rounded-full bg-navy-900 px-3 py-1 text-[11px] font-semibold text-cream-50 hover:bg-navy-800">
                    Publish
                  </button>
                </form>
              )}
            </div>
            <PageForm page={p} action={cmsSavePage as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
            <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
              <form
                action={async () => {
                  "use server";
                  await cmsDeletePage(p.id);
                }}
              >
                <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                  Delete
                </button>
              </form>
            </div>
          </AdminCard>
        ))}

        <AdminCard title="Create a page">
          <p className="mb-4 text-sm text-ink-500">
            Start a new page. Section blocks (JSON) follow this shape:
            <code className="mt-1 block rounded bg-cream-100 p-2 text-xs">{`[{ "type": "heading", "title": "...", "eyebrow": "", "text": "", "buttons": [] }]`}</code>
          </p>
          <PageForm
            page={{ id: "", title: "", slug: "", sections: [], published: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }}
            action={cmsSavePage as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            isNew
          />
        </AdminCard>
      </div>
    </div>
  );
}