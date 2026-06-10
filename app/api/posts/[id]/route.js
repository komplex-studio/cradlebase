import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { CATEGORY_MAP } from "@/lib/categories";

// GET /api/posts/:id -> single post (admin, includes drafts)
export async function GET(_request, { params }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post: data });
}

// PUT /api/posts/:id -> update
export async function PUT(request, { params }) {
  const { id } = await params;
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

  const db = supabaseAdmin();

  // Look up current state so we set published_at only when first published.
  const { data: existing } = await db
    .from("posts")
    .select("published, published_at")
    .eq("id", id)
    .maybeSingle();

  const slug = (body.slug && slugify(body.slug)) || slugify(title);

  let published_at = existing?.published_at || null;
  if (published && !existing?.published) {
    published_at = new Date().toISOString();
  }
  if (!published) {
    published_at = null;
  }

  const updates = {
    title,
    slug,
    excerpt: excerpt || null,
    content: content || "",
    category,
    cover_image: cover_image || null,
    published: !!published,
    published_at,
  };

  const { data, error } = await db
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const msg =
      error.code === "23505"
        ? "A post with that slug already exists — change the title or slug."
        : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ post: data });
}

// DELETE /api/posts/:id
export async function DELETE(_request, { params }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
