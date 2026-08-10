"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Project, ProjectVersion, ChatMessage } from "./types";
import { generateSite, renderHtml, renderCss, renderJs, regenerateContent } from "./generator";
import { applyEdit } from "./editor-engine";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    nanoid(5).toLowerCase()
  );
}

interface AveroState {
  projects: Project[];
  createProject: (prompt: string) => string;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  getProject: (id: string) => Project | undefined;
  sendChatMessage: (id: string, message: string) => void;
  restoreVersion: (id: string, versionId: string) => void;
  saveCodeEdit: (id: string, patch: Partial<Pick<ProjectVersion, "html" | "css" | "js">>) => void;
  publishProject: (id: string) => void;
  unpublishProject: (id: string) => void;
}

function makeVersion(label: string, spec: ProjectVersion["spec"], note?: string): ProjectVersion {
  return {
    id: nanoid(10),
    label,
    createdAt: Date.now(),
    html: renderHtml(spec),
    css: renderCss(spec),
    js: renderJs(),
    spec,
    note,
  };
}

export const useAveroStore = create<AveroState>()(
  persist(
    (set, get) => ({
      projects: [],

      createProject: (prompt: string) => {
        const { spec } = generateSite(prompt);
        const id = nanoid(10);
        const version = makeVersion("Initial generation", spec, "Created from prompt");
        const now = Date.now();
        const welcomeMsg: ChatMessage = {
          id: nanoid(8),
          role: "assistant",
          content: `I've generated "${spec.content.siteName}" based on your prompt. Ask me to tweak anything — colors, copy, sections, tone — and I'll update the live preview instantly.`,
          createdAt: now,
        };
        const project: Project = {
          id,
          name: spec.content.siteName,
          createdAt: now,
          updatedAt: now,
          prompt,
          versions: [version],
          currentVersionId: version.id,
          chat: [welcomeMsg],
          publish: { isPublished: false, slug: slugify(spec.content.siteName), publishedAt: null, publishedVersionId: null },
        };
        set({ projects: [project, ...get().projects] });
        return id;
      },

      deleteProject: (id: string) => {
        set({ projects: get().projects.filter((p) => p.id !== id) });
      },

      renameProject: (id: string, name: string) => {
        set({
          projects: get().projects.map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)),
        });
      },

      getProject: (id: string) => get().projects.find((p) => p.id === id),

      sendChatMessage: (id: string, message: string) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const currentVersion = project.versions.find((v) => v.id === project.currentVersionId)!;
        const userMsg: ChatMessage = { id: nanoid(8), role: "user", content: message, createdAt: Date.now() };

        const result = applyEdit(currentVersion.spec, message);
        let newSpec = result.spec;
        let replyText = result.summary;

        if (result.summary === "__REGENERATE__") {
          newSpec = regenerateContent(currentVersion.spec);
          replyText = "I refreshed the copy with new variations while keeping your layout and theme.";
        }

        if (!result.changed) {
          const assistantMsg: ChatMessage = { id: nanoid(8), role: "assistant", content: replyText, createdAt: Date.now() + 1 };
          set({
            projects: get().projects.map((p) =>
              p.id === id ? { ...p, chat: [...p.chat, userMsg, assistantMsg], updatedAt: Date.now() } : p
            ),
          });
          return;
        }

        const version = makeVersion(
          `Edit: ${message.length > 40 ? message.slice(0, 40) + "…" : message}`,
          newSpec
        );
        const assistantMsg: ChatMessage = { id: nanoid(8), role: "assistant", content: replyText, createdAt: Date.now() + 1 };

        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: newSpec.content.siteName,
                  versions: [...p.versions, version],
                  currentVersionId: version.id,
                  chat: [...p.chat, userMsg, assistantMsg],
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      restoreVersion: (id: string, versionId: string) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const target = project.versions.find((v) => v.id === versionId);
        if (!target) return;
        const restored = makeVersion(`Restored: ${target.label}`, target.spec, "Restored from history");
        const assistantMsg: ChatMessage = {
          id: nanoid(8),
          role: "assistant",
          content: `Restored the version "${target.label}".`,
          createdAt: Date.now(),
        };
        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  versions: [...p.versions, restored],
                  currentVersionId: restored.id,
                  chat: [...p.chat, assistantMsg],
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      saveCodeEdit: (id, patch) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const current = project.versions.find((v) => v.id === project.currentVersionId)!;
        const version: ProjectVersion = {
          id: nanoid(10),
          label: "Manual code edit",
          createdAt: Date.now(),
          html: patch.html ?? current.html,
          css: patch.css ?? current.css,
          js: patch.js ?? current.js,
          spec: current.spec,
          note: "Edited directly in the code editor",
        };
        const assistantMsg: ChatMessage = {
          id: nanoid(8),
          role: "assistant",
          content: "Applied your manual code changes and saved a new version.",
          createdAt: Date.now(),
        };
        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  versions: [...p.versions, version],
                  currentVersionId: version.id,
                  chat: [...p.chat, assistantMsg],
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      publishProject: (id: string) => {
        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  publish: { ...p.publish, isPublished: true, publishedAt: Date.now(), publishedVersionId: p.currentVersionId },
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      unpublishProject: (id: string) => {
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, publish: { ...p.publish, isPublished: false }, updatedAt: Date.now() } : p
          ),
        });
      },
    }),
    { name: "avero-projects" }
  )
);
