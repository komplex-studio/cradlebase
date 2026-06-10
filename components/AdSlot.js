"use client";

import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * A single Google AdSense unit.
 *
 * Renders nothing unless BOTH a publisher id (NEXT_PUBLIC_ADSENSE_CLIENT) and a
 * `slot` id are provided — this keeps the layout clean before you've set up
 * AdSense and avoids policy issues with empty ad requests.
 *
 * Usage:
 *   <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />
 */
export default function AdSlot({ slot, format = "auto", className = "" }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not loaded yet (e.g. blocked) — fail silently.
    }
  }, [slot]);

  if (!CLIENT || !slot) return null;

  return (
    <div className={`my-8 text-center ${className}`} aria-hidden="true">
      <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
