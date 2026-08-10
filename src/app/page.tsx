"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, LayoutDashboard, Wand2, Code2, History, Rocket } from "lucide-react";
import { LogoWordmark } from "@/components/Logo";
import { useAveroStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "A modern SaaS landing page for an AI analytics platform called Pulsewave",
  "A cozy neighborhood bakery website with a warm, inviting feel",
  "A minimalist portfolio for a freelance photographer",
  "A bold fitness studio website with a strong call to action",
  "A luxury jewelry brand storefront with elegant typography",
  "A digital marketing agency site with a bright, energetic vibe",
];

const STEPS = [
  { icon: Wand2, title: "Describe it", body: "Tell Avero what you want to build in plain English." },
  { icon: Sparkles, title: "AI generates", body: "A complete, responsive website appears in seconds." },
  { icon: Code2, title: "Refine by chat", body: "Ask for changes — colors, copy, sections — instantly applied." },
  { icon: Rocket, title: "Publish", body: "One click to make it live with a shareable link." },
];

export default function Home() {
  const router = useRouter();
  const createProject = useAveroStore((s) => s.createProject);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  function handleGenerate(p?: string) {
    const value = (p ?? prompt).trim();
    if (!value || loading) return;
    setLoading(true);
    setTimeout(() => {
      const id = createProject(value);
      router.push(`/project/${id}`);
    }, 900);
  }

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div
        className="glow-orb w-[560px] h-[560px] -top-40 -left-40 opacity-40"
        style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 70%)" }}
      />
      <div
        className="glow-orb w-[480px] h-[480px] top-20 -right-32 opacity-30"
        style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
        <LogoWordmark />
        <nav className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-16 md:pt-24 pb-20">
        <div className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-app-border bg-app-surface/60 px-3.5 py-1.5 text-xs font-medium text-app-text-muted backdrop-blur">
          <Sparkles size={13} className="text-app-primary-soft" />
          AI-generated, chat-refined, publish-ready
        </div>

        <h1
          className="animate-fade-in-up text-center text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.08]"
          style={{ animationDelay: "60ms" }}
        >
          Describe your website.
          <br />
          <span className="bg-gradient-to-r from-[#a78bfa] via-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent">
            Avero builds it in seconds.
          </span>
        </h1>

        <p
          className="animate-fade-in-up mt-5 max-w-xl text-center text-base md:text-lg text-app-text-muted"
          style={{ animationDelay: "120ms" }}
        >
          A full site — hero, content, styling, and all — generated from one prompt. Edit it by chatting,
          preview it live, and publish with one click.
        </p>

        <div
          className="animate-fade-in-up mt-10 w-full max-w-2xl"
          style={{ animationDelay: "180ms" }}
        >
          <div
            className={cn(
              "group relative rounded-2xl border border-app-border bg-app-surface/80 p-2 shadow-2xl shadow-black/40 backdrop-blur transition",
              "focus-within:border-app-primary/60"
            )}
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="A modern landing page for a productivity app called Flowly..."
              rows={3}
              className="w-full resize-none bg-transparent px-4 py-3 text-[15px] text-app-text placeholder:text-app-text-dim focus:outline-none"
              disabled={loading}
            />
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <span className="text-xs text-app-text-dim">Press Enter to generate, Shift+Enter for a new line</span>
              <button
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || loading}
                className="flex items-center gap-2 rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating
                  </>
                ) : (
                  <>
                    Generate site
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setPrompt(ex);
                }}
                className="rounded-full border border-app-border bg-app-surface/40 px-3.5 py-1.5 text-xs text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
              >
                {ex.length > 46 ? ex.slice(0, 46) + "…" : ex}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-24 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="animate-fade-in-up rounded-2xl border border-app-border bg-app-surface/50 p-5 text-left backdrop-blur"
              style={{ animationDelay: `${240 + i * 60}ms` }}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-app-primary/15 text-app-primary-soft">
                <step.icon size={17} />
              </div>
              <h3 className="text-sm font-semibold text-app-text">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-app-text-muted">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-2 text-xs text-app-text-dim">
          <History size={13} />
          Every edit is versioned — nothing you build is ever lost.
        </div>
      </main>
    </div>
  );
}
