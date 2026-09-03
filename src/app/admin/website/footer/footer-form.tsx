"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Textarea } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function FooterForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const foot = settings.footer;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="About text">
        <Field label="Short about (shown in the footer)">
          <Textarea name="footerAbout" defaultValue={foot.about} rows={3} />
        </Field>
      </AdminCard>

      <AdminCard title="Explore columns">
        <Field label='Columns (JSON) — array of { id, title, links: [{ label, href }] }'>
          <JsonTextarea name="footerColumns" value={foot.columns} rows={12} />
        </Field>
      </AdminCard>

      <AdminCard title="Closing">
        <div className="space-y-4">
          <Field label="Copyright line">
            <InputLike name="footerCopyright" defaultValue={foot.copyright} />
          </Field>
          <Field label="Closing note (right side)">
            <InputLike name="footerNote" defaultValue={foot.note} />
          </Field>
        </div>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/website/homepage" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back
          </Link>
          <button
            type="submit"
            className="ml-auto rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save footer
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}

function InputLike({ name, defaultValue }: { name: string; defaultValue: string }) {
  return <input name={name} defaultValue={defaultValue} className="w-full rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" />;
}