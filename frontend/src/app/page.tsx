import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white font-body">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-accent rounded-lg" />
            <span className="font-display font-bold text-ink text-base">
              TaskFlow
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-ink-secondary hover:text-ink transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm text-ink-secondary hover:text-ink transition-colors"
            >
              About
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-secondary hover:text-ink transition-colors"
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-ink-secondary hover:text-ink font-medium transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/8 border border-accent/15 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent text-xs font-medium">
              Now in beta — free to use
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.08] tracking-tight mb-6">
            Manage tasks.
            <br />
            <span className="text-accent">Ship faster.</span>
          </h1>

          <p className="text-ink-secondary text-lg sm:text-xl leading-relaxed max-w-xl mb-10">
            A clean, fast task manager built for developers and teams who want
            to stay focused and get things done — without the bloat.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/register"
              className="btn-primary px-7 py-3.5 text-base"
            >
              Start for free →
            </Link>
            <Link
              href="/login"
              className="text-sm text-ink-secondary hover:text-ink font-medium transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-12 text-xs text-ink-tertiary">
            <span>✓ No credit card required</span>
            <span>✓ Setup in 60 seconds</span>
            <span className="hidden sm:block">✓ Open source</span>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-6 max-w-6xl mx-auto mb-24">
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          {/* Browser chrome */}
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
              taskflow.vercel.app/dashboard
            </div>
          </div>

          {/* Fake dashboard */}
          <div className="bg-[#f7f7fb] p-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">
                  Wednesday, April 2
                </p>
                <p className="font-display font-bold text-xl text-gray-900">
                  My tasks
                </p>
              </div>
              <div className="bg-accent text-white text-xs font-medium px-4 py-2 rounded-xl">
                + New task
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { n: "12", l: "Total tasks", c: "text-accent" },
                { n: "4", l: "To do", c: "text-gray-500" },
                { n: "5", l: "In progress", c: "text-yellow-500" },
                { n: "3", l: "Completed", c: "text-green-500" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white rounded-xl p-3 border border-gray-100"
                >
                  <p className={`font-display font-bold text-xl ${s.c}`}>
                    {s.n}
                  </p>
                  <p className="text-gray-400 text-[10px]">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-xl p-3 border border-gray-100 mb-4 flex items-center gap-3">
              <span className="text-xs text-gray-400">Progress</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                <div className="h-full w-1/4 bg-green-400 rounded-full" />
              </div>
              <span className="text-xs text-gray-400 font-mono">25%</span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {[
                {
                  t: "Set up authentication endpoints",
                  s: "In progress",
                  p: "High",
                  done: false,
                  accent: "bg-accent/10 text-accent border-accent/20",
                },
                {
                  t: "Design dashboard layout",
                  s: "To do",
                  p: "Medium",
                  done: false,
                  accent: "bg-gray-100 text-gray-500 border-gray-200",
                },
                {
                  t: "Write unit tests for API",
                  s: "Done",
                  p: "Low",
                  done: true,
                  accent: "bg-green-50 text-green-600 border-green-200",
                },
              ].map((task, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3 ${task.done ? "opacity-50" : ""}`}
                >
                  <div
                    className={`w-4 h-4 rounded-[4px] border-2 flex-shrink-0 flex items-center justify-center ${task.done ? "bg-green-400 border-green-400" : "border-gray-300"}`}
                  >
                    {task.done && (
                      <span className="text-white text-[9px] font-bold">✓</span>
                    )}
                  </div>
                  <p
                    className={`text-sm font-medium flex-1 ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {task.t}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${task.accent}`}
                  >
                    {task.s}
                  </span>
                  <span className="text-[10px] text-gray-400">{task.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium font-mono mb-3">
              FEATURES
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-ink-secondary text-lg max-w-xl mx-auto">
              Built with developers in mind — fast, clean, and powerful without
              the complexity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                emoji: "🔐",
                title: "Secure auth",
                desc: "JWT access + refresh tokens with rotation. bcrypt password hashing. Rate limiting on all auth routes.",
              },
              {
                emoji: "✅",
                title: "Full task CRUD",
                desc: "Create, edit, delete, and toggle tasks. Set priority, status, and due dates. Instant updates.",
              },
              {
                emoji: "🔍",
                title: "Search & filter",
                desc: "Debounced search, filter by status and priority, sort by any field. Paginated results.",
              },
              {
                emoji: "📱",
                title: "Fully responsive",
                desc: "Works seamlessly on mobile, tablet, and desktop. No compromises on any screen size.",
              },
              {
                emoji: "⚡",
                title: "Built with Next.js 15",
                desc: "React 19, App Router, server components, useTransition for snappy async UX.",
              },
              {
                emoji: "🛠️",
                title: "TypeScript + Prisma",
                desc: "End-to-end type safety. PostgreSQL via Prisma ORM. Clean, maintainable code throughout.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-accent/20 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-accent/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/12 transition-colors text-lg">
                  {f.emoji}
                </div>
                <h3 className="font-display font-semibold text-ink mb-2">
                  {f.title}
                </h3>
                <p className="text-ink-secondary text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24 bg-ink">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent text-sm font-medium font-mono mb-4">
                ABOUT
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-6 leading-tight">
                A complete full-stack assessment project
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                TaskFlow is a full-stack task management system built as a
                software engineering assessment. It demonstrates real-world
                patterns — JWT auth with token rotation, REST API design,
                pagination, and a polished React frontend.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                Backend built with Node.js, TypeScript, Express, and Prisma.
                Frontend with Next.js 15 and React 19. Deployed on Railway and
                Vercel.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Node.js",
                  "TypeScript",
                  "Next.js 15",
                  "React 19",
                  "Prisma",
                  "PostgreSQL",
                  "JWT",
                  "Tailwind CSS",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/8 border border-white/10 rounded-lg text-white/70 text-xs font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Authentication",
                  detail:
                    "JWT access (15m) + refresh tokens (7d) with rotation & revocation",
                },
                {
                  label: "API Design",
                  detail:
                    "RESTful endpoints with validation, error handling, rate limiting",
                },
                {
                  label: "Database",
                  detail:
                    "PostgreSQL with Prisma ORM, migrations, and cascade deletes",
                },
                {
                  label: "Frontend",
                  detail:
                    "Next.js App Router, React 19, Zustand, automatic token refresh",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-white/8 bg-white/4"
                >
                  <p className="text-white font-medium text-sm mb-1">
                    {item.label}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
            Ready to get started?
          </h2>
          <p className="text-ink-secondary text-lg mb-8">
            Create an account in seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-primary px-8 py-3.5 text-base"
            >
              Create free account
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-8 py-3.5 text-base flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent rounded-md" />
            <span className="font-display font-bold text-ink text-sm">
              TaskFlow
            </span>
          </div>
          <p className="text-ink-tertiary text-xs">
            Built with Next.js 15, React 19, Node.js & Prisma
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-xs text-ink-tertiary hover:text-ink transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-xs text-ink-tertiary hover:text-ink transition-colors"
            >
              Sign up
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-tertiary hover:text-ink transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
