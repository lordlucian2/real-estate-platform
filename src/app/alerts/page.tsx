import type { Metadata } from "next";
import { BellRing } from "lucide-react";
import { AlertForm } from "@/components/forms/alert-form";

export const metadata: Metadata = {
  title: "Property Alerts — Don't Keep Searching",
  description:
    "Set a property alert in Liberia. Get a WhatsApp or email notification when matching houses, rooms, apartments or land are added — from a real agent.",
  alternates: { canonical: "/alerts" },
};

export default function AlertsPage() {
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300">
            <BellRing size={28} />
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            Don&apos;t Want to Keep Searching?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">
            Set an alert and I&apos;ll notify you on WhatsApp or email when
            matching properties are added — before anyone else sees them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-xl sm:p-9">
          <AlertForm />
        </div>
      </section>
    </>
  );
}