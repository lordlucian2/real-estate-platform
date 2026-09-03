import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, agent, whatsappLink } from "@/lib/site";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact — Your Property Agent in Liberia",
  description:
    "Contact your property agent in Monrovia, Liberia. WhatsApp, call or send a message — replies come from a real person, usually the same day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Contact</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            Let&apos;s Talk About Your Place
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">
            Because I work directly with clients, the quickest way to reach me
            is WhatsApp — but every channel below lands in the same inbox.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <a
              href={whatsappLink(`Hello ${agent.name}, I'd like to talk about finding a property.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-lg"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-whatsapp text-white">
                <WhatsAppIcon size={24} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">WhatsApp</span>
                <span className="block text-sm text-ink-500">Reply within business hours</span>
              </span>
              <span className="ml-auto rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-700">
                Fastest
              </span>
            </a>

            <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm transition-colors hover:border-gold-500">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Phone size={22} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{site.phoneDisplay}</span>
                <span className="block text-sm text-ink-500">{site.hours}</span>
              </span>
            </a>

            <a href={`mailto:${agent.email}`} className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm transition-colors hover:border-gold-500">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Mail size={22} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{agent.email}</span>
                <span className="block text-sm text-ink-500">For documents and details</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <MapPin size={22} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{site.city}</span>
                <span className="block text-sm text-ink-500">Serving {agent.areasServed.join(", ")}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Clock size={22} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">Reply time</span>
                <span className="block text-sm text-ink-500">Usually the same business day</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-xl sm:p-9">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Send a message</h2>
            <p className="mt-1 text-sm text-ink-500">
              A real person reads these — not an auto-reply.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}