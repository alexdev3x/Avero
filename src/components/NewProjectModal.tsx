"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { useAveroStore } from "@/lib/store";

const EXAMPLES = [
  "A modern SaaS landing page for an AI analytics platform",
  "A cozy neighborhood bakery website",
  "A minimalist photographer portfolio",
  "A bold fitness studio with strong CTAs",
];

export function NewProjectModal({ onClose }: { onClose: () => void }) {
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
    }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-app-border bg-app-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={15} className="text-app-primary-soft" />
            New project
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-app-text-dim hover:bg-app-surface-2 hover:text-app-text">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <textarea
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Describe the website you want to build…"
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-lg border border-app-border bg-app-bg-soft px-3.5 py-3 text-sm placeholder:text-app-text-dim focus:outline-none focus:border-app-primary/50"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="rounded-full border border-app-border px-3 py-1 text-xs text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-app-primary py-3 text-sm font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating your site…
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
    </div>
  );
}
