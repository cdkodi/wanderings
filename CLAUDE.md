# CLAUDE.md — Our Wanderings

> This file is read by Claude Code at the start of every session.
> Keep it up to date as the project evolves.

---

## Project Overview

**Our Wanderings** is a personal travel journal website for documenting trips, photos, and memories.
It is a single-owner site — one admin (CD) manages all content; family and friends access it read-only.

The full PRD lives in `docs/PRD.md`. When in doubt about a feature, check there first.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| Database | SQLite via Drizzle ORM (local dev) · Turso (production) |
| File / Photo Storage | Cloudinary (account configured, cloud name: `dwj2rey6u`) |
| Auth | NextAuth.js — Google OAuth, admin-only *(Phase 3 — not yet built)* |
| Deployment | Vercel |
| Node version | v18.20.3 via nvm |
| Package manager | npm |

### Additional packages installed (beyond original scaffold)

| Package | Version | Purpose |
|---|---|---|
| `react-markdown` | ^10.1.0 | Render trip story and tips as HTML |
| `remark-gfm` | ^4.0.1 | GitHub-flavoured Markdown plugin |
| `rehype-sanitize` | ^6.0.0 | XSS sanitisation for markdown output |
| `@tailwindcss/typography` | ^0.5.19 | `prose` classes for markdown sections |
| `cloudinary` | ^2.9.0 | Server-side Cloudinary SDK (delete, URL generation) |

---

## Key Commands

```bash
# Development
npm run dev               # Start dev server on http://localhost:3000

# Database
npm run db:generate       # Generate Drizzle migrations from schema changes
npm run db:push           # Push schema directly to SQLite (dev only)
npm run db:migrate        # Run pending migrations
npm run db:studio         # Open Drizzle Studio at https://local.drizzle.studio
npm run db:seed           # Seed the DB with sample trips, stays, activities, photos

# Build & checks
npm run build             # Production build
npm run lint              # ESLint
npm run typecheck         # tsc --noEmit
```

---

## Project Structure

This is the **actual current state** of the repo — not the PRD's aspirational structure.
Files listed here exist; everything else still needs to be built.

```
wanderings/
├── app/
│   ├── admin/
│   │   ├── (protected)/         # Route group — all routes here require auth
│   │   │   ├── layout.tsx       # Auth guard — redirects to /admin/login if no session
│   │   │   ├── page.tsx         # Admin dashboard — all trips
│   │   │   ├── trips/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [slug]/edit/page.tsx
│   │   │   └── photos/page.tsx
│   │   └── login/
│   │       └── page.tsx         # Login form — outside auth guard, uses root layout
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── trips/route.ts       # GET (admin list) + POST
│   │   ├── trips/[slug]/route.ts # PUT + DELETE
│   │   ├── photos/route.ts      # POST
│   │   └── photos/[id]/route.ts # PUT + DELETE
│   ├── trips/
│   │   └── [slug]/
│   │       └── page.tsx         # Trip detail — all 8 sections + OG meta
│   ├── gallery/
│   │   └── page.tsx             # Photo gallery — region groups + filter tabs + OG meta
│   ├── journal/
│   │   └── page.tsx             # Journal — trips newest first, excerpts + OG meta
│   ├── layout.tsx               # Root layout — Nav component, fonts, footer
│   ├── page.tsx                 # Home — hero + stats + trip card grid
│   └── globals.css              # Base resets + font vars + scrollbar-hide utility
├── components/
│   ├── Nav.tsx                  # 'use client' — logo + links + mobile hamburger
│   ├── TripCard.tsx             # 'use client' — card with hover lift, emoji fallback
│   ├── JournalEntry.tsx         # Server — trip row: year sidebar, thumbnail, excerpt, pills
│   ├── MarkdownRenderer.tsx     # 'use client' — react-markdown + remark-gfm + rehype-sanitize
│   ├── PhotoStrip.tsx           # 'use client' — horizontal scrollable row, opens Lightbox on click
│   ├── Lightbox.tsx             # 'use client' — full-screen overlay, prev/next, ESC/arrow keys
│   ├── GalleryGrid.tsx          # 'use client' — filter tabs + square grid + hover captions + Lightbox
│   ├── AdminTripForm.tsx        # 'use client' — full trip create/edit form (story, stays, activities)
│   ├── PhotoUploader.tsx        # 'use client' — Cloudinary Upload Widget wrapper
│   ├── DeleteTripButton.tsx     # 'use client' — confirm + DELETE /api/trips/[slug]
│   ├── DeletePhotoButton.tsx    # 'use client' — confirm + DELETE /api/photos/[id]
│   ├── EditCaptionForm.tsx      # 'use client' — inline caption edit + PUT /api/photos/[id]
│   └── SignOutButton.tsx        # 'use client' — calls next-auth signOut()
├── lib/
│   ├── db/
│   │   ├── schema.ts            # Drizzle table definitions + type exports
│   │   ├── index.ts             # DB client singleton (better-sqlite3 + Drizzle)
│   │   └── seed.ts              # Sample data — 3 trips, 6 stays, 20 activities, 10 photos
│   ├── auth.ts                  # NextAuth authOptions — Credentials provider, JWT sessions
│   ├── cloudinary.ts            # Server-side: deleteImage(), buildImageUrl()
│   └── utils.ts                 # slugify(), formatDate()
├── public/
├── docs/
│   └── PRD.md
├── wanderings.db                # Local SQLite file (gitignored)
├── .env.local                   # Credentials (gitignored — see env vars section)
├── drizzle.config.ts
├── next.config.mjs              # Note: .mjs not .ts — Cloudinary remote pattern configured
├── tailwind.config.ts
└── CLAUDE.md
```

---

## Database Schema

Four tables. All DB access goes through `lib/db/index.ts` — never import Drizzle directly in pages or components.

### `trips`
| Column | Type | Notes |
|---|---|---|
| id | integer PK | auto-increment |
| slug | text unique | URL identifier, auto-generated from title |
| title | text | Display name e.g. "Kyoto & Tokyo" |
| country | text | |
| region | text | Used for gallery filter grouping |
| year | integer | |
| month | text | |
| duration | text | e.g. "12 days" |
| travel_with | text | e.g. "Family" |
| story | text | Full narrative — Markdown |
| tips | text | Travel advice — Markdown |
| emoji | text | Single emoji fallback for missing cover |
| cover_image_url | text | Cloudinary URL |
| published | boolean | Default false — drafts hidden from public |
| created_at | datetime | |
| updated_at | datetime | |

### `stays`
| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| name | text | Property name |
| description | text | Personal notes / mini review |
| location | text | City or area |
| sort_order | integer | For multiple stays per trip |

### `activities`
| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| name | text | |
| sort_order | integer | |

### `photos`
| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| cloudinary_id | text | Cloudinary public_id |
| url | text | Full Cloudinary URL |
| caption | text | |
| taken_at | datetime | nullable |
| sort_order | integer | |

### Seed data (current state of `wanderings.db`)

Three published trips seeded. Re-seed anytime with `npm run db:seed` (destructive — clears all rows first).

| Trip | Slug | Region | Stays | Activities | Photos |
|---|---|---|---|---|---|
| Kyoto & Tokyo | `kyoto-tokyo-2023` | Asia | 2 | 7 | 4 |
| Lisbon & the Alentejo | `lisbon-alentejo-2022` | Europe | 2 | 6 | 3 |
| Iceland Ring Road | `iceland-ring-road-2024` | Europe | 2 | 7 | 3 |

Photos use Cloudinary's built-in sample images (e.g. `samples/landscapes/nature-mountains`) from the `dwj2rey6u` account. These are placeholder — real trip photos will be uploaded via the Phase 3 admin UI.

---

## Environment Variables

`.env.local` exists at project root and is gitignored. Current state:

| Variable | Status | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ Set | `./wanderings.db` |
| `CLOUDINARY_CLOUD_NAME` | ✅ Set | `dwj2rey6u` |
| `CLOUDINARY_API_KEY` | ✅ Set | configured |
| `CLOUDINARY_API_SECRET` | ✅ Set | configured |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ Set | `dwj2rey6u` |
| `NEXTAUTH_SECRET` | ✅ Set | generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Set | `http://localhost:3000` |
| `ADMIN_USERNAME` | ✅ Set | `cd` |
| `ADMIN_PASSWORD_HASH` | ✅ Set | bcrypt hash |
| `TURSO_DATABASE_URL` | ❌ Local only | `libsql://your-db.turso.io` — add to `.env.local` for local→Turso migrations |
| `TURSO_AUTH_TOKEN` | ❌ Local only | Turso auth token — add to `.env.local` for local→Turso migrations |

---

## Architecture & Conventions

### Server vs Client Components
- **Default: Server Components.** All pages fetch data server-side directly from the DB.
- **`'use client'` components (currently):**
  - `TripCard.tsx` — hover state
  - `MarkdownRenderer.tsx` — react-markdown requires client
  - `PhotoStrip.tsx` — lightbox open/close state
  - `Lightbox.tsx` — keyboard events, body scroll lock
  - `GalleryGrid.tsx` — filter tab state + lightbox state
- Nav is **inlined in `app/layout.tsx`** (not a separate component). If it needs a mobile hamburger menu in Phase 4, extract it to `components/Nav.tsx` then.

### Data Fetching
- Public pages (`/`, `/trips/[slug]`, `/gallery`) query the DB directly in the server component — no API routes needed for reads.
- Admin mutations (Phase 3) will go through API routes (`/api/trips`, `/api/photos`) so they can be called from client forms.
- No SWR / React Query — keep it simple.

### Auth (Phase 3 — not yet built)
- Auth uses NextAuth.js Credentials provider — no OAuth, no Google Console setup needed.
- Single admin account: username + bcrypt-hashed password stored in ADMIN_USERNAME 
  and ADMIN_PASSWORD_HASH env vars.
- JWT sessions used — no database adapter required.
- Login page at /admin/login.
- /admin/* pages check for a valid session in app/admin/layout.tsx.
- API routes that mutate data check getServerSession() and return 401 if unauthenticated.

### Photos
- Photos are always stored in Cloudinary. Never save images to `/public`.
- Server-side operations (delete, URL transforms): `lib/cloudinary.ts`.
- Client-side upload will use the Cloudinary Upload Widget in `PhotoUploader.tsx` (Phase 3).
- After upload, widget returns `{ public_id, secure_url }` — POST to `/api/photos`.
- `next/image` used everywhere for Cloudinary URLs. `res.cloudinary.com` already in `next.config.mjs` remote patterns.
- **Delivery optimization:** never render a stored photo/cover URL raw — wrap it in `optimizedImageUrl(url, width)` from `lib/utils.ts`, which inserts `f_auto,q_auto,c_limit,w_<width>` so Cloudinary serves AVIF/WebP at the right size. Widths in use: 400 (gallery grid, journal thumbnail), 800 (photo strip, trip card), 2000 (lightbox, trip hero).
- **Upload pipeline for real photos:** export from Apple Photos as JPEG, long edge 2560px → upload via `/admin/photos` widget. The `wanderings_uploads` preset should have incoming transformation `c_limit,w_2560,q_auto:good` as a safety net against full-res uploads.

### Slugs
- Slugs are auto-generated on trip save using `slugify()` from `lib/utils.ts`.
- Format: lowercase, hyphens, no special chars — e.g. `"Kyoto & Tokyo 2024"` → `"kyoto-tokyo-2024"`.
- Slugs must be unique; append `-2`, `-3` on collision.

### Markdown
- Trip `story` and `tips` fields are stored as raw Markdown.
- Rendered via `MarkdownRenderer.tsx` using `react-markdown` + `remark-gfm` + `rehype-sanitize`.
- Styled with `@tailwindcss/typography` prose classes, overridden to use Playfair/Lato and site colour tokens.

### Tailwind
- All styling via Tailwind utility classes.
- `globals.css` contains: base resets, font-family declarations, and the `scrollbar-hide` utility layer (used by PhotoStrip).
- Design tokens in `tailwind.config.ts`:
  - `sand: '#F5EFE0'`, `ink: '#1C1A14'`, `muted: '#7A6F5A'`
  - `accent: '#C0714A'`, `accent2: '#4A7B8C'`, `pale: '#EDE8DA'`
- Fonts: Playfair Display (headings, `font-playfair`) + Lato (body, `font-lato`) via `next/font/google`.

---

## Build Phases

### Phase 1 — Foundation ✅ Complete
- ✅ Drizzle schema + `db:push`
- ✅ Seed script — 3 trips, 6 stays, 20 activities
- ✅ Home page: hero with dynamic stats + responsive trip card grid
- ✅ Trip detail page: all 8 sections (hero, header, pills, story, stays, activities, photos, tips)
- ✅ Tailwind design tokens, fonts, layout

### Phase 2 — Photos ✅ Complete
- ✅ Cloudinary account configured + env vars set
- ✅ `lib/cloudinary.ts` — server-side delete + URL helper
- ✅ `components/PhotoStrip.tsx` — horizontal scroll strip on trip detail, clicks open Lightbox
- ✅ `components/Lightbox.tsx` — full-screen overlay, prev/next arrows, keyboard nav
- ✅ `components/GalleryGrid.tsx` — filter tabs + auto-fill square grid + hover caption overlay
- ✅ `app/gallery/page.tsx` — photos grouped by region, empty state
- ✅ Seed updated with 10 placeholder photos (Cloudinary sample images)

### Phase 3 — Admin ✅ Complete
- ✅ `lib/auth.ts` — NextAuth Credentials provider (username/bcrypt-password from env vars, JWT sessions)
- ✅ `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- ✅ `app/admin/login/page.tsx` — login form (username + password)
- ✅ `app/admin/(protected)/layout.tsx` — session check, redirect to /admin/login if unauthenticated (route group keeps login outside the auth guard)
- ✅ `app/admin/(protected)/page.tsx` — dashboard listing all trips (published/draft badge, edit, delete, view)
- ✅ `app/admin/(protected)/trips/new/page.tsx` + `components/AdminTripForm.tsx`
- ✅ `app/admin/(protected)/trips/[slug]/edit/page.tsx` (reuses AdminTripForm)
- ✅ `app/admin/(protected)/photos/page.tsx` + `components/PhotoUploader.tsx`
- ✅ `components/DeleteTripButton.tsx`, `components/DeletePhotoButton.tsx`, `components/EditCaptionForm.tsx`, `components/SignOutButton.tsx`
- ✅ API routes: `POST /api/trips`, `PUT/DELETE /api/trips/[slug]`, `POST /api/photos`, `PUT/DELETE /api/photos/[id]`
- ⚠️ Still needed: fill in `NEXTAUTH_SECRET` and `ADMIN_PASSWORD_HASH` in `.env.local`
- ✅ Cloudinary: `wanderings_uploads` unsigned upload preset created, asset folder `wanderings`

### Phase 4 — Polish & Deploy ✅ Complete
- ✅ `app/journal/page.tsx` + `components/JournalEntry.tsx` — trips newest-first, excerpt, thumbnail, pills
- ✅ Mobile nav — `components/Nav.tsx` extracted, hamburger menu with animated bars + dropdown
- ✅ OG meta tags — `generateMetadata` on `/trips/[slug]`, static metadata on `/gallery` and `/journal`
- ✅ Deployed to Vercel
- ✅ Turso DATABASE_URL set in Vercel env vars

---

## Current Status

- **Phase:** All 4 phases complete — site is fully live and working
- **Last worked on:** 2026-04-16
- **Next task:** Add real trip content and photos via `/admin`; replace seed data with real trips

---

## Deviations from PRD

| PRD says | What was actually built | Reason |
|---|---|---|
| Pages under `app/(public)/` route group | Pages directly under `app/` (no route group) | Route group adds no functional value at this stage — easy to add later if needed |
| `components/TripDetail.tsx` — separate layout component | Trip detail is fully self-contained in `app/trips/[slug]/page.tsx` | Simpler; no other page reuses the trip detail layout |
| `components/Nav.tsx` — separate nav component | Nav is inlined in `app/layout.tsx` | It's ~15 lines; only extract if mobile menu needs client-side state |
| `next.config.ts` | `next.config.mjs` | File was `.mjs` from the initial scaffold — do not rename |
| No API routes for public read | Correct — public pages query DB directly | API routes only needed for admin mutations |
| Auth via Google OAuth (NextAuth) | Credentials provider — username + bcrypt-hashed password in env vars | No Google Cloud Console setup; single admin, simpler to configure |

---

## Known Issues / TODOs

- **Admin is built but needs env vars to be functional** — set `NEXTAUTH_SECRET` (openssl rand -base64 32) and `ADMIN_PASSWORD_HASH` (bcrypt) in `.env.local` before logging in.
- **Placeholder photos** — all 10 seeded photos use Cloudinary's generic sample images. They'll be replaced when the Phase 3 photo upload UI is built.
- **`slugify()` not called on save yet** — slug uniqueness is enforced by the DB schema but the helper in `lib/utils.ts` isn't wired to any form (no forms exist yet).
- **No `taken_at` date on any seeded photos** — the field exists in schema but seed leaves it null.
- **Gallery shows "No photos" if seed hasn't been run** — run `npm run db:seed` if the DB is empty.

---

## Useful References

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Drizzle ORM docs](https://orm.drizzle.team/docs/overview)
- [Cloudinary Next.js guide](https://cloudinary.com/documentation/nextjs_integration)
- [NextAuth.js docs](https://next-auth.js.org/getting-started/introduction)
- [Turso + Drizzle guide](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso)
