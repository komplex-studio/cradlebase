import Link from "next/link";
import { categoryName } from "@/lib/categories";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-brand/30">
      <div className="flex items-center gap-3 text-xs">
        <Link href={`/category/${post.category}`} className="kicker">
          {categoryName(post.category)}
        </Link>
        <span className="text-stone-400">
          {formatDate(post.published_at || post.created_at)}
        </span>
      </div>

      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-ink">
        <Link href={`/posts/${post.slug}`} className="group-hover:text-brand transition-colors">
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="mt-2.5 text-[0.95rem] leading-7 text-stone-600 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <Link
        href={`/posts/${post.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
      >
        Read article
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </article>
  );
}
