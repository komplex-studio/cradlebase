// Topic categories for the blog. `slug` is stored on each post.
export const CATEGORIES = [
  { slug: "new-tech", name: "New Technology" },
  { slug: "cyber-security", name: "Cyber Security" },
  { slug: "node", name: "Node.js" },
  { slug: "aws", name: "AWS" },
  { slug: "react", name: "React" },
  { slug: "nextjs", name: "Next.js" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "iot", name: "IoT" },
  { slug: "blockchain", name: "Blockchain" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.name])
);

export function categoryName(slug) {
  return CATEGORY_MAP[slug] || slug;
}
