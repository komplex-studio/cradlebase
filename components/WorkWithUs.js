import ProjectForm from "@/components/ProjectForm";

function BuildIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect className="anim-bar" x="4" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect className="anim-bar anim-bar-2" x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect className="anim-bar anim-bar-3" x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}
function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 anim-pulse-soft" fill="none" stroke="currentColor">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path className="anim-float" d="M3 11l18-8-8 18-2.5-7.5L3 11z" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const PILLARS = [
  { title: "Product build", body: "MVP to production in Next.js & Node — designed, built and shipped.", Icon: BuildIcon },
  { title: "Security & compliance", body: "Security built in from day one, not bolted on before launch.", Icon: SecureIcon },
  { title: "Scale & DevOps", body: "AWS infrastructure, CI/CD and scaling that holds up under load.", Icon: ScaleIcon },
];

const STACK = ["Next.js", "Node", "AWS", "PostgreSQL", "TypeScript"];

const STEPS = [
  { n: "01", title: "We review", body: "We read your details and check fit — usually same day." },
  { n: "02", title: "Scoping call", body: "A 30-minute call to align on goals, scope and timeline." },
  { n: "03", title: "Proposal in 48h", body: "A fixed-scope proposal with milestones and pricing." },
];

export default function WorkWithUs() {
  return (
    <section className="my-4 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* Pitch — atmospheric dark panel */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#13204a] to-[#0c1430] p-8 text-paper sm:p-12">
          {/* background atmosphere */}
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(120%_100%_at_0%_0%,#000_30%,transparent_75%)]" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />

          <div className="relative">
            {/* status pill — on its own line */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-paper/80 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="anim-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for new projects
              </span>
            </div>

            <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-light">
              Work with Cradlebase
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-paper sm:text-5xl lg:whitespace-nowrap lg:text-[2.6rem]">
              Ship your SaaS faster.
            </h2>
            <p className="mt-5 max-w-md font-serif text-lg leading-8 text-paper/70">
              We’re the engineering team behind the writing. We design, build and
              ship production SaaS — so you can focus on customers, not
              infrastructure.
            </p>

            <ul className="mt-9 space-y-2">
              {PILLARS.map(({ title, body, Icon }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl p-3 transition-colors hover:bg-white/5"
                >
                  <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-light ring-1 ring-white/10">
                    <Icon />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
                    <p className="mt-0.5 text-sm leading-6 text-paper/60">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* tech stack trust strip */}
            <div className="mt-9 border-t border-white/10 pt-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-paper/40">
                Our stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium text-paper/75"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lead form */}
        <div className="p-8 sm:p-10 lg:p-12">
          <p className="kicker">Start a project</p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Tell us what you’re building
          </h3>
          <p className="mb-7 mt-2 text-sm text-stone-500">
            Send a few details and we’ll come back with a proposal — no obligation.
          </p>
          <ProjectForm />
        </div>
      </div>

      {/* What happens next — process bar */}
      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
        {STEPS.map(({ n, title, body }) => (
          <div key={n} className="bg-paper p-6 sm:p-7">
            <span className="font-display text-sm font-semibold text-brand">{n}</span>
            <h4 className="mt-1 font-display text-base font-semibold text-ink">{title}</h4>
            <p className="mt-1 text-sm leading-6 text-stone-500">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
