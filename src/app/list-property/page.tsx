import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { OwnerPropertyForm } from "@/components/forms/owner-property-form";

export const metadata: Metadata = {
  title: "List Your Property — Reach Serious Renters & Buyers",
  description:
    "Have a property to rent or sell in Liberia? Submit it to a real estate agent who verifies every listing and matches it with serious, pre-qualified renters and buyers.",
  alternates: { canonical: "/list-property" },
};

export default function ListPropertyPage() {
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">For property owners</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            Have a Property to Rent or Sell?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">
            Let us help you reach serious renters and buyers. Submit your
            property once — I&apos;ll verify the details and do the marketing.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream-50/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-gold-400" /> Verified before publishing
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={15} className="text-gold-400" /> Serious inquiries only
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-ink-900/5 bg-white p-5 shadow-xl sm:p-10">
          <OwnerPropertyForm />
        </div>
      </section>
    </>
  );
}