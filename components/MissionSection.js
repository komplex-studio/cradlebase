import Link from "next/link";
import LottiePlayer from "@/components/LottiePlayer";
import orbit from "@/components/lottie/orbit.json";

function BuildIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <rect className="anim-bar" x="4" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect className="anim-bar anim-bar-2" x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect className="anim-bar anim-bar-3" x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 anim-pulse-soft" fill="none" stroke="currentColor">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
      <path className="anim-float" d="M3 11l18-8-8 18-2.5-7.5L3 11z" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const VALUES = [
  {
    title: "Build",
    body: "Practical, runnable guides you can ship from — not theory you have to translate.",
    Icon: BuildIcon,
  },
  {
    title: "Secure",
    body: "Security is woven through everything we publish, never bolted on at the end.",
    Icon: SecureIcon,
  },
  {
    title: "Ship",
    body: "We cover the whole path — from first commit to production and what happens after.",
    Icon: ShipIcon,
  },
];

export default function MissionSection() {
  return (
    <section className="my-4 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="grid lg:grid-cols-12">
        {/* Statement */}
        <div className="lg:col-span-7 p-8 sm:p-12">
          <p className="kicker">Our Vision</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
            We make hard engineering legible.
          </h2>
          <p className="mt-5 max-w-lg font-serif text-lg leading-8 text-stone-600">
            Cradlebase exists to turn dense, intimidating topics — security,
            distributed systems, the modern stack — into clear, buildable
            knowledge. Depth without the gatekeeping, written by people who ship.
          </p>
          <Link
            href="#newsletter"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brand"
          >
            Join the mission <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Motion graphic */}
        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-paper to-brand-light/40 p-8 lg:col-span-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
          <LottiePlayer animationData={orbit} className="w-full max-w-[340px]" />
        </div>
      </div>

      {/* Value cards */}
      <div className="grid border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
        {VALUES.map(({ title, body, Icon }) => (
          <div key={title} className="p-7 sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-[0.95rem] leading-7 text-stone-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
