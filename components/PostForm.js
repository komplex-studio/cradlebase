"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function PostForm({ initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    category: initial?.category || CATEGORIES[0].slug,
    cover_image: initial?.cover_image || "",
    published: initial?.published || false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(publishOverride) {
    setError("");
    setSaving(true);
    const payload = { ...form };
    if (typeof publishOverride === "boolean") payload.published = publishOverride;

    try {
      const res = await fetch(
        isEdit ? `/api/posts/${initial.id}` : "/api/posts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit post" : "New post"}
        </h1>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug <span className="text-gray-400">(optional)</span>
            </label>
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto-generated from title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Excerpt <span className="text-gray-400">(short summary)</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cover image URL <span className="text-gray-400">(optional)</span>
          </label>
          <input
            value={form.cover_image}
            onChange={(e) => update("cover_image", e.target.value)}
            placeholder="https://…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content <span className="text-gray-400">(Markdown supported)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={16}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="rounded-lg bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
