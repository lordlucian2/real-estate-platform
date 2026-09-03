# Eric Realty — Personal Real Estate Agent Platform

A premium, mobile-first real-estate platform for a Liberian property agent.
Built as a **trusted personal property concierge** — not a generic listing site.

> **Find a place that fits your life.** Houses, rooms, apartments, land and
> commercial properties — carefully sourced and personally matched.

## Product pillars

- **Discovery** — browse verified properties, or let the agent do the searching
- **Human assistance** — the "Tell Me What You Need" concierge form
- **Verification** — every listing carries a status + `last_verified_at` timestamp
- **Matching** — an engine scores inventory against each client request (92% Match + reasons)
- **Communication** — WhatsApp-first: prefilled deep links on every property
- **Operating system** — a full admin dashboard for the agent's business

## Tech stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Server Actions for all mutations
- JSON runtime store (`.data/`) — swap-ready for PostgreSQL via the included
  [Prisma schema](prisma/schema.prisma)
- Cloudinary-ready image upload layer (`next-cloudinary`)
- SEO: dynamic metadata, Open Graph, JSON-LD, sitemap.xml, robots.txt

## Quick start

```bash
npm install
cp .env.example .env.local      # then edit values
npm run dev                     # http://localhost:3000
```

The app is fully functional with zero configuration — seed inventory ships in
`src/lib/data.ts` and form submissions persist to `.data/`.

## Layout

```
src/
  app/            Routes: home, properties, rent, buy, find, list-property,
                  locations, alerts, about, services, contact, saved, admin/*
  components/
    site/         Header, footer, floating WhatsApp, mobile bottom nav
    home/         Hero, search, sections, location/type grids
    property/     Cards, gallery, browser, favorite/saved
    forms/        Request, viewing, owner, alert, contact forms
    admin/        Dashboard nav, login, status controls, property form
  lib/
    store.ts      Runtime data layer (JSON) — swap for Prisma later
    matching.ts   Smart property-matching engine
    data.ts       Seed inventory + label maps
    locations.ts  Neighborhood data (Sinkor, Paynesville, Congo Town…)
    site.ts       Agent contact + WhatsApp config — EDIT ME
    types.ts      Shared entity types
prisma/
  schema.prisma   Production PostgreSQL schema
```

## Configuration

| Where | What |
| --- | --- |
| `src/lib/site.ts` | Agent name, phone, **WhatsApp number**, domain |
| `.env.local` | `ADMIN_PASSWORD` (admin login), `NEXT_PUBLIC_SITE_URL` |
| `prisma/schema.prisma` | Production DB schema (when moving off the JSON store) |

## Admin

- URL: `/admin` — password: `monrovia2026` (change via `ADMIN_PASSWORD`)
- Property CRUD, client requests with smart matches, viewings, leads pipeline,
  owner submissions, property alerts, verification controls

## Going to production

1. Point `NEXT_PUBLIC_SITE_URL` + `site.domain` at the real domain.
2. Set real contact details in `src/lib/site.ts`.
3. Move to PostgreSQL: set `DATABASE_URL`, run `npx prisma db push`, and rewrite
   `src/lib/store.ts` to query Prisma (same public API).
4. Enable Cloudinary uploads with `CLOUDINARY_*` keys.

## SEO routes

- `/properties/3-bedroom-house-paynesville` — clean property URLs
- `/rent/rooms/sinkor`, `/buy/land/brewerville` — category × location pages
- `/locations/paynesville` — neighborhood pages
- `sitemap.xml` + `robots.txt` auto-generated