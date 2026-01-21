import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#020617] text-white">
      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-teal-200 ring-1 ring-teal-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              AI‑assisted CV & PDF editor
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Create ATS‑friendly CVs & polish PDFs
              <span className="block text-teal-300">in minutes, not hours.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-200/80 max-w-xl">
              Upload an existing CV as PDF or start from a modern template. Edit every line directly on the
              page, drop in design blocks, and export a print‑perfect PDF that passes ATS.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/editor?mode=cv&cvTemplate=modern"
                className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/30 hover:bg-teal-400"
              >
                Start with modern demo CV
              </Link>
              <Link
                href="/editor?mode=pdf"
                className="inline-flex items-center justify-center rounded-lg border border-slate-500/60 px-5 py-2.5 text-sm font-semibold text-slate-50 hover:bg-white/5"
              >
                Upload your PDF
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300/80 pt-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No signup required for first export
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Works with any PDF CV
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-teal-500/20 blur-2xl" />
              <div className="relative rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl p-4">
                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-300/80">
                  <span className="font-semibold">Live editor</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                    Canva‑style CV builder
                  </span>
                </div>
                <div className="h-72 rounded-xl bg-slate-950/60 border border-slate-700/70 overflow-hidden flex items-center justify-center text-xs text-slate-300">
                  <span className="max-w-[80%] text-center">
                    The editor preview appears here on desktop. Click
                    <span className="font-semibold"> “Start with modern demo CV”</span> to open the full
                    builder.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">Powerful features for serious candidates</h2>
            <p className="text-sm text-slate-300/80 max-w-2xl mx-auto">
              Everything you need to tweak an existing CV or craft a new one from scratch.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-5 space-y-2">
              <h3 className="font-semibold text-slate-50">Edit text directly on the PDF</h3>
              <p className="text-slate-300/80">
                Click any line, re‑write it, change fonts, colors and list styles — all aligned perfectly over
                the original layout.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-5 space-y-2">
              <h3 className="font-semibold text-slate-50">Canva‑style CV canvas</h3>
              <p className="text-slate-300/80">
                Drag text blocks and design shapes onto the page. Resize, align and lock layers just like a
                design tool.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-5 space-y-2">
              <h3 className="font-semibold text-slate-50">AI‑assisted bullet points</h3>
              <p className="text-slate-300/80">
                Turn rough notes into sharp, metric‑driven bullets. Keep full control — you edit, AI suggests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">How it works</h2>
          <div className="grid gap-6 md:grid-cols-4 text-sm">
            <div className="space-y-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-xs font-semibold">
                1
              </div>
              <h3 className="font-semibold">Upload or start from demo</h3>
              <p className="text-slate-300/80">Upload your existing CV PDF or open the modern demo template.</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-xs font-semibold">
                2
              </div>
              <h3 className="font-semibold">Edit directly on the page</h3>
              <p className="text-slate-300/80">
                Fix wording, add sections, drop blocks and adjust layout visually — no form builders.
              </p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-xs font-semibold">
                3
              </div>
              <h3 className="font-semibold">Refine with AI suggestions</h3>
              <p className="text-slate-300/80">
                Use AI to draft bullet points and summaries, then tweak them to match your voice.
              </p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-xs font-semibold">
                4
              </div>
              <h3 className="font-semibold">Export ATS‑friendly PDF</h3>
              <p className="text-slate-300/80">
                Download a crisp, vector PDF that stays sharp when printed or scanned by ATS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold">Modern templates you can customize</h2>
              <p className="text-sm text-slate-300/80 max-w-2xl">
                Start from a professional layout, then drag blocks and edit text directly on the page.
              </p>
            </div>
            <Link
              href="/editor?mode=cv&cvTemplate=modern"
              className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400"
            >
              Try the demo template
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Modern Two‑Column", tag: "Best for designers" },
              { title: "Clean Single‑Column", tag: "ATS‑first" },
              { title: "Bold Accent Sidebar", tag: "Stand out" },
            ].map((t) => (
              <div
                key={t.title}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-950 flex items-end p-4">
                  <div className="text-xs text-slate-300/80">{t.tag}</div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm text-slate-300/80">
                    Drag & drop blocks, resize elements, and export a crisp PDF.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">Simple pricing</h2>
            <p className="text-sm text-slate-300/80 max-w-2xl mx-auto">
              Start free, upgrade when you’re ready to export more and move faster.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", desc: "Try the editor", items: ["1 export", "Templates", "Basic blocks"] },
              { name: "Pro", price: "$14.99", desc: "For job seekers", items: ["Unlimited exports", "More fonts", "AI bullet assist"] },
              { name: "Team", price: "$39", desc: "For coaches", items: ["Team seats", "Shared templates", "Priority support"] },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-5 ${
                  p.name === "Pro"
                    ? "bg-slate-950/60 border-teal-500/40 ring-1 ring-teal-500/30"
                    : "bg-slate-900/70 border-slate-800"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-semibold">{p.name}</div>
                  <div className="text-2xl font-semibold text-teal-300">{p.price}</div>
                </div>
                <div className="text-sm text-slate-300/80 mt-1">{p.desc}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-200/90">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Link
                    href="/editor?mode=cv&cvTemplate=modern"
                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold ${
                      p.name === "Pro"
                        ? "bg-teal-500 text-slate-950 hover:bg-teal-400"
                        : "bg-white/5 text-white hover:bg-white/10 border border-slate-700/80"
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">What users say</h2>
            <p className="text-sm text-slate-300/80">Fast edits, clean exports, and better interviews.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Ayesha", quote: "The CV canvas feels like Canva. I rebuilt my resume in one evening." },
              { name: "Daniel", quote: "PDF edits stay perfectly aligned. Exports look sharp and professional." },
              { name: "Sara", quote: "Bullet suggestions helped me turn duties into achievements." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-3">
                <div className="text-sm text-slate-200/90">“{t.quote}”</div>
                <div className="text-xs text-slate-300/70">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">Frequently asked questions</h2>
            <p className="text-sm text-slate-300/80">Quick answers to common questions.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: "Is it ATS friendly?", a: "Yes — we export clean PDFs designed to keep text selectable and readable." },
              { q: "Can I upload my existing CV PDF?", a: "Yes — upload a PDF and edit text directly on the page." },
              { q: "Do I need an account?", a: "No — you can try the demo and make edits without signing up." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl bg-slate-950/40 border border-slate-800 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-semibold">{f.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="mt-2 text-sm text-slate-300/80">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-800/80 bg-gradient-to-r from-teal-600 to-sky-500">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-950">
              Ready to level up your CV?
            </h2>
            <p className="text-sm text-slate-900/80">
              Try the editor with a pre‑built modern template. No signup needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/editor?mode=cv&cvTemplate=modern"
              className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-teal-100 shadow-lg shadow-slate-900/40 hover:bg-slate-900"
            >
              Open modern demo CV
            </Link>
            <Link
              href="/editor?mode=pdf"
              className="inline-flex items-center justify-center rounded-lg border border-slate-900/40 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white/10"
            >
              Upload my own CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

