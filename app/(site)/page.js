import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import FeaturedPost from "@/components/FeaturedPost";
import WorkWithUs from "@/components/WorkWithUs";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const revalidate = 60; // re-fetch published posts at most once a minute

async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, category, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[home] failed to load posts:", error.message);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={blogLd} />

      {/* Masthead intro */}
      <section className="border-b border-line py-12 sm:py-16">
        <p className="kicker">The Cradlebase Journal</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Engineering depth, written for builders.
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-8 text-stone-600">
          Practical, no-fluff guides on software engineering, cyber security and
          the modern stack — Node, AWS, React, Next.js, JavaScript, IoT and
          blockchain. Written for engineers, students and researchers who ship.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="my-16 rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-xl text-ink">No stories yet.</p>
          <p className="mt-1 text-sm text-stone-500">
            Head to the admin panel to publish the first one.
          </p>
        </div>
      ) : (
        <>
          {/* Featured lead story */}
          <section className="py-12">
            <FeaturedPost post={featured} />
          </section>

          {/* Work-with-us / lead capture band */}
          <section className="pb-12">
            <WorkWithUs />
          </section>

          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED} />

          {/* Latest grid */}
          {rest.length > 0 && (
            <section className="pb-16">
              <div className="mb-7 flex items-baseline justify-between border-b border-line pb-3">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Latest articles
                </h2>
                <span className="text-xs uppercase tracking-[0.12em] text-stone-400">
                  {rest.length} {rest.length === 1 ? "story" : "stories"}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
