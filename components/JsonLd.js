// Renders a JSON-LD <script> for structured data (rich results / SEO).
// Server component — safe to embed the object directly.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // data is built server-side from trusted content
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
