import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE_BRAND_TAGLINE } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-30">
      {/* Thin brand accent line across the very top */}
      <div className="accent-bar h-1 w-full" />

      <div className="bg-paper/85 backdrop-blur-md border-b border-line">
        {/* Masthead row */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link href="/" className="group inline-flex flex-col gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Cradlebase"
                className="h-9 w-auto transition-transform group-hover:-translate-y-0.5"
              />
              <span className="hidden sm:block font-serif text-[0.72rem] italic text-ink/55">
                {SITE_BRAND_TAGLINE}
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-5">
              <a
                href="mailto:hello@cradlebase.com?subject=Subscribe%20to%20Cradlebase"
                className="rounded-full bg-ink text-paper px-4 py-2 text-sm font-semibold hover:bg-brand transition-colors"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>

        {/* Section / category bar — newspaper-style */}
        <div className="border-t border-line/70">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <nav className="flex items-center gap-x-6 gap-y-2 overflow-x-auto py-2.5 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-ink/65 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href="/"
                className="shrink-0 text-ink hover:text-brand transition-colors"
              >
                Latest
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="shrink-0 hover:text-brand transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
