"use client";

import { useActionState } from "react";
import { FormGrid, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Select } from "@/components/ui";
import type { AdminUser } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function UserForm({
  user,
  action,
  isNew,
}: {
  user: AdminUser;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value={user.id} />
      <FormGrid>
        <Field label="Display name">
          <Input name="name" defaultValue={user.name} />
        </Field>
        <Field label="Username (sign-in)">
          <Input name="username" defaultValue={user.username} autoComplete="off" />
        </Field>
        <Field label="Role">
          <Select name="role" defaultValue={user.role}>
            <option value="owner">Owner (full access)</option>
            <option value="admin">Admin (inventory + CRM)</option>
            <option value="editor">Editor (content only)</option>
          </Select>
        </Field>
        <Field label={`Password${isNew ? "" : " (leave blank to keep current)"}`}>
          <Input name="password" type="password" autoComplete="new-password" placeholder="••••••••" />
        </Field>
      </FormGrid>
      <div className="mt-4">
        <ToggleField name="active" label="Active (can sign in)" checked={user.active} />
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
          {isNew ? "Add user" : "Save user"}
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}