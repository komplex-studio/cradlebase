# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000 (Turbopack)
npm run build        # Production build (pinned to --webpack — see Stack note)
npm run start        # Serve the production build
npm run hash -- "your-password"   # Print an .env-ready ADMIN_PASSWORD_HASH line
```

There is no test suite. There is also no lint script: Next 16 removed `next lint`, and ESLint is not configured in this repo.

## Stack

Next.js 16 (App Router, JavaScript — not TypeScript) + React 19 + Supabase (PostgreSQL) + Tailwind. Path alias `@/*` maps to the repo root (see `jsconfig.json`), so imports look like `@/lib/supabase`.

Next 16 notes (from the 14 → 16 upgrade):
- **Async request APIs.** `params`/`searchParams` (in pages, layouts, route handlers) and `cookies()`/`headers()` are now Promises — always `await` them. See `app/posts/[slug]`, `app/category/[category]`, `app/api/posts/[id]/route.js`, and `getSession` in `lib/auth.js`.
- **Build uses Webpack.** `npm run build` passes `--webpack` because the default Turbopack production build hits a prerender chunk bug in 16.2.9. Dev still uses Turbopack. Drop the flag once the Turbopack build is fixed.
- **`middleware.js` is deprecated** in favor of the new `proxy` convention, but `proxy.js` has a broken build path in 16.2.9, so we stay on `middleware.js` (it emits a deprecation warning but works). Migrate to `proxy` when that build bug is resolved.

## Architecture

A public, read-only Markdown blog with a single-admin panel behind it. The central design rule is the **two-client Supabase split**, and most architectural decisions follow from it:

- `lib/supabase.js` exports two clients:
  - `supabase` (publishable key) — used in **public Server Components** (e.g. `app/page.js`, `app/posts/[slug]`, `app/category/[category]`). It is subject to Row Level Security, and the RLS policy in `supabase/schema.sql` only permits `SELECT` of rows where `published = true`. The public client can therefore *never* see drafts or write.
  - `supabaseAdmin()` (secret key) — used **only in `app/api/**` route handlers**. It bypasses RLS for reads-including-drafts and all writes. Never import `supabaseAdmin` into client components or public pages.

- **All mutations go through `/api/posts`**, never directly from components. `route.js` (GET list incl. drafts, POST create) and `[id]/route.js` (GET/PUT/DELETE) own slug generation (`lib/slug.js`), category validation against `CATEGORY_MAP`, and `published_at` stamping. Admin pages fetch/submit to these endpoints.

- **Auth is enforced in two layers:**
  1. `middleware.js` (matcher: `/admin/:path*`, `/api/posts/:path*`) gates access — redirects unauthenticated `/admin` page requests to `/admin/login`, and returns 401 for write methods (POST/PUT/PATCH/DELETE) on `/api/posts`. The login page and `/api/auth/*` are explicitly allowed through. Note: GET on `/api/posts` is *not* blocked by middleware.
  2. `lib/auth.js` issues/verifies a signed JWT (jose, HS256, 7-day expiry) stored in the httpOnly `tb_session` cookie. `/api/auth/login` checks the submitted email/password against `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` (bcrypt) before calling `createSession`. There is exactly one admin account — credentials live in env, not the database.

- **Categories are hardcoded** in `lib/categories.js`, not a DB table. A post's `category` column stores a category `slug`; the API rejects unknown slugs. To add/rename a topic, edit `CATEGORIES` there.

- **Markdown** is rendered by a hand-rolled converter in `lib/markdown.js` (no external markdown lib). Post `content` is stored as raw Markdown text.

- Public pages use ISR via `export const revalidate = 60`.

## Environment variables

`.env.local` is read only at server startup — **restart `npm run dev` after editing it.** Required keys (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key (`sb_publishable_…`)
- `SUPABASE_SECRET_KEY` — Supabase secret key (`sb_secret_…`), server-only
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt), `AUTH_SECRET` (random string for signing cookies)

Note: the code uses the new Supabase key names above (publishable/secret), not the legacy `ANON_KEY`/`SERVICE_ROLE_KEY` the README still mentions.

**bcrypt hash gotcha:** Next.js performs `$VAR` expansion on `.env` values, which corrupts bcrypt hashes (they contain `$2a$10$…`). Each `$` must be backslash-escaped in `.env.local`: `ADMIN_PASSWORD_HASH=\$2a\$10\$…`. `npm run hash` already prints the escaped form, so paste its output verbatim.

## Database

`supabase/schema.sql` is the source of truth — run it in the Supabase SQL Editor. It creates the `posts` table, indexes, an `updated_at` trigger, the public-read RLS policy, and seed posts. There are no migrations; edit and re-run this file.
