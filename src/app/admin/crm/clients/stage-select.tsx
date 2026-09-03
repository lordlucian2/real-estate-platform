"use client";

import { useTransition } from "react";
import type { LeadStage } from "@/lib/types";

export function ClientStageSelect({
  leadId,
  stage,
  act,
}: {
  leadId: string;
  stage: LeadStage;
  act: (id: string, stage: LeadStage) => Promise<unknown>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={stage}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          void act(leadId, e.target.value as LeadStage);
        })
      }
      className="rounded-full border border-ink-900/10 bg-cream-50 px-3 py-1 text-xs font-semibold text-navy-900 focus:border-gold-500 focus:outline-none"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="viewing">Viewing</option>
      <option value="negotiation">Negotiation</option>
      <option value="closed">Closed</option>
      <option value="lost">Lost</option>
    </select>
  );
}