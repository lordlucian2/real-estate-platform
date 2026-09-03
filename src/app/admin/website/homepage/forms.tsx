"use client";

import { useActionState } from "react";
import { cmsPublishHome, cmsDiscardHomeDraft } from "@/app/cms-actions";
import { CheckCircle2, RotateCcw } from "lucide-react";

export function PublishHomeForm() {
  const [state, action] = useActionState(cmsPublishHome, { ok: false, error: "" });
  return (
    <form action={action}>
      <button
        type="submit"
        disabled={state.ok}
        className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-70"
      >
        {state.ok ? <CheckCircle2 size={15} /> : null}
        {state.ok ? "Published" : "Publish draft now"}
      </button>
    </form>
  );
}

export function ResetDraftForm() {
  const [state, action] = useActionState(cmsDiscardHomeDraft, { ok: false, error: "" });
  return (
    <form action={action}>
      <button
        type="submit"
        disabled={state.ok}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-gold-500 hover:text-gold-700 disabled:opacity-70"
      >
        <RotateCcw size={14} /> {state.ok ? "Reset" : "Reset draft to published"}
      </button>
    </form>
  );
}