import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import { CATEGORY_MAP, categoryName } from "@/lib/categories";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const name = CATEGORY_MAP[category];
  if (!name) return { title: "Category" };
  return { title: name, description: `Posts about ${name}` };
}

async function getPosts(category) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category, published_at, created_at")
    .eq("published", true)
    .eq("category", category)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[category] failed to load:", error.message);
    return [];
  }
  return data || [];
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  if (!CATEGORY_MAP[category]) notFound();
  const posts = await getPosts(category);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="border-b border-line py-12 sm:py-14">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-stone-400">
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">Topics</span>
        </nav>
        <p className="kicker mt-5">Topic</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {categoryName(category)}
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          {posts.length} {posts.length === 1 ? "article" : "articles"} in this topic
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="my-16 rounded-2xl border border-dashed border-line bg-white p-12 text-center text-stone-500">
          No articles in this topic yet.
        </div>
      ) : (
        <div className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
