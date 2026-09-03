"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-ink-900/5 bg-white px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gold-600">{eyebrow}</p>
          ) : null}
          <h1 className="font-display text-2xl font-semibold text-navy-900">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-sm text-ink-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-ink-900/5 bg-white p-5 sm:p-6", className)}>
      {title ? <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      {title || description ? <div className="my-4 h-px bg-ink-900/5" /> : null}
      {children}
    </section>
  );
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

export function ToggleField({
  name,
  label,
  hint,
  checked,
}: {
  name: string;
  label: string;
  hint?: string;
  checked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-ink-900/10 bg-cream-50/50 p-4">
      <div>
        <p className="text-sm font-semibold text-navy-900">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-ink-500">{hint}</p> : null}
      </div>
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          name={name}
          defaultChecked={checked}
          className="peer sr-only"
          id={name}
        />
        <label
          htmlFor={name}
          className="relative h-6 w-11 cursor-pointer rounded-full bg-ink-900/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-gold-500 peer-checked:after:translate-x-5"
        />
      </span>
    </label>
  );
}

export function ListTextarea({
  name,
  value,
  rows = 3,
}: {
  name: string;
  value: string[];
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      rows={rows}
      defaultValue={value.join("\n")}
      className="w-full rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
      placeholder="One per line"
    />
  );
}

export function JsonTextarea({
  name,
  value,
  rows = 8,
  hint,
}: {
  name: string;
  value: unknown;
  rows?: number;
  hint?: string;
}) {
  const pretty = value == null ? "" : JSON.stringify(value, null, 2);
  return (
    <div>
      <textarea
        name={name}
        rows={rows}
        defaultValue={pretty}
        className="w-full rounded-xl border border-ink-900/10 bg-ink-950/5 px-3.5 py-2.5 font-mono text-xs text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
      />
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function SubmitBar({ label = "Save Changes", hint }: { label?: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-900/5 bg-white px-4 py-4 sm:px-6">
      {hint ? <p className="mr-auto text-xs text-ink-400">{hint}</p> : null}
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
      >
        {label}
      </button>
    </div>
  );
}

export function ActionFeedback({ state }: { state: { ok: boolean; error?: string; message?: string } }) {
  if (state.ok) {
    return (
      <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
        {state.message ?? "Saved"}
      </p>
    );
  }
  if (state.error) {
    return (
      <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
        {state.error}
      </p>
    );
  }
  return null;
}