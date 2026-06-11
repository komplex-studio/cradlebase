import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE_BRAND_TAGLINE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const mid = Math.ceil(CATEGORIES.length / 2);
  const colA = CATEGORIES.slice(0, mid);
  const colB = CATEGORIES.slice(mid);

  return (
    <footer id="newsletter" className="mt-20 bg-ink text-paper/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-inverse.svg"
              alt="Cradlebase"
              className="h-8 w-auto"
            />
            <p className="mt-3 font-serif text-sm italic text-brand/90">
              {SITE_BRAND_TAGLINE}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-paper/60">
              Depth-first writing on software engineering, security and the
              modern stack — for engineers who build.
            </p>

            <form
              action="mailto:hello@cradlebase.com"
              method="post"
              encType="text/plain"
              className="mt-6 max-w-sm"
            >
              <label
                htmlFor="newsletter-email"
                className="kicker text-brand/90"
              >
                Get new posts by email
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-2 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Topics */}
          <div className="md:col-span-4">
            <h3 className="kicker text-paper/50">Topics</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <ul className="space-y-2.5">
                {colA.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/category/${c.slug}`}
                      className="text-paper/70 hover:text-paper transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {colB.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/category/${c.slug}`}
                      className="text-paper/70 hover:text-paper transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h3 className="kicker text-paper/50">Cradlebase</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-paper/70 hover:text-paper transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-paper/70 hover:text-paper transition-colors">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="mailto:hello@cradlebase.com" className="text-paper/70 hover:text-paper transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-paper/45">
          <p>© {year} Cradlebase. All rights reserved.</p>
          <p>{SITE_BRAND_TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
