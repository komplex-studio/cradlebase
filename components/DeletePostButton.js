"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {busy ? "…" : "Delete"}
    </button>
  );
}
