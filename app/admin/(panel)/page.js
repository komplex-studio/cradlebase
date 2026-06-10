import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { categoryName } from "@/lib/categories";
import DeletePostButton from "@/components/DeletePostButton";

export const dynamic = "force-dynamic"; // always show latest, including drafts

async function getData() {
  const db = supabaseAdmin();

  const { data: posts, error } = await db
    .from("posts")
    .select("id, title, slug, category, published, updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[admin] failed to load posts:", error.message);
  }

  // Leads count — table may not exist yet; degrade gracefully.
  let leadsCount = null;
  const { count, error: leadsError } = await db
    .from("leads")
    .select("*", { count: "exact", head: true });
  if (!leadsError) leadsCount = count ?? 0;

  return { posts: posts || [], leadsCount };
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ label, value, tone, icon }) {
  const tones = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    purple: "bg-violet-500",
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-card">
      <div>
        <p className="text-sm text-ink/55">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold text-ink">
          {value}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${tones[tone]}`}
      >
        {icon}
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon, external }) {
  const inner = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </>
  );
  const className =
    "flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 transition-colors hover:border-brand/40 hover:bg-brand/[0.03]";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

const Svg = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export default async function AdminDashboard() {
  const { posts, leadsCount } = await getData();
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const recent = posts.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Welcome back, Admin!
        </h1>
        <p className="mt-1 text-ink/55">Here’s what’s happening on Cradlebase.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total posts"
          value={posts.length}
          tone="blue"
          icon={
            <Svg>
              <path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5" />
            </Svg>
          }
        />
        <StatCard
          label="Published"
          value={published}
          tone="green"
          icon={
            <Svg>
              <path d="M20 6 9 17l-5-5" />
            </Svg>
          }
        />
        <StatCard
          label="Drafts"
          value={drafts}
          tone="amber"
          icon={
            <Svg>
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </Svg>
          }
        />
        <StatCard
          label="Leads"
          value={leadsCount === null ? "—" : leadsCount}
          tone="purple"
          icon={
            <Svg>
              <path d="M3 5h18v14H3zM3 7l9 6 9-6" />
            </Svg>
          }
        />
      </div>

      {/* Quick actions */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold text-ink">
          Quick actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            href="/admin/posts/new"
            label="New post"
            icon={
              <Svg>
                <path d="M12 5v14M5 12h14" />
              </Svg>
            }
          />
          <QuickAction
            href="/admin/leads"
            label="View leads"
            icon={
              <Svg>
                <path d="M3 5h18v14H3zM3 7l9 6 9-6" />
              </Svg>
            }
          />
          <QuickAction
            href="/"
            label="View site"
            external
            icon={
              <Svg>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Svg>
            }
          />
        </div>
      </section>

      {/* Recent posts */}
      <section className="mt-8 rounded-2xl border border-line bg-white shadow-card">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Recent posts
          </h2>
          <span className="text-sm text-ink/45">{posts.length} total</span>
        </div>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-ink/50">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-ink/40">
                    No posts yet. Create your first one.
                  </td>
                </tr>
              )}
              {recent.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70">
                  <td className="px-6 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-6 py-3 text-ink/60">
                    {categoryName(p.category)}
                  </td>
                  <td className="px-6 py-3">
                    {p.published ? (
                      <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-ink/50">
                    {formatDate(p.updated_at)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {p.published && (
                        <Link
                          href={`/posts/${p.slug}`}
                          className="text-ink/50 hover:text-brand"
                          target="_blank"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${p.id}/edit`}
                        className="font-medium text-brand hover:text-brand-dark"
                      >
                        Edit
                      </Link>
                      <DeletePostButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
