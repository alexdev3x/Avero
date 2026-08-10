"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Pencil, ExternalLink, Globe } from "lucide-react";
import { Project } from "@/lib/types";
import { renderDocument } from "@/lib/generator";
import { useAveroStore } from "@/lib/store";
import { timeAgo, cn } from "@/lib/utils";

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const deleteProject = useAveroStore((s) => s.deleteProject);
  const renameProject = useAveroStore((s) => s.renameProject);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(project.name);

  const version = project.versions.find((v) => v.id === project.currentVersionId) ?? project.versions[0];
  const doc = renderDocument(version.html, version.css, version.js, project.name);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-app-border bg-app-surface/50 transition hover:border-app-border-strong hover:shadow-xl hover:shadow-black/30"
    >
      <button onClick={onOpen} className="relative block h-40 w-full overflow-hidden bg-app-bg-soft text-left">
        <div className="pointer-events-none absolute left-0 top-0 h-[900px] w-[1200px] origin-top-left" style={{ transform: "scale(0.185)" }}>
          <iframe title={project.name} srcDoc={doc} className="h-[900px] w-[1200px] border-0" tabIndex={-1} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-app-bg-soft/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </button>

      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0 flex-1">
          {renaming ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                setRenaming(false);
                if (name.trim()) renameProject(project.id, name.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="w-full rounded border border-app-primary/50 bg-app-bg px-2 py-0.5 text-sm font-semibold focus:outline-none"
            />
          ) : (
            <button onClick={onOpen} className="truncate text-left text-sm font-semibold hover:text-app-primary-soft">
              {project.name}
            </button>
          )}
          <div className="mt-1 flex items-center gap-2 text-xs text-app-text-dim">
            <span>{timeAgo(project.updatedAt)}</span>
            {project.publish.isPublished && (
              <span className="flex items-center gap-1 text-app-success">
                <Globe size={11} /> Live
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-1.5 text-app-text-dim transition hover:bg-app-surface-2 hover:text-app-text"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-lg border border-app-border bg-app-surface-2 py-1 shadow-xl">
                <button
                  onClick={() => {
                    setRenaming(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-app-text hover:bg-app-surface"
                >
                  <Pencil size={13} /> Rename
                </button>
                <button
                  onClick={onOpen}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-app-text hover:bg-app-surface"
                >
                  <ExternalLink size={13} /> Open
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${project.name}"? This can't be undone.`)) deleteProject(project.id);
                    setMenuOpen(false);
                  }}
                  className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs text-app-danger hover:bg-app-surface")}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
