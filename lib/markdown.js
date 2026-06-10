// Minimal, dependency-free Markdown -> HTML renderer.
// Content is authored by the admin (trusted), but we still escape HTML first
// to avoid accidental tag injection, then apply a small set of MD rules.

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text) {
  // links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, t, url) => `<a href="${url}" rel="noopener noreferrer">${t}</a>`
  );
  // bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic *text*
  text = text.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // inline code `code`
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  return text;
}

export function renderMarkdown(md) {
  if (!md) return "";
  const src = escapeHtml(md.replace(/\r\n/g, "\n"));
  const lines = src.split("\n");
  const out = [];
  let i = 0;
  let listType = null; // "ul" | "ol" | null

  function closeList() {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block ```
    if (line.trim().startsWith("```")) {
      closeList();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      out.push(`<pre><code>${buf.join("\n")}</code></pre>`);
      continue;
    }

    // headings
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      closeList();
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // blank line
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    // paragraph
    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }

  closeList();
  return out.join("\n");
}
