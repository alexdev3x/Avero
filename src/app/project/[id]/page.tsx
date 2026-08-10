"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAveroStore } from "@/lib/store";
import { EditorTopBar, EditorView } from "@/components/editor/EditorTopBar";
import { ChatPanel } from "@/components/editor/ChatPanel";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { CodeEditorPane } from "@/components/editor/CodeEditorPane";
import { VersionHistoryPane } from "@/components/editor/VersionHistoryPane";
import { PublishModal } from "@/components/editor/PublishModal";
import { LogoWordmark } from "@/components/Logo";

export default function ProjectEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projects = useAveroStore((s) => s.projects);
  const saveCodeEdit = useAveroStore((s) => s.saveCodeEdit);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<EditorView>("preview");
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    // Marks client hydration complete so SSR output (empty store) matches
    // the first client render before zustand/persist reads localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const project = projects.find((p) => p.id === params.id);

  useEffect(() => {
    if (mounted && !project) {
      const t = setTimeout(() => router.replace("/dashboard"), 50);
      return () => clearTimeout(t);
    }
  }, [mounted, project, router]);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LogoWordmark className="animate-pulse-slow" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-app-text-muted">
        <p className="text-sm">Project not found — redirecting…</p>
      </div>
    );
  }

  const version = project.versions.find((v) => v.id === project.currentVersionId) ?? project.versions[0];

  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar project={project} view={view} onViewChange={setView} onPublishClick={() => setShowPublish(true)} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-[340px] flex-shrink-0 border-r border-app-border md:flex">
          <ChatPanel project={project} />
        </aside>

        <main className="flex-1 overflow-hidden">
          {view === "preview" && <PreviewPane version={version} siteName={project.name} />}
          {view === "code" && (
            <CodeEditorPane version={version} onSave={(patch) => saveCodeEdit(project.id, patch)} />
          )}
          {view === "history" && <VersionHistoryPane project={project} />}
          {view === "chat" && (
            <div className="h-full md:hidden">
              <ChatPanel project={project} />
            </div>
          )}
        </main>
      </div>

      <div className="flex items-center justify-around border-t border-app-border py-1.5 md:hidden">
        {(["preview", "chat", "code", "history"] as EditorView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 text-xs font-medium capitalize ${view === v ? "text-app-primary-soft" : "text-app-text-dim"}`}
          >
            {v}
          </button>
        ))}
      </div>

      {showPublish && <PublishModal project={project} onClose={() => setShowPublish(false)} />}
    </div>
  );
}
