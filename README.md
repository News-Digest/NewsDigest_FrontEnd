# News Digest — Frontend

The reader-facing web app and editorial frontend for the **Daily News Digest** system
(the "Editorial Review / Next.js + TypeScript" box in the system architecture).
It displays curated articles, handles auth, and captures newsletter subscribers.

It is **one piece of a larger system**. The scraping (Python + Scrapy/BeautifulSoup),
AI summarization/scoring, orchestration, and email delivery live in separate services.

## Architecture

```
            ┌─────────────────────────┐
Browser ──► │ Express + Next.js (3000) │  ← this repo (server.ts)
            │  • /api/* proxy routes   │
            │  • Next.js + React SPA   │
            └───────────┬─────────────┘
                        │  fetch
                        ▼
            ┌─────────────────────────┐
            │  Content backend (5000)  │  ← separate service (articles API + DB)
            └─────────────────────────┘

Supabase ─► auth (email + Google) and the `subscribers` table
```

- **`server.ts`** — a custom Express server that wraps Next.js. It exposes
  `/api/articles`, `/api/articles/trending`, and `/api/articles/:id`, which proxy
  and reshape data from the content backend (`NEXT_PUBLIC_API_URL`, default
  `http://localhost:5000/api`).
- **`src/app/[[...slug]]/page.tsx`** — loads the React SPA (`src/app/App.tsx`)
  using react-router for client-side routing.
- **Supabase** — authentication (`src/lib/AuthContext.tsx`) and newsletter
  sign-ups (`src/components/layout/NewsletterCTA.tsx`).

> Note: the app currently renders client-side only (`ssr: false`). Per-article
> server rendering / SEO metadata is a known follow-up.

## Prerequisites

- Node.js 18+
- The **content backend** running on port `5000` (or set `NEXT_PUBLIC_API_URL`).
  Without it, the article API routes return empty lists.
- A **Supabase** project for auth and subscribers.

## Environment variables

Create a `.env.local` in the project root:

```bash
# Content backend (articles API)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase (auth + subscribers)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Used for SEO/OpenGraph absolute URLs (optional in dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Newsletter sign-ups

Newsletter opt-ins POST to `/api/newsletter/subscribe`, which the Express
server proxies to the **backend** (`POST /api/newsletter/subscribe`). The
backend upserts a subscriber that the digest email pipeline actually sends to —
no Supabase table is involved. Supabase here is only used for reader auth.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` starts the custom Express server (`server.ts`) which serves both
the `/api/*` routes and the Next.js app on port **3000**.

## Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the Express + Next.js dev server (3000) |
| `npm run build` | Production Next.js build                      |
| `npm run start` | Start the production Next.js server           |
| `npm run lint`  | Run ESLint                                    |

## Project structure

```
server.ts                     Express server + /api proxy routes
src/app/layout.tsx            Root layout + SEO metadata
src/app/[[...slug]]/page.tsx  SPA entry (client-side react-router)
src/app/App.tsx               Route definitions
src/views/                    Page/view components (Home, ArticleDetail, Auth, …)
src/components/               UI, layout, and article components
src/lib/                      Supabase client + auth context + utils
```
