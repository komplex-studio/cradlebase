import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Publishable key (sb_publishable_...). Safe in the browser, respects RLS.
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
// Secret key (sb_secret_...). Server-side only, bypasses RLS.
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url) {
  console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL is not set");
}

// Public client — used for reading published posts. Respects Row Level Security.
export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: false },
});

// Admin client — used ONLY in server-side API routes for writes & reading drafts.
// Uses the secret key, which bypasses RLS. Never import this in client code.
export function supabaseAdmin() {
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set");
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false },
  });
}
