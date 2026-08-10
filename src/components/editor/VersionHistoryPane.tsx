"use client";

import { History, RotateCcw, CheckCircle2 } from "lucide-react";
import { Project } from "@/lib/types";
import { useAveroStore } from "@/lib/store";
import { timeAgo, cn } from "@/lib/utils";

export function VersionHistoryPane({ project }: { project: Project }) {
  const restoreVersion = useAveroStore((s) => s.restoreVersion);
  const versions = [...project.versions].reverse();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-app-border px-4 py-3.5">
        <History size={15} className="text-app-primary-soft" />
        <h2 className="text-sm font-semibold">Version history</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="relative space-y-1 pl-4">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-app-border" />
          {versions.map((v) => {
            const isCurrent = v.id === project.currentVersionId;
            const isPublished = project.publish.publishedVersionId === v.id;
            return (
              <div key={v.id} className="relative py-2 pl-4">
                <div
                  className={cn(
                    "absolute -left-[9px] top-4 h-2.5 w-2.5 rounded-full border-2",
                    isCurrent ? "border-app-primary bg-app-primary" : "border-app-text-dim bg-app-bg"
                  )}
                />
                <div
                  className={cn(
                    "rounded-xl border px-3.5 py-3 transition",
                    isCurrent ? "border-app-primary/40 bg-app-primary/[0.06]" : "border-app-border bg-app-surface/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium leading-snug text-app-text">{v.label}</p>
                    {isCurrent && <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-app-primary-soft" />}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-app-text-dim">
                    <span>{timeAgo(v.createdAt)}</span>
                    {isPublished && <span className="text-app-success">• Published</span>}
                  </div>
                  {!isCurrent && (
                    <button
                      onClick={() => restoreVersion(project.id, v.id)}
                      className="mt-2.5 flex items-center gap-1.5 rounded-md border border-app-border px-2.5 py-1 text-[11px] font-medium text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
                    >
                      <RotateCcw size={11} />
                      Restore this version
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
