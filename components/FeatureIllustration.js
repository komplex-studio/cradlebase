// A reusable "core features" illustration — a code window (Build), a shield
// (Secure) and a deploy arrow (Ship) — rendered as crisp vector art on the
// brand gradient. Used as the default cover for the featured story.
export default function FeatureIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 520 440"
      className={className}
      role="img"
      aria-label="Build, secure and ship software"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* soft glow accents */}
      <circle cx="430" cy="90" r="120" fill="#ffffff" opacity="0.06" />
      <circle cx="90" cy="370" r="120" fill="#2563eb" opacity="0.18" />

      {/* Code / terminal window — Build */}
      <g>
        <rect x="96" y="120" width="300" height="200" rx="18" fill="#ffffff" opacity="0.07" />
        <rect
          x="96.5" y="120.5" width="299" height="199" rx="17.5"
          fill="none" stroke="#ffffff" strokeOpacity="0.28"
        />
        {/* title bar dots */}
        <circle cx="124" cy="148" r="5" fill="#ffffff" opacity="0.5" />
        <circle cx="142" cy="148" r="5" fill="#ffffff" opacity="0.3" />
        <circle cx="160" cy="148" r="5" fill="#ffffff" opacity="0.3" />
        {/* code lines */}
        <rect x="120" y="178" width="120" height="11" rx="5.5" fill="#dbe6ff" opacity="0.85" />
        <rect x="120" y="200" width="200" height="11" rx="5.5" fill="#ffffff" opacity="0.32" />
        <rect x="140" y="222" width="150" height="11" rx="5.5" fill="#ffffff" opacity="0.32" />
        <rect x="140" y="244" width="96" height="11" rx="5.5" fill="#dbe6ff" opacity="0.7" />
        <rect x="120" y="266" width="180" height="11" rx="5.5" fill="#ffffff" opacity="0.32" />
        <rect x="120" y="288" width="70" height="11" rx="5.5" fill="#ffffff" opacity="0.24" />
      </g>

      {/* Shield with check — Secure */}
      <g transform="translate(300 250)">
        <path
          d="M48 6l40 16v30c0 28-18 46-40 56-22-10-40-28-40-56V22L48 6z"
          fill="#172554" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M30 54l12 12 24-26"
          fill="none" stroke="#dbe6ff" strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {/* Deploy arrow badge — Ship */}
      <g transform="translate(360 96)">
        <circle cx="34" cy="34" r="34" fill="#2563eb" />
        <circle cx="34" cy="34" r="33" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
        <path
          d="M34 50V20m0 0l-12 12m12-12l12 12"
          fill="none" stroke="#ffffff" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {/* connecting orbit dots */}
      <circle cx="392" cy="300" r="6" fill="#dbe6ff" />
      <circle cx="120" cy="100" r="5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}
