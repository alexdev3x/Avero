# Avero

An AI website builder: describe a site in plain English, watch Avero generate a complete
responsive website, refine it by chatting, inspect and edit the underlying code, roll back
through version history, and publish with one click.

## Features

- **Prompt-to-site generation** — describes the industry, tone, color palette, and copy from a
  single prompt and renders a complete multi-section site (nav, hero, features, about,
  testimonials, pricing, contact, footer).
- **Live responsive preview** — desktop/tablet/mobile device frames, rendered in a sandboxed
  iframe.
- **Chat-driven editing** — ask for color, copy, section, tone, or font changes and see the
  preview update instantly.
- **Code editor** — inspect and hand-edit the generated HTML/CSS/JS with syntax highlighting
  (CodeMirror), then save & apply.
- **Version history** — every generation, chat edit, restore, and manual code edit is snapshotted
  and can be restored.
- **One-click publish** — publish the current version to a shareable URL, republish, or
  unpublish at any time.
- **Project dashboard** — browse, search, rename, and delete your projects, each with a live
  thumbnail preview.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (persisted to `localStorage`)
- CodeMirror 6 for the in-app code editor
- A local, dependency-free site-generation engine (`src/lib/generator.ts`,
  `src/lib/editor-engine.ts`) — no external AI API key required to run the app

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/lib/types.ts` — core data model (projects, versions, chat, publish state)
- `src/lib/industries.ts`, `src/lib/palettes.ts` — content and color heuristics used to turn a
  prompt into a site spec
- `src/lib/generator.ts` — renders a `SiteSpec` into HTML/CSS/JS
- `src/lib/editor-engine.ts` — interprets chat instructions into spec edits
- `src/lib/store.ts` — Zustand store tying projects, versions, chat, and publishing together
- `src/app/` — landing page, dashboard, and the project editor (`/project/[id]`)
- `src/components/editor/` — chat panel, preview pane, code editor, version history, publish modal
