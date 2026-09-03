"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function GeneralForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const s = settings;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Identity & brand">
        <FormGrid>
          <Field label="Full name">
            <Input name="name" defaultValue={s.general.name} />
          </Field>
          <Field label="Short name (header/footer)">
            <Input name="shortName" defaultValue={s.general.shortName} />
          </Field>
          <Field label="Brand line">
            <Input name="brandLine" defaultValue={s.general.brandLine} />
          </Field>
          <Field label="Tagline">
            <Input name="tagline" defaultValue={s.general.tagline} />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Contact">
        <FormGrid>
          <Field label="City / region">
            <Input name="city" defaultValue={s.general.city} />
          </Field>
          <Field label="Address">
            <Input name="address" defaultValue={s.general.address} />
          </Field>
          <Field label="Email">
            <Input name="email" defaultValue={s.general.email} />
          </Field>
          <Field label="Phone">
            <Input name="phone" defaultValue={s.general.phone} />
          </Field>
          <Field label="Hours">
            <Input name="hours" defaultValue={s.general.hours} className="sm:col-span-2" />
          </Field>
          <Field label="Currency">
            <Input name="currency" defaultValue={s.general.currency} />
          </Field>
          <Field label="Country">
            <Input name="country" defaultValue={s.general.country} />
          </Field>
          <Field label="Domain">
            <Input name="domain" defaultValue={s.general.domain} />
          </Field>
          <Field label="Timezone">
            <Input name="timezone" defaultValue={s.general.timezone} />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Footer columns">
        <Field label="Columns (JSON) — array of { id, title, links: [{ label, href }] }">
          <JsonTextarea name="footerColumns" value={s.footer.columns} rows={12} />
        </Field>
      </AdminCard>

      <AdminCard title="Notifications">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Notification email">
            <Input name="notifyEmail" defaultValue={s.notifications.email} />
          </Field>
          <ToggleField name="notifyWhatsapp" label="Send WhatsApp notifications" checked={s.notifications.whatsapp} />
          <ToggleField name="notifyNewRequest" label="New client request" checked={s.notifications.onNewRequest} />
          <ToggleField name="notifyOwnerSubmission" label="New owner submission" checked={s.notifications.onOwnerSubmission} />
          <ToggleField name="notifyViewing" label="New viewing request" checked={s.notifications.onViewing} />
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
            Save settings
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}