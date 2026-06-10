// Import the Markdown posts in content/posts/ into Supabase.
//
// Usage:
//   npm run seed            # insert/update all posts (idempotent)
//   npm run seed -- --dry   # parse and validate only, no database writes
//
// Re-running is safe: posts are upserted by their unique `slug`.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const VALID_CATEGORIES = new Set([
  "new-tech",
  "cyber-security",
  "node",
  "aws",
  "react",
  "nextjs",
  "javascript",
  "iot",
  "blockchain",
]);

// --- Minimal .env.local loader (no dependency) --------------------------------
function loadEnv() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

// --- Tiny front-matter parser -------------------------------------------------
function stripQuotes(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function parseFrontMatter(raw) {
  const text = raw.replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) {
    throw new Error("missing front matter");
  }
  const end = text.indexOf("\n---", 4);
  if (end === -1) throw new Error("unterminated front matter");

  const header = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n+/, "");

  const meta = {};
  for (const line of header.split("\n")) {
    if (!line.trim()) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = stripQuotes(line.slice(colon + 1).trim());
    meta[key] = value;
  }
  return { meta, body };
}

function toPost(meta, body, fileName) {
  const required = ["title", "slug", "category"];
  for (const field of required) {
    if (!meta[field]) throw new Error(`${fileName}: missing "${field}"`);
  }
  if (!VALID_CATEGORIES.has(meta.category)) {
    throw new Error(`${fileName}: unknown category "${meta.category}"`);
  }
  const publishedAt = meta.date
    ? new Date(meta.date).toISOString()
    : new Date().toISOString();

  return {
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt || null,
    content: body,
    category: meta.category,
    cover_image: meta.cover_image || null,
    published: true,
    published_at: publishedAt,
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry");
  loadEnv();

  if (!fs.existsSync(POSTS_DIR)) {
    console.error("No content/posts directory found.");
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.error("No .md files in content/posts/");
    process.exit(1);
  }

  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    const post = toPost(meta, body, file);
    const words = body.trim().split(/\s+/).length;
    console.log(`  parsed ${post.slug}  [${post.category}]  ~${words} words`);
    posts.push(post);
  }
  console.log(`\nParsed ${posts.length} post(s) successfully.`);

  if (dryRun) {
    console.log("Dry run — no database writes performed.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "\nMissing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SECRET_KEY in .env.local (or pass --dry to validate only)."
    );
    process.exit(1);
  }

  const { createClient } = require("@supabase/supabase-js");
  const db = createClient(url, key, { auth: { persistSession: false } });

  let ok = 0;
  for (const post of posts) {
    const { error } = await db.from("posts").upsert(post, { onConflict: "slug" });
    if (error) {
      console.error(`  FAILED ${post.slug}: ${error.message}`);
    } else {
      console.log(`  upserted ${post.slug}`);
      ok++;
    }
  }
  console.log(`\nDone. ${ok}/${posts.length} post(s) written to Supabase.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
