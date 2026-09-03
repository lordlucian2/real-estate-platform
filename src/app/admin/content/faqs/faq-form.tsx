"use client";

import { useActionState } from "react";
import { FormGrid, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea } from "@/components/ui";
import type { FaqItem } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function FaqForm({
  faq,
  action,
  isNew,
}: {
  faq: FaqItem;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value={faq.id} />
      <div className="space-y-3">
        <Field label="Question">
          <Input name="question" defaultValue={faq.question} />
        </Field>
        <Field label="Answer">
          <Textarea name="answer" rows={4} defaultValue={faq.answer} />
        </Field>
        <FormGrid>
          <Field label="Order">
            <Input name="order" type="number" defaultValue={faq.order} />
          </Field>
          <div className="pt-6">
            <ToggleField name="published" label="Published" checked={faq.published} />
          </div>
        </FormGrid>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
          {isNew ? "Add FAQ" : "Save FAQ"}
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}