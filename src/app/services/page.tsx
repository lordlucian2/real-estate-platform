import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Building2, Home, Landmark, Search, Store, Trees, Users } from "lucide-react";
import { agent } from "@/lib/site";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "What I Help With — Property Services in Liberia",
  description:
    "House rentals, room rentals, property sales, apartments, commercial properties, land, property sourcing, marketing, viewing coordination and tenant/buyer matching in Liberia.",
  alternates: { canonical: "/services" },
};

const iconFor = (i: number) =>
  [Home, BedDouble, Trees, Building2, Landmark, Store, Search, Users, Search, Users][i % 10];

export default function ServicesPage() {
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Services</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            What I Help With
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">
            Whatever you need — renting, buying, sourcing or marketing — it
            goes through one person who verifies, coordinates and follows
            through.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agent.services.map((s, i) => {
            const Icon = iconFor(i);
            return (
              <div key={s.title} className="group rounded-2xl border border-ink-900/5 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl texture-card p-8 text-center sm:p-12">
          <SectionHeading
            tone="dark"
            title="Not sure where to start?"
            subtitle="Describe what you need in plain words and I'll point you in the right direction."
          />
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/find" className="inline-flex h-12 items-center justify-center rounded-full bg-gold-500 px-8 text-sm font-bold text-navy-900 hover:bg-gold-400">
              Tell Me What You Need
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-semibold text-cream-50 hover:border-gold-400 hover:text-gold-200">
              Contact {agent.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}