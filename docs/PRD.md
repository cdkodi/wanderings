# Our Wanderings — Product Requirements Document

**Version:** 1.0  
**Author:** CD  
**Date:** April 2026  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · SQLite / Drizzle ORM  
**Deployment:** Vercel  
**Status:** Ready for build

> **Purpose:** A private-first personal website to document, organise, and share travel memories — including trip narratives, accommodation notes, activities, travel tips, and a photo gallery organised by location. Built for personal reflection and sharing with family.

---

## 1. Product Overview

### 1.1 Problem Statement

Travel memories are scattered across phones, cloud drives, and group chats. There is no single, beautiful place to revisit what we did, where we stayed, and what we felt — or to share that story with loved ones in a lasting, organised format.

### 1.2 Vision

A personal, family-friendly travel journal that feels like a well-kept physical travel book — rich with narrative, photos, and advice — accessible from any device and easy to share via a private link.

### 1.3 Goals

- Document trips with narrative, accommodation, activities, and travel advice.
- Organise and display photos against each trip's story.
- Provide a dedicated photo gallery view organised by location.
- Allow sharing with family via a link (read-only, optionally password-protected).
- Be easy to maintain — adding a new trip should take minutes, not hours.

### 1.4 Non-Goals

- Not a public travel blog or social platform.
- Not a booking or itinerary planning tool.
- No multi-user editing — single owner/admin.

### 1.5 Target Users

| User | Role |
|---|---|
| Primary | Owner (CD) — adds, edits, and manages all content |
| Secondary | Family & close friends — read-only access via a shared link |

---

## 2. Tech Stack & Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Drizzle ORM (local dev); Turso for production |
| File Storage | Cloudinary (photo uploads & transformations) |
| Auth | NextAuth.js — Google OAuth for admin; optional password share link |
| Deployment | Vercel |
| Package Manager | npm (Node v18 via nvm) |
| IDE | VS Code |

> **Why this stack?** Identical to the existing budget tracker project — same Next.js 14, TypeScript, Tailwind, SQLite/Drizzle pattern. Reuse the same mental model and tooling. Cloudinary is added for photo management; Turso gives SQLite-compatible production hosting.

---

## 3. Site Structure & Navigation

| Route | Description |
|---|---|
| `/` | Home — hero + grid of all trips (cards) |
| `/trips/[slug]` | Trip Detail — full narrative, stay, activities, photos, tips |
| `/gallery` | Photo Gallery — all photos organised by location with filter tabs |
| `/journal` | Journal — chronological narrative reading view of all trips |
| `/admin` | Admin Dashboard — add/edit trips (auth-gated) |
| `/admin/trips/new` | New Trip form |
| `/admin/trips/[slug]/edit` | Edit existing trip |
| `/admin/photos` | Photo upload and management |

---

## 4. Data Model

### 4.1 `trips`

| Column | Type | Notes |
|---|---|---|
| id | integer PK | auto-increment |
| slug | text unique | URL-friendly identifier e.g. `kyoto-2024` |
| title | text | Display name e.g. "Kyoto & Tokyo" |
| country | text | |
| region | text | For gallery filter grouping e.g. "Japan", "Europe" |
| year | integer | |
| month | text | |
| duration | text | e.g. "12 days" |
| travel_with | text | e.g. "Family" |
| story | text | Full narrative — supports Markdown |
| tips | text | Travel advice — supports Markdown |
| emoji | text | Single emoji for visual card icon |
| cover_image_url | text | Cloudinary URL for card thumbnail |
| published | boolean | Default false |
| created_at | datetime | |
| updated_at | datetime | |

### 4.2 `stays`

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| name | text | Property name |
| description | text | Personal review / notes |
| location | text | City or area |
| sort_order | integer | For multiple stays per trip |

### 4.3 `activities`

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| name | text | |
| sort_order | integer | |

### 4.4 `photos`

| Column | Type | Notes |
|---|---|---|
| id | integer PK | |
| trip_id | integer FK | → trips.id, cascade delete |
| cloudinary_id | text | Cloudinary public_id |
| url | text | Full Cloudinary URL |
| caption | text | |
| taken_at | datetime | nullable |
| sort_order | integer | |

---

## 5. Feature Specifications

### 5.1 Home Page `P0 – Critical`

The home page shows a full-screen hero section followed by a responsive card grid of all published trips.

**Hero Section**
- Large heading with site name and tagline.
- Stats row: total trips, countries visited, photos taken, year range.
- Stats are computed dynamically from the database.

**Trip Cards**
- Cover image (from Cloudinary) or emoji fallback with coloured background.
- Year badge overlaid on image.
- Trip title, month/year/duration/companions metadata.
- 2-line excerpt from the narrative.
- Tag pills (max 2 shown) and photo count.
- Hover: card lifts with subtle shadow.
- Click: navigates to `/trips/[slug]`.

---

### 5.2 Trip Detail Page `P0 – Critical`

The trip detail page is the heart of the site. It renders the full story of a single trip.

**Sections on the page (in order):**

1. Hero image — full-width cover photo or emoji + coloured background.
2. Trip header — destination, country, month, year, duration, travel companions.
3. Info pills — quick-glance data (duration, season, companions, photo count).
4. Our Story — Markdown-rendered narrative (paragraphs, emphasis supported).
5. Where We Stayed — list of stays with property name and personal review.
6. What We Did — activity list in a 2-column grid.
7. Photos — horizontally scrollable strip of captioned thumbnails.
8. Tips & Advice — a green callout box with bullet-point travel advice.

---

### 5.3 Photo Gallery `P0 – Critical`

- Photos grouped by trip/region with a heading per group.
- Filter tabs at the top: "All locations", then one per region.
- Responsive square grid (auto-fill, minmax 160px).
- Hover overlay shows caption.
- Click opens lightbox (full-size image with caption + trip name).
- Photo count badge next to each location heading.

---

### 5.4 Journal View `P1 – High`

- Full-height list of trip entries sorted by date (newest first).
- Each entry: emoji/year sidebar, location tag, title, 3-line excerpt, tag pills.
- Click navigates to full trip detail.
- Designed for comfortable reading — wider content column, larger text.

---

### 5.5 Admin — Trip Management `P0 – Critical`

All content management is done through a protected `/admin` section. Authentication via Google OAuth (NextAuth.js).

**New / Edit Trip form fields:**
- Title (text input)
- Country, Region (text inputs)
- Year, Month (select dropdowns)
- Duration (text, e.g. "10 days")
- Travel With (text, e.g. "Family")
- Emoji (text input)
- Story (Markdown textarea with live preview)
- Tips & Advice (Markdown textarea)
- Tags (comma-separated text input)
- Published toggle (draft vs live)
- Cover image upload (Cloudinary widget)

**Stay sub-form (one or more per trip):**
- Property name, location, personal notes.
- Add / remove stays inline.

**Activities sub-form:**
- List of activity names, drag-to-reorder.

---

### 5.6 Admin — Photo Management `P0 – Critical`

- Upload photos directly to Cloudinary from the admin UI.
- Assign each photo to a trip.
- Add caption and optional date taken.
- Drag-to-reorder within a trip's photo set.
- Delete photos (removes from Cloudinary and DB).

---

### 5.7 Sharing `P1 – High`

- The site is publicly readable by default (no login needed to view trips/gallery/journal).
- Optional: add a sitewide password (stored as env var) for extra privacy.
- Admin routes (`/admin/*`) are always auth-gated.
- Share button on each trip page copies the URL to clipboard.

---

### 5.8 Nice-to-Have Features

- **Map view** — trip pins on a world map.
- **Search** — across trip names, narratives, and tags.
- **PDF export** — print a trip as a keepsake PDF.
- **Year filter** on home page.

---

## 6. Pages & API Routes

### 6.1 Next.js App Router Pages

| File | Description |
|---|---|
| `app/page.tsx` | Home — hero + trip grid |
| `app/trips/[slug]/page.tsx` | Trip detail |
| `app/gallery/page.tsx` | Photo gallery |
| `app/journal/page.tsx` | Journal reading view |
| `app/admin/page.tsx` | Admin dashboard |
| `app/admin/trips/new/page.tsx` | New trip form |
| `app/admin/trips/[slug]/edit/page.tsx` | Edit trip form |
| `app/admin/photos/page.tsx` | Photo management |

### 6.2 API Routes (`app/api/`)

| Route | Description |
|---|---|
| `GET /api/trips` | List all published trips |
| `POST /api/trips` | Create trip (admin) |
| `GET /api/trips/[slug]` | Single trip with stays, activities, photos |
| `PUT /api/trips/[slug]` | Update trip (admin) |
| `DELETE /api/trips/[slug]` | Delete trip (admin) |
| `POST /api/photos` | Create photo record after Cloudinary upload (admin) |
| `PUT /api/photos/[id]` | Update caption / sort order (admin) |
| `DELETE /api/photos/[id]` | Delete photo from DB + Cloudinary (admin) |
| `GET /api/gallery` | All photos grouped by region |

---

## 7. Recommended Project Structure

```
wanderings/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                     # Home
│   │   ├── trips/[slug]/page.tsx         # Trip detail
│   │   ├── gallery/page.tsx              # Gallery
│   │   └── journal/page.tsx              # Journal
│   ├── admin/
│   │   ├── layout.tsx                   # Auth guard
│   │   ├── page.tsx                     # Admin dashboard
│   │   ├── trips/new/page.tsx
│   │   ├── trips/[slug]/edit/page.tsx
│   │   └── photos/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── trips/route.ts
│   │   ├── trips/[slug]/route.ts
│   │   ├── photos/route.ts
│   │   ├── photos/[id]/route.ts
│   │   └── gallery/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TripCard.tsx
│   ├── TripDetail.tsx
│   ├── PhotoStrip.tsx
│   ├── Lightbox.tsx
│   ├── GalleryGrid.tsx
│   ├── JournalEntry.tsx
│   ├── MarkdownRenderer.tsx
│   ├── Nav.tsx
│   ├── AdminTripForm.tsx
│   └── PhotoUploader.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── cloudinary.ts
│   ├── auth.ts
│   └── utils.ts
├── public/
├── docs/
│   └── PRD.md                           # ← this file
├── .env.local
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
└── CLAUDE.md
```

---

## 8. Environment Variables

```env
# Database
DATABASE_URL=./wanderings.db

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Auth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin access
ADMIN_EMAIL=your@gmail.com

# Optional sitewide password for family sharing
# SITE_PASSWORD=yourfamilypassword
```

---

## 9. Build Phases

### Phase 1 — Foundation
- [ ] Drizzle schema + `db:push`
- [ ] Seed script with 2–3 sample trips (no photos yet)
- [ ] Home page: hero with stats + trip card grid
- [ ] Trip detail page: all sections (story, stays, activities, tips)
- [ ] Basic Tailwind styling

### Phase 2 — Photos
- [ ] Cloudinary account + env vars configured
- [ ] Photo strip on trip detail page
- [ ] Gallery page with region grouping + filter tabs
- [ ] Lightbox component

### Phase 3 — Admin
- [ ] NextAuth + Google OAuth
- [ ] Admin layout with auth guard
- [ ] New trip form (all fields)
- [ ] Edit trip form (pre-populated)
- [ ] Photo upload + assignment to trip
- [ ] Published/draft toggle

### Phase 4 — Polish & Deploy
- [ ] Journal view page
- [ ] Mobile responsive pass
- [ ] OG meta tags for sharing
- [ ] Deploy to Vercel
- [ ] Swap SQLite → Turso for production DB
- [ ] Smoke test all pages

---

## 10. Acceptance Criteria

| Feature | Criteria |
|---|---|
| Home page | All published trips appear as cards. Stats row is accurate. Responsive at mobile widths. |
| Trip detail | All sections render: story, stays, activities, photos, tips. Markdown in narrative renders as HTML. |
| Gallery | All photos appear grouped by region. Filter tabs show/hide correctly. Lightbox opens on click. |
| Journal | Trips listed newest first. Clicking navigates to detail. |
| Admin — trip | Can create, edit, publish/unpublish, and delete a trip. Slug auto-generated. Form validates required fields. |
| Admin — photos | Can upload multiple photos, assign to trip, add captions, reorder, delete. |
| Auth | Non-authenticated users cannot access `/admin/*`. Admin email env var controls who can log in. |
| Sharing | Public pages accessible without login. Share button copies URL. |
| Responsive | Site is usable on iPhone 14 screen width (390px) and iPad (768px). |
| Performance | Cloudinary images use `next/image` with proper sizes. No layout shift on load. |
