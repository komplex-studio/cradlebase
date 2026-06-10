import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

// Next.js builds /sitemap.xml from this. Re-generated at most hourly.
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];

  let postRoutes = [];
  try {
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    postRoutes = (data || []).map((p) => ({
      url: `${SITE_URL}/posts/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || now),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (e) {
    console.error("[sitemap] failed to load posts:", e.message);
  }

  return [...staticRoutes, ...postRoutes];
}
