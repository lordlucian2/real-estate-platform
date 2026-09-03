import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyRequestForm } from "@/components/forms/property-request-form";
import { whatsappLink, site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tell Me What You Need — Personal Property Search",
  description:
    "Share your budget, location and requirements and a real Liberian property agent will find suitable houses, rooms, apartments, land or commercial spaces for you — verified before you view.",
};

export default function FindPage() {
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] uppercase text-gold-300">
            Tell me what you need
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            Can&apos;t Find What You&apos;re Looking For?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">
            Tell us what you need and we&apos;ll help you search. No endless
            scrolling — just a real person finding real options for you.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream-50/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-gold-400" /> Verified options only
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} className="text-gold-400" /> Personal matching
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="rounded-3xl border border-ink-900/5 bg-white p-5 shadow-xl sm:p-10">
            <Suspense>
              <PropertyRequestForm />
            </Suspense>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-cream-50">
              <h3 className="font-display text-xl font-semibold">What happens next?</h3>
              <ul className="mt-4 space-y-3 text-sm text-cream-50/75">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>I receive your request and add it to my search queue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>I match it against my verified inventory and my owner network.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>I contact you with options that genuinely fit — usually within days.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>We arrange viewings and go from searching to securing.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gold-500/25 bg-gold-100/40 p-6">
              <h3 className="font-display text-xl font-semibold text-navy-900">Prefer to message?</h3>
              <p className="mt-2 text-sm text-ink-500">
                Send me the same details over WhatsApp and I&apos;ll respond
                personally.
              </p>
              <a
                href={whatsappLink(`Hello ${site.shortName.split("—")[0].trim()}, I need help finding a property.\n\nWhat I need:\nLocation:\nBudget:\nMove-in:`) }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-whatsapp-dark"
              >
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}