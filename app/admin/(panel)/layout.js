import Link from "next/link";
import Brandmark from "@/components/Brandmark";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";

export default function PanelLayout({ children }) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@cradlebase.com";
  const initial = (adminEmail[0] || "A").toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white md:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
          <Brandmark className="h-8 w-8" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Cradlebase
          </span>
          <span className="ml-auto rounded-md bg-ink/5 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink/55">
            Admin
          </span>
        </div>

        <AdminNav />

        <div className="border-t border-line p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/[0.04] hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            View site
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-white/85 px-4 backdrop-blur-md sm:px-6">
          {/* Mobile brand (sidebar hidden) */}
          <Link href="/admin" className="flex items-center gap-2 md:hidden">
            <Brandmark className="h-7 w-7" />
            <span className="font-display text-base font-semibold text-ink">
              Cradlebase
            </span>
          </Link>
          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            <LogoutButton />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {initial}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-ink">Admin</p>
                <p className="text-xs text-ink/50">{adminEmail}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
