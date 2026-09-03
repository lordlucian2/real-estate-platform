"use client";

import { useActionState } from "react";
import { AdminCard, ActionFeedback } from "@/components/admin/admin-ui";
import { cmsChangePassword } from "@/app/cms-actions";
import type { ActionResult } from "@/app/actions";

export function ChangePasswordCard() {
  const [state, formAction] = useActionState(cmsChangePassword, { ok: false, error: "" });

  return (
    <AdminCard
      title="Change my password"
      description="Update the password for the account you're signed in with. Minimum 8 characters."
    >
      <form action={formAction} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-600">Current password</span>
          <input
            type="password"
            name="current"
            required
            className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-600">New password</span>
          <input
            type="password"
            name="next"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
        </label>
        <p className="text-xs text-ink-400">After changing, you&apos;ll use the new password next time you sign in.</p>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Update password
          </button>
        </div>
        <ActionFeedback state={state} />
      </form>
    </AdminCard>
  );
}