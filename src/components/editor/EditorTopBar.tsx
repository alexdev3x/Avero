"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Code2, History, Rocket, Globe } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Project } from "@/lib/types";
import { useAveroStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export type EditorView = "preview" | "code" | "history" | "chat";

export function EditorTopBar({
  project,
  view,
  onViewChange,
  onPublishClick,
}: {
  project: Project;
  view: EditorView;
  onViewChange: (v: EditorView) => void;
  onPublishClick: () => void;
}) {
  const router = useRouter();
  const renameProject = useAveroStore((s) => s.renameProject);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const tabs: { key: EditorView; label: string; icon: typeof Eye }[] = [
    { key: "preview", label: "Preview", icon: Eye },
    { key: "code", label: "Code", icon: Code2 },
    { key: "history", label: "History", icon: History },
  ];

  return (
    <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-app-text-dim transition hover:bg-app-surface-2 hover:text-app-text"
        >
          <ArrowLeft size={16} />
        </button>
        <Logo size={24} />
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setEditing(false);
              if (name.trim()) renameProject(project.id, name.trim());
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="rounded border border-app-primary/50 bg-app-bg px-2 py-0.5 text-sm font-semibold focus:outline-none"
          />
        ) : (
          <button onClick={() => setEditing(true)} className="truncate text-sm font-semibold hover:text-app-primary-soft">
            {project.name}
          </button>
        )}
        {project.publish.isPublished && (
          <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-app-success/10 px-2 py-0.5 text-[11px] font-medium text-app-success">
            <Globe size={10} /> Live
          </span>
        )}
      </div>

      <div className="hidden items-center gap-1 rounded-lg border border-app-border bg-app-surface p-1 md:flex">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onViewChange(t.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
              view === t.key ? "bg-app-primary text-white" : "text-app-text-dim hover:text-app-text"
            )}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <button
        onClick={onPublishClick}
        className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-app-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110"
      >
        <Rocket size={13} />
        Publish
      </button>
    </div>
  );
}
