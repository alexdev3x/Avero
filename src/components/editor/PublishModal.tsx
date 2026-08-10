"use client";

import { useState } from "react";
import { X, Rocket, Copy, Check, Globe, ExternalLink } from "lucide-react";
import { Project } from "@/lib/types";
import { useAveroStore } from "@/lib/store";

export function PublishModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const publishProject = useAveroStore((s) => s.publishProject);
  const unpublishProject = useAveroStore((s) => s.unpublishProject);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `https://${project.publish.slug}.avero.site`;
  const isCurrentPublished = project.publish.isPublished && project.publish.publishedVersionId === project.currentVersionId;

  function handlePublish() {
    setPublishing(true);
    setTimeout(() => {
      publishProject(project.id);
      setPublishing(false);
    }, 1100);
  }

  function copyLink() {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-app-border bg-app-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Rocket size={15} className="text-app-primary-soft" />
            Publish site
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-app-text-dim hover:bg-app-surface-2 hover:text-app-text">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {!project.publish.isPublished ? (
            <>
              <p className="text-sm text-app-text-muted">
                Publish <strong className="text-app-text">{project.name}</strong> to make it live at a public URL. You can
                unpublish or update it anytime.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-app-border bg-app-bg-soft px-3.5 py-2.5 text-sm text-app-text-dim">
                <Globe size={14} />
                {url}
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-app-primary py-3 text-sm font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-60"
              >
                {publishing ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Rocket size={15} />
                    Publish now
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-app-success/30 bg-app-success/10 px-3.5 py-2.5 text-sm text-app-success">
                <span className="h-1.5 w-1.5 rounded-full bg-app-success" />
                {isCurrentPublished ? "Your site is live" : "Live — but with a newer draft available"}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg border border-app-border bg-app-bg-soft px-3.5 py-2.5 text-sm">
                <Globe size={14} className="flex-shrink-0 text-app-text-dim" />
                <span className="flex-1 truncate text-app-text">{url}</span>
                <button onClick={copyLink} className="flex-shrink-0 text-app-text-dim hover:text-app-text">
                  {copied ? <Check size={14} className="text-app-success" /> : <Copy size={14} />}
                </button>
              </div>

              {!isCurrentPublished && (
                <p className="mt-3 text-xs text-app-text-muted">
                  You&apos;ve made changes since the last publish. Publish again to update the live version.
                </p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-app-primary py-2.5 text-sm font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-60"
                >
                  {publishing ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <ExternalLink size={14} />
                  )}
                  {isCurrentPublished ? "Republish" : "Update live site"}
                </button>
                <button
                  onClick={() => unpublishProject(project.id)}
                  className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-text-muted transition hover:border-app-danger/40 hover:text-app-danger"
                >
                  Unpublish
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
