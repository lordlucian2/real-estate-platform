"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField, ListTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function TopBarForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const tb = settings.topBar;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Top bar">
        <div className="space-y-4">
          <ToggleField name="topbarEnabled" label="Show the top bar" checked={tb.enabled} />
          <FormGrid>
            <Field label="Phone number">
              <Input name="topbarPhone" defaultValue={tb.phone} />
            </Field>
            <Field label="Hours">
              <Input name="topbarHours" defaultValue={tb.hours} />
            </Field>
          </FormGrid>
          <Field label="Areas served (one per line, shown on the right)">
            <ListTextarea name="topbarServiceArea" value={tb.serviceArea} rows={3} />
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
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save top bar
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}