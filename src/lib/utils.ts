import type { ListingType } from "./types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "$650/month", "$180,000", "$80/night" */
export function formatPrice(
  amount: number,
  currency = "USD",
  listingType: ListingType = "rent",
): string {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const base = `${symbol}${nf.format(amount)}`;
  if (listingType === "short-term") return `${base}/night`;
  if (listingType === "buy") return `${base}`;
  return `${base}/month`;
}

export function formatPriceShort(amount: number): string {
  return `$${nf.format(amount)}`;
}

/** "$650" (no /month or /night suffix) — for UI that labels the unit separately */
export function formatPriceAmount(amount: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${nf.format(amount)}`;
}

/** "2 days ago" style relative time from an ISO date string */
export function relativeTime(iso: string | Date, now = new Date()): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60) return rtf.format(Math.round(seconds), "second");
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  if (abs < 604800) return rtf.format(Math.round(seconds / 86400), "day");
  if (abs < 2592000) return rtf.format(Math.round(seconds / 604800), "week");
  return rtf.format(Math.round(seconds / 2592000), "month");
}

export function formatDate(iso: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return date.toLocaleDateString("en-US", opts ?? { year: "numeric", month: "short", day: "numeric" });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function bytes(n: number): string {
  const kb = Math.round(n / 1024);
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Percentage snapshots, e.g. 92% */
export function pct(n: number): number {
  return Math.round(n * 100);
}