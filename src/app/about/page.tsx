import type { Metadata } from "next";
import Link from "next/link";
import { Award, BadgeCheck, MapPin, Phone, ShieldCheck } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { getSettings } from "@/lib/cms";
import { WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Your Property Agent in Liberia",
  description:
    "Meet a trusted Liberian real estate agent: personally verified properties, honest matching and a human navigator for your property search across Greater Monrovia.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const agent = (await getSettings()).agent;
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">About me</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            More Than Listings. A Person You Can Trust.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream-50/70">
            I help people navigate the property search process by finding
            suitable options, communicating with owners, arranging viewings,
            and helping clients move from searching to securing the right
            property.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          {/* Profile card */}
          <div className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-xl">
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
                <span className="font-display text-8xl font-bold text-gold-400/80">
                  {agent.name.charAt(0)}
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold text-navy-900">{agent.name}</h2>
                <p className="text-sm text-ink-500">{agent.tagline}</p>
                <div className="mt-4 space-y-2 text-sm text-ink-700">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gold-600" /> {agent.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-gold-600" /> {site.city}
                  </p>
                </div>
                <a
                  href={whatsappLink(`Hello ${agent.name}, I found your profile on your website and wanted to reach out.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-white hover:bg-whatsapp-dark"
                >
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold"><Award size={13} /> {agent.experienceYears}+ years experience</Badge>
              <Badge tone="green"><BadgeCheck size={13} /> {agent.credential}</Badge>
            </div>

            <div className="mt-6">
              <h3 className="font-display text-2xl font-semibold text-navy-900">Who I am</h3>
              <p className="mt-3 leading-relaxed text-ink-700">{agent.bio}</p>
            </div>

            <div className="mt-8 rounded-3xl border border-gold-500/25 bg-gold-100/40 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-600">My philosophy</p>
              <p className="mt-3 font-display text-xl font-medium italic leading-relaxed text-navy-900">
                “{agent.philosophy}”
              </p>
            </div>

            {/* Craft promise */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(agent.services && agent.services.length > 0
                ? agent.services
                : [
                    { title: "Verify before I show", description: "Every listing states when it was last confirmed. Unverified, I tell you it's unverified." },
                    { title: "Match to your life", description: "Budget, family size, schools, work route — I match the place, not just the price." },
                    { title: "Know the areas", description: "I know the streets, the owners and the real market in each neighborhood I serve." },
                    { title: "Stay reachable", description: "WhatsApp is open. Days and evenings, I'm one message away during business hours." },
                  ]
              ).map((c, idx) => {
                const Icon = [ShieldCheck, BadgeCheck, MapPin, Phone, Award][idx % 5];
                return (
                  <div key={idx} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                    <Icon size={20} className="text-gold-600" />
                    <h4 className="mt-3 font-semibold text-navy-900">{c.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{c.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Areas served */}
            <div className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-navy-900">Areas I serve</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.areasServed.map((a) => (
                  <Link
                    key={a}
                    href={`/locations/${a.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-cream-100 px-3.5 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:text-gold-700"
                  >
                    {a}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/find" className="inline-flex h-12 items-center justify-center rounded-full bg-gold-500 px-7 text-sm font-bold text-navy-900 hover:bg-gold-400">
                Start Your Search
              </Link>
              <Link href="/list-property" className="inline-flex h-12 items-center justify-center rounded-full border border-ink-900/15 px-7 text-sm font-semibold text-navy-900 hover:border-gold-500 hover:text-gold-700">
                I have a property to list
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export const dynamic = "force-dynamic";
