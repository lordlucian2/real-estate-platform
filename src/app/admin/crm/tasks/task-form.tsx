"use client";

import { useActionState } from "react";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Select } from "@/components/ui";
import type { ActionResult } from "@/app/actions";

export function TaskForm({
  action,
  isNew,
}: {
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value="" />
      <div className="flex flex-wrap gap-3">
        <Field label="Title">
          <Input name="title" className="w-64" placeholder="e.g. Follow up on Lake side viewing" />
        </Field>
        <Field label="Category">
          <Select name="category" defaultValue="general" className="w-40">
            <option value="property">Property</option>
            <option value="request">Request</option>
            <option value="viewing">Viewing</option>
            <option value="owner">Owner</option>
            <option value="lead">Lead</option>
            <option value="general">General</option>
          </Select>
        </Field>
        <Field label="Due date">
          <Input name="dueAt" type="date" className="w-40" />
        </Field>
      </div>
      <button type="submit" className="mt-4 rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
        {isNew ? "Add task" : "Save task"}
      </button>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}