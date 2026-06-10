import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // always show the latest leads

async function getLeads() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { leads: [], error };
  return { leads: data || [], error: null };
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage() {
  const { leads, error } = await getLeads();
  const tableMissing =
    error?.code === "42P01" ||
    error?.code === "PGRST205" ||
    /schema cache|does not exist/i.test(error?.message || "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Leads</h1>
          <p className="text-sm text-stone-500">
            {tableMissing ? "Not set up yet" : `${leads.length} enquiry(ies)`}
          </p>
        </div>
        <Link href="/admin" className="text-sm font-medium text-brand hover:text-brand-dark">
          ← Dashboard
        </Link>
      </div>

      {tableMissing ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-sm text-stone-600">
          <p className="font-medium text-ink">The leads table doesn’t exist yet.</p>
          <p className="mt-2">
            Run <code className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-ink">supabase/leads.sql</code>{" "}
            in the Supabase SQL Editor to enable the home-page enquiry form.
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-stone-400">
          No leads yet. They’ll appear here when someone submits the home-page form.
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-display text-lg font-semibold text-ink">{lead.name}</span>
                  {lead.company && (
                    <span className="ml-2 text-sm text-stone-500">· {lead.company}</span>
                  )}
                </div>
                <span className="text-xs text-stone-400">{formatDate(lead.created_at)}</span>
              </div>
              <a
                href={`mailto:${lead.email}`}
                className="mt-1 inline-block text-sm font-medium text-brand hover:text-brand-dark"
              >
                {lead.email}
              </a>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                {lead.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
