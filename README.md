# TechBlog

A personal blog with a password-protected admin panel. Write a short post every
day about new technology, cyber security, and the stacks you build with —
Node, AWS, React, Next.js, JavaScript, IoT and blockchain.

Built with **Next.js 14 (App Router)** + **Supabase (PostgreSQL)**. Posts are
written in Markdown. The public site is read-only; all editing happens behind a
single admin login.

---

## Features

- Public blog: home feed, individual post pages, and per-category pages.
- Nine built-in categories matching your topics (edit them in `lib/categories.js`).
- Admin panel: list, create, edit, delete posts; publish or save as draft.
- Markdown content with a built-in renderer (headings, lists, code, links, etc.).
- Simple credentials login (one admin account) with a signed, httpOnly JWT cookie.
- Row Level Security so the public can only ever read published posts.
- Built-in SEO: per-post meta tags, Open Graph/Twitter cards, JSON-LD structured
  data, a dynamic sitemap, and robots.txt.
- Google AdSense ad slots, ready to monetise (invisible until you add your IDs).
- Nine in-depth starter posts (one per category) plus a `npm run seed` importer.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org) 18.18+ (20+ recommended)
- A free [Supabase](https://supabase.com) project

## 2. Install

```bash
cd techblog
npm install
```

## 3. Set up the database

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and run it. This creates the
   `posts` table, indexes, an `updated_at` trigger, the RLS policy, and three
   sample posts.

## 4. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — from
  Supabase **Settings → API Keys**. The publishable key (`sb_publishable_…`) is
  safe in the browser and respects RLS.
- `SUPABASE_SECRET_KEY` — also under **Settings → API Keys** (`sb_secret_…`).
  This is secret; it is only ever used server-side and bypasses RLS for admin
  writes.
- `ADMIN_EMAIL` — the email you'll log in with.
- `ADMIN_PASSWORD_HASH` — a bcrypt hash of your password. Generate it with:

  ```bash
  npm run hash -- "your-password-here"
  ```

  Copy the printed `ADMIN_PASSWORD_HASH=...` line into `.env.local` verbatim.
  The hash is printed with each `$` backslash-escaped (`\$2a\$10\$…`) because
  Next.js otherwise expands `$...` in `.env` values and corrupts the hash.
- `AUTH_SECRET` — a long random string used to sign session cookies. Generate one:

  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

## 5. Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin> (redirects to login)

## 6. Load the starter blog posts

Nine in-depth, SEO-friendly posts (one per category) live as Markdown in
`content/posts/`. Import them into Supabase with:

```bash
npm run seed          # insert/update all posts (safe to re-run)
npm run seed -- --dry # just validate the files, no database writes
```

The script upserts by `slug`, so running it again updates existing posts rather
than creating duplicates. To add more posts later, either drop a new `.md` file
in `content/posts/` (same front-matter format) and re-run `npm run seed`, or use
the admin panel.

---

## Project structure

```
app/
  page.js                     Home feed (published posts)
  posts/[slug]/page.js        Single post
  category/[category]/page.js Category feed
  admin/
    login/page.js             Admin login
    page.js                   Dashboard (list / manage)
    posts/new/page.js         Create post
    posts/[id]/edit/page.js   Edit post
  api/
    auth/login|logout/        Credentials login / logout
    posts/                    Post CRUD (GET/POST)
    posts/[id]/               Post CRUD (GET/PUT/DELETE)
  sitemap.js                  Generates /sitemap.xml
  robots.js                   Generates /robots.txt
components/                   Header, Footer, PostCard, PostForm
  AdSlot.js                   Google AdSense unit (hidden until configured)
  JsonLd.js                   Structured-data helper
content/posts/                The 9 starter posts (Markdown + front matter)
lib/
  supabase.js                 Public + admin Supabase clients
  auth.js                     JWT session helpers
  categories.js               Topic list
  markdown.js                 Markdown -> HTML renderer
  slug.js                     Slug generator
  site.js                     Site config + SEO helpers (reading time)
public/ads.txt                AdSense ownership file (edit before going live)
scripts/seed.js               Imports content/posts into Supabase
middleware.js                 Protects /admin and write APIs
supabase/schema.sql           Database schema + seed data
```

## How auth works

- The admin submits email + password to `/api/auth/login`.
- The server compares them against `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`
  (bcrypt), then issues a JWT stored in an httpOnly cookie signed with
  `AUTH_SECRET`.
- `middleware.js` verifies that cookie on every `/admin` page and every write to
  `/api/posts`, redirecting to the login page (or returning 401) when missing.

## SEO

SEO is built in so your posts can rank and qualify for ad programs:

- **Per-post metadata** — each post sets its own `<title>`, meta description,
  canonical URL, Open Graph and Twitter card tags (see `app/posts/[slug]/page.js`).
- **Structured data** — every post emits JSON-LD `BlogPosting` and
  `BreadcrumbList` schema for rich search results; the home page emits `Blog`.
- **Sitemap** — `app/sitemap.js` generates `/sitemap.xml` from your published
  posts plus all category pages, refreshed hourly.
- **robots.txt** — `app/robots.js` allows crawling, blocks `/admin` and `/api`,
  and points to your sitemap.
- **Reading time** is shown on each post.

Set `NEXT_PUBLIC_SITE_URL` to your real domain in production — it is used for
canonical URLs, the sitemap, and social tags. After deploying, submit your
sitemap in [Google Search Console](https://search.google.com/search-console).

A few content habits matter as much as the code: write a clear, keyword-rich
title and a 1–2 sentence excerpt for every post (the excerpt becomes your meta
description), use descriptive slugs, and publish consistently.

## Monetization with Google AdSense

Ad slots are wired in and stay completely invisible until you add your AdSense
IDs, so the site looks clean while you wait for approval.

1. Apply at [Google AdSense](https://adsense.google.com) and add your site.
   Approval usually requires real content (the nine seeded posts help) and a few
   pages like an About and Privacy Policy.
2. Once approved, set these in `.env.local`:

   ```bash
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890       # ad unit ids from AdSense
   NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=2345678901
   NEXT_PUBLIC_ADSENSE_SLOT_INFEED=3456789012
   ```

3. Edit `public/ads.txt` and replace `pub-0000000000000000` with your real
   publisher ID (digits only). AdSense requires this file for payouts.

Ad placements: top and bottom of each post, plus an in-feed slot on the home
page (`components/AdSlot.js`). If `NEXT_PUBLIC_ADSENSE_CLIENT` is blank, no
scripts load and no slots render — handy for local development. Keep ad density
reasonable; too many ads hurts both rankings and AdSense approval.

## Deploying

Works well on Vercel: push to a Git repo, import it, and add the same
environment variables in the project settings. Set `secure` cookies are enabled
automatically in production. You can also deploy to AWS Amplify or a container —
just provide the same env vars.

## Customizing

- **Topics:** edit `CATEGORIES` in `lib/categories.js`.
- **Styling:** Tailwind classes throughout; brand color in `tailwind.config.js`.
- **Multiple authors / richer auth:** swap the credentials check for NextAuth.js
  later — the API and middleware boundaries are already in place.
```
