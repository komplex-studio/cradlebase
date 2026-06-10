"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  dashboard: (
    <path d="M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h7v7H3v-7zm11-3h7v10h-7V11z" />
  ),
  posts: (
    <path d="M4 3h11l5 5v13a0 0 0 0 1 0 0H4V3zm10 1.5V9h4.5M7 13h10M7 17h10M7 9h3" />
  ),
  newPost: <path d="M12 5v14M5 12h14" />,
  leads: (
    <path d="M3 5h18v14H3V5zm0 2 9 6 9-6" />
  ),
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/posts/new", label: "New post", icon: "newPost" },
  { href: "/admin/leads", label: "Leads", icon: "leads" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-ink/70 hover:bg-ink/[0.04] hover:text-ink"
            }`}
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
              {ICONS[item.icon]}
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
