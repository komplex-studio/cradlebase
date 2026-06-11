// Central site config used by SEO helpers (sitemap, metadata, JSON-LD).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Cradlebase";

export const SITE_TAGLINE = "Engineering, security & modern stacks";

// Brand tagline / value line shown with the logo.
export const SITE_BRAND_TAGLINE = "Where engineering takes root.";

export const SITE_DESCRIPTION =
  "Cradlebase publishes depth-first guides on software engineering, cyber security, and the modern stack — Node, AWS, React, Next.js, JavaScript, IoT and blockchain. Practical writing for engineers who build.";

// Estimate reading time in minutes from raw markdown/text.
export function readingTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
