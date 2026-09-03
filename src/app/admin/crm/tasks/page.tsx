import { getTasks } from "@/lib/cms";
import { cmsSaveTask, cmsToggleTask, cmsDeleteTask } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { TaskForm } from "./task-form";
import { TaskCheckbox, TaskDelete } from "./task-controls";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = (await getTasks()).sort((a, b) => (a.status === "done" ? 1 : -1) - (b.status === "done" ? 1 : -1));

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="CRM"
        title="Tasks"
        description="Small follow-ups tied to properties, requests, viewings, owners and leads."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <AdminCard title="Add a task">
          <TaskForm action={cmsSaveTask as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} isNew />
        </AdminCard>

        <AdminCard title={`${tasks.length} task${tasks.length === 1 ? "" : "s"}`}>
          {tasks.length === 0 ? (
            <p className="text-sm text-ink-400">No tasks yet — add one above.</p>
          ) : (
            <ul className="divide-y divide-ink-900/5">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <TaskCheckbox id={t.id} status={t.status} act={cmsToggleTask} />
                    <div>
                      <p className={`text-sm font-semibold ${t.status === "done" ? "text-ink-400 line-through" : "text-navy-900"}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-ink-400">
                        {t.category}
                        {t.dueAt ? ` · due ${new Date(t.dueAt).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TaskDelete id={t.id} act={cmsDeleteTask} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}