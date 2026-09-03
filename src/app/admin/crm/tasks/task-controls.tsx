"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import type { AdminTask } from "@/lib/types";

export function TaskCheckbox({
  id,
  status,
  act,
}: {
  id: string;
  status: AdminTask["status"];
  act: (id: string, status: AdminTask["status"]) => Promise<unknown>;
}) {
  const [isPending, startTransition] = useTransition();
  const done = status === "done";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          void act(id, done ? "todo" : "done");
        })
      }
      className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
        done ? "border-success bg-success text-white" : "border-ink-300 text-transparent hover:border-gold-500"
      }`}
      aria-label={done ? "Mark as not done" : "Mark as done"}
    >
      <Check size={12} strokeWidth={3} />
    </button>
  );
}

export function TaskDelete({
  id,
  act,
}: {
  id: string;
  act: (id: string) => Promise<unknown>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          void act(id);
        })
      }
      className="rounded-full border border-transparent p-1.5 text-ink-400 hover:border-danger/30 hover:text-danger"
      aria-label="Delete task"
    >
      <Trash2 size={15} />
    </button>
  );
}