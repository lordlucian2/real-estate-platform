"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Trash2, BadgeCheck } from "lucide-react";
import {
  adminUpdateRequest,
  adminUpdateViewing,
  adminUpdateLead,
  adminUpdateOwner,
  adminPromoteOwnerToProperty,
  adminSetPropertyStatus,
  adminToggleVerified,
  adminDeleteProperty,
  type ActionResult,
} from "@/app/actions";
import type { LeadStage, OwnerSubmission, Property, PropertyStatus, RequestStatus, ViewingRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

function StatusSelect({
  value,
  options,
  onChange,
  tone = "neutral",
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (next: string) => Promise<ActionResult>;
  tone?: "neutral" | "gold" | "green" | "amber" | "red";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={value}
        disabled={busy}
        onChange={async (e) => {
          setBusy(true);
          await onChange(e.target.value);
          router.refresh();
          setBusy(false);
        }}
        className={cn(
          "cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold outline-none",
          tone === "green" && "border-success/20 bg-success/10 text-success",
          tone === "gold" && "border-gold-500/30 bg-gold-100 text-gold-700",
          tone === "amber" && "border-warning/30 bg-warning/10 text-warning",
          tone === "red" && "border-danger/30 bg-danger/10 text-danger",
          tone === "neutral" && "border-ink-900/10 bg-cream-100 text-ink-700",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {busy ? <Loader2 size={13} className="animate-spin text-ink-400" /> : null}
    </span>
  );
}

export function RequestStatusControl({
  requestId,
  status,
}: {
  requestId: string;
  status: RequestStatus;
}) {
  const tones: Record<string, string> = {
    new: "amber",
    searching: "neutral",
    matches_found: "gold",
    viewing_scheduled: "green",
    closed: "red",
  };
  return (
    <StatusSelect
      value={status}
      tone={tones[status] as "amber" | "neutral" | "gold" | "green" | "red"}
      options={[
        { value: "new", label: "New" },
        { value: "searching", label: "Searching" },
        { value: "matches_found", label: "Matches Found" },
        { value: "viewing_scheduled", label: "Viewing Scheduled" },
        { value: "closed", label: "Closed" },
      ]}
      onChange={(s) => adminUpdateRequest(requestId, { status: s as RequestStatus })}
    />
  );
}

export function ViewingStatusControl({
  viewingId,
  status,
}: {
  viewingId: string;
  status: ViewingRequest["status"];
}) {
  const tones: Record<string, string> = {
    new: "amber",
    contacted: "neutral",
    confirmed: "green",
    done: "gold",
    lost: "red",
  };
  return (
    <StatusSelect
      value={status}
      tone={tones[status] as "amber" | "neutral" | "green" | "gold" | "red"}
      options={[
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "confirmed", label: "Confirmed" },
        { value: "done", label: "Done" },
        { value: "lost", label: "Lost" },
      ]}
      onChange={(s) => adminUpdateViewing(viewingId, s as ViewingRequest["status"])}
    />
  );
}

export function LeadStageControl({ leadId, stage }: { leadId: string; stage: LeadStage }) {
  const tones: Record<string, string> = {
    new: "amber",
    contacted: "neutral",
    viewing: "gold",
    negotiation: "green",
    closed: "gold",
    lost: "red",
  };
  return (
    <StatusSelect
      value={stage}
      tone={tones[stage] as "amber" | "neutral" | "gold" | "green" | "red"}
      options={[
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "viewing", label: "Viewing" },
        { value: "negotiation", label: "Negotiation" },
        { value: "closed", label: "Closed" },
        { value: "lost", label: "Lost" },
      ]}
      onChange={(s) => adminUpdateLead(leadId, s as LeadStage)}
    />
  );
}

export function OwnerStatusControl({
  submissionId,
  status,
}: {
  submissionId: string;
  status: OwnerSubmission["status"];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <StatusSelect
        value={status}
        tone={status === "pending_review" ? "amber" : status === "contacted" ? "neutral" : status === "verified" ? "green" : "red"}
        options={[
          { value: "pending_review", label: "Pending Review" },
          { value: "contacted", label: "Contacted" },
          { value: "verified", label: "Verified" },
          { value: "rejected", label: "Rejected" },
        ]}
        onChange={(s) => adminUpdateOwner(submissionId, s as OwnerSubmission["status"])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await adminPromoteOwnerToProperty(submissionId);
          if (res.ok) router.push("/admin/properties");
          else alert(res.error);
          setBusy(false);
        }}
        className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-navy-800"
      >
        {busy ? <Loader2 size={12} className="animate-spin" /> : <BadgeCheck size={12} />} Publish
      </button>
    </div>
  );
}

export function PropertyStatusControl({ property }: { property: Property }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(status: PropertyStatus): Promise<ActionResult> {
    setBusy(status);
    const res = await adminSetPropertyStatus(property.id, status);
    setBusy(null);
    router.refresh();
    return res;
  }

  const statusTone =
    property.status === "available"
      ? "green"
      : property.status === "rented" || property.status === "sold"
        ? "gold"
        : property.status === "unavailable"
          ? "amber"
          : "red";

  return (
    <div className="flex items-center gap-2">
      <StatusSelect
        value={property.status}
        tone={statusTone as "green" | "gold" | "amber" | "red"}
        options={[
          { value: "available", label: "Available" },
          { value: "unavailable", label: "Unavailable" },
          { value: "rented", label: "Rented" },
          { value: "sold", label: "Sold" },
          { value: "archived", label: "Archived" },
        ]}
        onChange={(s) => setStatus(s as PropertyStatus)}
      />
      <button
        type="button"
        disabled={busy !== null}
        onClick={async () => {
          setBusy("verify");
          await adminToggleVerified(property.id);
          router.refresh();
          setBusy(null);
        }}
        title="Toggle verification"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
          property.verificationStatus === "verified"
            ? "border-success/20 bg-success/10 text-success"
            : "border-ink-900/10 bg-cream-100 text-ink-600 hover:border-gold-500 hover:text-gold-700",
        )}
      >
        {busy === "verify" ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        {property.verificationStatus === "verified" ? "Verified" : property.verificationStatus === "recently_checked" ? "Re-checked" : "Unverified"}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={async () => {
          if (!confirm(`Delete "${property.title}"? This can't be undone.`)) return;
          setBusy("delete");
          await adminDeleteProperty(property.id);
          router.refresh();
          setBusy(null);
        }}
        className="inline-flex items-center rounded-full border border-danger/20 p-1.5 text-danger hover:bg-danger/10"
        title="Delete property"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export { StatusSelect };