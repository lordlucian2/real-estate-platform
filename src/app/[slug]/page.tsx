import { notFound } from "next/navigation";
import { getPages, getFaqs, getSettings } from "@/lib/cms";
import { getAllProperties } from "@/lib/store";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { CustomPage, CustomPageSection } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CustomPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug && p.published);
  if (!page) notFound();

  return (
    <main className="bg-cream-50">
      {page.sections.filter((s) => s.enabled !== false).map((s) => <SectionBlock key={s.id} page={page} section={s} />)}
    </main>
  );
}

async function SectionBlock({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  switch (section.kind) {
    case "hero":
      return <HeroSection page={page} section={section} />;
    case "text":
      return <TextSection page={page} section={section} />;
    case "image":
      return <ImageSection page={page} section={section} />;
    case "html":
      return <HtmlSection page={page} section={section} />;
    case "faq":
      return <FaqSection page={page} section={section} />;
    case "cta":
    case "whatsapp-cta":
      return <CtaSection page={page} section={section} />;
    case "contact-form":
      return <ContactSection page={page} section={section} />;
    case "property-grid":
      return <PropertyGridSection page={page} section={section} />;
    default:
      return null;
  }
}

type CmsSectionData = Record<string, unknown>;

interface CtaButton {
  label?: string;
  href?: string;
}

function sectionData(section: CustomPageSection): CmsSectionData {
  return (section.data || {}) as CmsSectionData;
}

function strData(d: CmsSectionData, key: string, fallback = ""): string {
  const v = d[key];
  return typeof v === "string" ? v : fallback;
}

function numData(d: CmsSectionData, key: string, fallback = 0): number {
  const v = d[key];
  return typeof v === "number" ? v : fallback;
}

function HeroSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  const eyebrow = typeof d.eyebrow === "string" ? d.eyebrow : undefined;
  const heading = typeof d.heading === "string" ? d.heading : page.title;
  const subtitle = typeof d.subtitle === "string" ? d.subtitle : undefined;
  const buttons = Array.isArray(d.buttons) ? (d.buttons as CtaButton[]) : undefined;
  return (
    <section className="relative bg-navy-950 px-6 py-20 text-center lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 to-navy-950" />
      <div className="relative mx-auto max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{eyebrow}</p> : null}
        <h1 className="mt-3 font-display text-4xl text-cream-50 lg:text-6xl">{heading}</h1>
        {subtitle ? <p className="mt-5 text-lg text-cream-100/85">{subtitle}</p> : null}
        {buttons ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {buttons.map((b, i) =>
              b?.href ? (
                <Link
                  key={i}
                  href={b.href}
                  className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-gold-400"
                >
                  {b.label || "Learn more"}
                </Link>
              ) : null
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TextSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="font-display text-3xl text-navy-900">{section.title}</h2>
      {strData(d, "body") ? (
        <div className="prose prose-navy mt-6 text-ink-600" dangerouslySetInnerHTML={{ __html: strData(d, "body") }} />
      ) : null}
    </section>
  );
}

function ImageSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  const src = strData(d, "src");
  return src ? (
    <section className="px-6 py-16">
      <span className="block overflow-hidden rounded-3xl border border-cream-200 bg-white">
        <span className="block aspect-[16/7] w-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
      </span>
      {strData(d, "caption") ? <p className="mt-3 text-center text-sm text-ink-400">{strData(d, "caption")}</p> : null}
    </section>
  ) : null;
}

function HtmlSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  return <section className="mx-auto max-w-4xl px-6 py-8" dangerouslySetInnerHTML={{ __html: strData(d, "html") }} />;
}

async function FaqSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const faqs = (await getFaqs()).filter((f) => f.published).sort((a, b) => a.order - b.order);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="font-display text-3xl text-navy-900">{section.title || "Frequently asked questions"}</h2>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details key={f.id} className="group rounded-2xl border border-cream-200 bg-white p-5">
            <summary className="cursor-pointer list-none font-semibold text-navy-900">{f.question}</summary>
            <p className="mt-3 text-ink-600">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

async function CtaSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  const number = (await getSettings()).whatsapp.number;
  const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(strData(d, "message", "Hello!"))}` : "#";
  return (
    <section className="bg-navy-950 px-6 py-16 text-center">
      <h2 className="font-display text-3xl text-cream-50">{section.title || "Get in touch"}</h2>
      {strData(d, "subtitle") ? <p className="mx-auto mt-3 max-w-xl text-cream-100/80">{strData(d, "subtitle")}</p> : null}
      <Link href={url} className="mt-8 inline-flex rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
        Chat on WhatsApp
      </Link>
    </section>
  );
}

async function ContactSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const settings = await getSettings();
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h2 className="font-display text-3xl text-navy-900">{section.title || "Leave a message"}</h2>
      <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-6">
        <p className="text-sm text-ink-500">
          Message <span className="font-semibold text-navy-900">{settings.general.name}</span> on{" "}
          <Link href={`https://wa.me/${settings.whatsapp.number}`} className="font-semibold text-gold-700 hover:underline">
            WhatsApp
          </Link>{" "}
          or email <Link href={`mailto:${settings.general.email}`} className="font-semibold text-gold-700 hover:underline">{settings.general.email}</Link>.
        </p>
      </div>
    </section>
  );
}

async function PropertyGridSection({ page, section }: { page: CustomPage; section: CustomPageSection }) {
  const d = sectionData(section);
  const limit = numData(d, "limit", 6);
  const props = (await getAllProperties())
    .filter((p) => ["available", "rented", "sold"].includes(p.status))
    .slice(0, limit);
  if (props.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-3xl text-navy-900">{section.title || "Properties"}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {props.map((p) => (
          <Link
            key={p.id}
            href={`/properties/${p.slug || p.id}`}
            className="group rounded-2xl border border-cream-200 bg-white p-4 hover:border-gold-500/50"
          >
            <span className="block overflow-hidden rounded-xl bg-cream-100">
              <span className="block aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]?.url || ""})` }} />
            </span>
            <span className="mt-3 block font-semibold text-navy-900">{p.title}</span>
            <span className="mt-1 block text-sm text-ink-400">{p.locationId || p.type}</span>
            <span className="mt-2 block text-sm font-semibold text-gold-700">{formatPrice(p.price)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}