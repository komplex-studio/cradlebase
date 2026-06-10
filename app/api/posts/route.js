import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { CATEGORY_MAP } from "@/lib/categories";

// GET /api/posts  -> list all posts (admin view, includes drafts)
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("id, title, slug, category, published, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ posts: data });
}

// POST /api/posts  -> create a post
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { title, excerpt, content, category, cover_image, published } = body || {};

  if (!title || !category) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    );
  }
  if (!CATEGORY_MAP[category]) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const slug = (body.slug && slugify(body.slug)) || slugify(title);
  const db = supabaseAdmin();

  const row = {
    title,
    slug,
    excerpt: excerpt || null,
    content: content || "",
    category,
    cover_image: cover_image || null,
    published: !!published,
    published_at: published ? new Date().toISOString() : null,
  };

  const { data, error } = await db.from("posts").insert(row).select().single();

  if (error) {
    const msg =
      error.code === "23505"
        ? "A post with that slug already exists — change the title or slug."
        : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ post: data }, { status: 201 });
}
