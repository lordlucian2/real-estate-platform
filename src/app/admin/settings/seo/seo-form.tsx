"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, ToggleField, ListTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function SeoForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const s = settings.seo;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Search metadata">
        <div className="space-y-4">
          <Field label="Default page title">
            <Input name="title" defaultValue={s.title} />
          </Field>
          <Field label="Meta description">
            <Textarea name="description" defaultValue={s.description} rows={3} />
          </Field>
          <Field label="Keywords (one per line)">
            <ListTextarea name="keywords" value={s.keywords} rows={5} />
          </Field>
          <Field label="Open-graph / share image URL">
            <Input name="ogImage" defaultValue={s.ogImage} placeholder="/api/media/..." />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Crawling & sitemap">
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField name="robotsEnabled" label="Allow search engines to index" checked={s.robotsEnabled} />
          <ToggleField name="sitemapEnabled" label="Generate a sitemap" checked={s.sitemapEnabled} />
        </div>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back
          </Link>
          <button
            type="submit"
            className="ml-auto rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save SEO
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}