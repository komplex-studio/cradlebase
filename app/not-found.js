import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-prose px-4 py-28 text-center">
      <p className="kicker justify-center">Error 404</p>
      <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-4 font-serif text-lg text-stone-600">
        The page you’re looking for has moved, been unpublished, or never
        existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brand"
      >
        <span aria-hidden="true">←</span> Back to Cradlebase
      </Link>
      </main>
      <Footer />
    </div>
  );
}
