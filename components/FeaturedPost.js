import Link from "next/link";
import { categoryName } from "@/lib/categories";
import { readingTime } from "@/lib/site";
import FeatureIllustration from "@/components/FeatureIllustration";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FeaturedPost({ post }) {
  const minutes = post.content ? readingTime(post.content) : null;

  return (
    <article className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-card lg:grid-cols-2">
      {/* Editorial text side */}
      <div className="order-2 flex flex-col justify-center p-8 sm:p-10 lg:order-1">
        <div className="flex items-center gap-3 text-xs">
          <Link href={`/category/${post.category}`} className="kicker">
            {categoryName(post.category)}
          </Link>
          <span className="text-stone-400">
            {formatDate(post.published_at || post.created_at)}
            {minutes ? ` · ${minutes} min read` : ""}
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]">
          <Link href={`/posts/${post.slug}`} className="hover:text-brand transition-colors">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-4 font-serif text-lg leading-8 text-stone-600">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/posts/${post.slug}`}
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brand"
        >
          Read the story <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Decorative cover side */}
      <div className="relative order-1 min-h-[14rem] overflow-hidden lg:order-2">
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative h-full w-full bg-gradient-to-br from-ink via-brand-dark to-brand">
            <FeatureIllustration className="absolute inset-0 h-full w-full" />
            <span className="absolute bottom-6 left-7 kicker text-paper/80">
              Build · Secure · Ship
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
