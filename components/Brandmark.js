// Cradlebase mark — a cradle cupping a node, set on a navy tile.
export default function Brandmark({ className = "h-9 w-9" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Cradlebase"
    >
      <rect width="32" height="32" rx="8" fill="#172554" />
      <path
        d="M8.5 13.5 Q16 24 23.5 13.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="11" r="3.1" fill="#2563eb" />
    </svg>
  );
}
