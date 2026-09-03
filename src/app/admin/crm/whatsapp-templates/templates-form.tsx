"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Textarea } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function TemplatesForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const t = settings.whatsapp.templates;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="number" value={settings.whatsapp.number} />
      <AdminCard
        title="Message templates"
        description="Placeholders: {agentName} · {propertyTitle} · {propertyType} · {location} · {budget} · {clientName}"
      >
        <div className="space-y-4">
          <Field label="Property inquiry">
            <Textarea name="propertyInquiryText" rows={3} defaultValue={t.propertyInquiry} />
          </Field>
          <Field label="Viewing request">
            <Textarea name="viewingText" rows={3} defaultValue={t.viewing} />
          </Field>
          <Field label="Property request (find me)">
            <Textarea name="propertyRequestText" rows={3} defaultValue={t.propertyRequest} />
          </Field>
          <Field label="Generic / chat">
            <Textarea name="genericText" rows={3} defaultValue={t.generic} />
          </Field>
          <Field label="Owner / list property">
            <Textarea name="ownerText" rows={3} defaultValue={t.owner} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Prefill behaviour">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-navy-900">Fields included in pre-filled messages</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField name="propTitle" label="Property title" checked />
            <ToggleField name="propPrice" label="Price" checked />
            <ToggleField name="propType" label="Property type" checked />
            <ToggleField name="propLocation" label="Location" checked />
          </div>
        </fieldset>
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
            Save templates
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}