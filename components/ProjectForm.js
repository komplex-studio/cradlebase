"use client";

import { useState } from "react";

const BUDGETS = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Just exploring"];

const Chevron = () => (
  <svg
    viewBox="0 0 24 24"
    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
    fill="none"
    stroke="currentColor"
  >
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProjectForm() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot tripped — silently "succeed" without doing anything.
    if (data.website) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[20rem] flex-col items-start justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
            <path d="M5 13l4 4 10-11" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
          Thanks — we’ll be in touch.
        </h3>
        <p className="mt-2 text-stone-600">
          We’ve got your details and will reply within one business day with next steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Send another enquiry →
        </button>
      </div>
    );
  }

  const fieldCls =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-ink placeholder:text-stone-400 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10";
  const selectCls = `${fieldCls} appearance-none pr-10 cursor-pointer`;
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/70";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className={labelCls}>Name</label>
          <input id="lf-name" name="name" required placeholder="Jane Doe" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="lf-email" className={labelCls}>Work email</label>
          <input id="lf-email" name="email" type="email" required placeholder="jane@company.com" className={fieldCls} />
        </div>
      </div>

      <div>
        <label htmlFor="lf-company" className={labelCls}>
          Company <span className="font-normal normal-case tracking-normal text-stone-400">(optional)</span>
        </label>
        <input id="lf-company" name="company" placeholder="Acme SaaS Inc." className={fieldCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-budget" className={labelCls}>Budget</label>
          <div className="relative">
            <select id="lf-budget" name="budget" defaultValue="" className={selectCls}>
              <option value="" disabled>Select a range</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>
        <div>
          <label htmlFor="lf-timeline" className={labelCls}>Timeline</label>
          <div className="relative">
            <select id="lf-timeline" name="timeline" defaultValue="" className={selectCls}>
              <option value="" disabled>When do you start?</option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="lf-message" className={labelCls}>What are you building?</label>
        <textarea
          id="lf-message"
          name="message"
          required
          rows={4}
          placeholder="A few lines about your product, timeline and what you need help with…"
          className={`${fieldCls} resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-paper shadow-card transition-all hover:bg-brand hover:shadow-lg disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request a proposal"}
        {status !== "loading" && (
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone-400">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
          <rect x="5" y="11" width="14" height="9" rx="2" strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeWidth="1.8" />
        </svg>
        Your details stay private — no spam, ever.
      </p>
    </form>
  );
}
