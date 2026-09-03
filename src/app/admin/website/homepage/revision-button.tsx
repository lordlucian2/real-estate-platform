"use client";

import { useActionState } from "react";
import { cmsRestoreHomeRevision } from "@/app/cms-actions";
import { History } from "lucide-react";

export function RestoreRevisionButton({ id }: { id: string }) {
  const [state, action] = useActionState(cmsRestoreHomeRevision.bind(null, id), { ok: false, error: "" });

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={state.ok}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-1.5 text-xs font-semibold text-gold-700 transition-colors hover:border-gold-500 hover:bg-gold-50 disabled:opacity-70"
      >
        <History size={13} />
        {state.ok ? "Restored to draft" : "Restore as draft"}
      </button>
    </form>
  );
}