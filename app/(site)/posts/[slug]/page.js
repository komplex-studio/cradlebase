import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { categoryName } from "@/lib/categories";
import { renderMarkdown } from "@/lib/markdown";
import { SITE_URL, SITE_NAME, readingTime } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";

export const revalidate = 60;

async function getPost(slug) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[post] failed to load:", error.message);
    return null;
  }
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const url = `${SITE_URL}/posts/${post.slug}`;
  const images = post.cover_image ? [post.cover_image] : undefined;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      url,
      siteName: SITE_NAME,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      section: categoryName(post.category),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images,
    },
  };
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/posts/${post.slug}`;
  const minutes = readingTime(post.content);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: categoryName(post.category),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName(post.category),
        item: `${SITE_URL}/category/${post.category}`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-prose px-4 sm:px-6 py-12">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-stone-400">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/category/${post.category}`}
          className="hover:text-brand transition-colors"
        >
          {categoryName(post.category)}
        </Link>
      </nav>

      <header className="mt-6 mb-9">
        <Link href={`/category/${post.category}`} className="kicker">
          {categoryName(post.category)}
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.9rem]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 font-serif text-xl leading-8 text-stone-600">
            {post.excerpt}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-sm text-stone-500">
          <span className="font-medium text-ink">{SITE_NAME}</span>
          <span aria-hidden="true" className="text-stone-300">•</span>
          <span>{formatDate(post.published_at || post.created_at)}</span>
          <span aria-hidden="true" className="text-stone-300">•</span>
          <span>{minutes} min read</span>
        </div>
      </header>

      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image}
          alt={post.title}
          className="rounded-2xl w-full mb-9 border border-line"
        />
      )}

      {/* Top ad — above the fold, below the title block */}
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <div
        className="article"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* Bottom ad — after the reader has finished the article */}
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

      <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
        <Link
          href={`/category/${post.category}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
        >
          <span aria-hidden="true">←</span> More on {categoryName(post.category)}
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 hover:text-ink transition-colors"
        >
          All articles
        </Link>
      </div>
    </article>
  );
}
