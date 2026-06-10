import { SITE_URL } from "@/lib/site";

// Next.js builds /robots.txt from this.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the admin area out of search results.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
