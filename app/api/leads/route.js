import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/leads -> capture an inbound "work with us" enquiry.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, company, budget, timeline, message, website } = body || {};

  // Honeypot — bots fill hidden fields. Pretend success, store nothing.
  if (website) return NextResponse.json({ ok: true }, { status: 201 });

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and project details are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(String(email))) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const db = supabaseAdmin();
  const { error } = await db.from("leads").insert({
    name: String(name).trim().slice(0, 200),
    email: String(email).trim().slice(0, 200),
    company: company ? String(company).trim().slice(0, 200) : null,
    budget: budget ? String(budget).trim().slice(0, 100) : null,
    timeline: timeline ? String(timeline).trim().slice(0, 100) : null,
    message: String(message).trim().slice(0, 5000),
    source: "home",
  });

  if (error) {
    // Postgres "undefined_table" (42P01) or PostgREST schema-cache miss (PGRST205).
    const tableMissing =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /schema cache|does not exist/i.test(error.message || "");
    if (tableMissing) {
      console.error("[leads] table missing — run supabase/leads.sql in Supabase");
      return NextResponse.json(
        { error: "Submissions aren’t enabled yet. Please email hello@cradlebase.com." },
        { status: 503 }
      );
    }
    console.error("[leads] insert failed:", error.message);
    return NextResponse.json(
      { error: "Couldn’t submit right now — please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
