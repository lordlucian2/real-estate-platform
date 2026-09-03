"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function NotificationsForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const n = settings.notifications;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Delivery">
        <Field label="Notification email">
          <Input name="notifyEmail" defaultValue={n.email} type="email" />
        </Field>
        <div className="mt-3">
          <ToggleField name="notifyWhatsapp" label="Send WhatsApp notifications" checked={n.whatsapp} />
        </div>
      </AdminCard>

      <AdminCard title="Events">
        <div className="space-y-3">
          <ToggleField name="notifyNewRequest" label="New client request" checked={n.onNewRequest} />
          <ToggleField name="notifyOwnerSubmission" label="New owner submission" checked={n.onOwnerSubmission} />
          <ToggleField name="notifyViewing" label="New viewing request" checked={n.onViewing} />
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
            Save notifications
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}