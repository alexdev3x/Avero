"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, LayoutGrid } from "lucide-react";
import { LogoWordmark } from "@/components/Logo";
import { useAveroStore } from "@/lib/store";
import { ProjectCard } from "@/components/ProjectCard";
import { NewProjectModal } from "@/components/NewProjectModal";

export default function DashboardPage() {
  const router = useRouter();
  const projects = useAveroStore((s) => s.projects);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Marks client hydration complete so SSR output (empty store) matches
    // the first client render before zustand/persist reads localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const filtered = projects
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="relative flex-1 flex flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-app-border bg-app-bg/80 px-6 md:px-10 py-4 backdrop-blur">
        <LogoWordmark />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-app-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={15} />
          New project
        </button>
      </header>

      <main className="flex-1 px-6 md:px-10 py-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Your projects</h1>
          <p className="text-sm text-app-text-muted">
            {mounted ? `${projects.length} site${projects.length === 1 ? "" : "s"}` : "Loading…"} generated with Avero
          </p>
        </div>

        {mounted && projects.length > 0 && (
          <div className="mb-6 relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-dim" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-lg border border-app-border bg-app-surface/60 py-2.5 pl-9 pr-3 text-sm placeholder:text-app-text-dim focus:outline-none focus:border-app-primary/50"
            />
          </div>
        )}

        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl shimmer border border-app-border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-app-border py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primary/10 text-app-primary-soft">
              <LayoutGrid size={22} />
            </div>
            <h3 className="text-base font-semibold">
              {projects.length === 0 ? "No projects yet" : "No matches found"}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-app-text-muted">
              {projects.length === 0
                ? "Start by describing the website you want to build — Avero will generate it instantly."
                : "Try a different search term."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 flex items-center gap-2 rounded-lg bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Plus size={15} />
                Create your first site
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => router.push(`/project/${p.id}`)} />
            ))}
          </div>
        )}
      </main>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
