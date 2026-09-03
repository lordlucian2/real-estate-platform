import { getUsers } from "@/lib/cms";
import { cmsSaveUser, cmsDeleteUser } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { UserForm } from "./user-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function UsersSettingsPage() {
  const users = await getUsers();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Settings"
        title="Team & Roles"
        description="Manage who can access the Command Center and what they can edit. Roles: owner (everything), admin (inventory + CRM), editor (content only)."
      />
      <div className="space-y-6 p-4 sm:p-6">
        {users.map((u) => (
          <AdminCard key={u.id} title={u.name}>
            <UserForm user={u} action={cmsSaveUser as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
            {u.role !== "owner" ? (
              <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
                <form
                  action={async () => {
                    "use server";
                    await cmsDeleteUser(u.id);
                  }}
                >
                  <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                    Remove user
                  </button>
                </form>
              </div>
            ) : null}
          </AdminCard>
        ))}

        <AdminCard title="Add a team member">
          <UserForm
            user={{ id: "", name: "", username: "", role: "editor", active: true, passwordHash: "", createdAt: new Date().toISOString() }}
            action={cmsSaveUser as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            isNew
          />
        </AdminCard>
      </div>
    </div>
  );
}