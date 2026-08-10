"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Check, Code2 } from "lucide-react";
import { ProjectVersion } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "html" | "css" | "js";

const LABEL: Record<Tab, string> = { html: "index.html", css: "styles.css", js: "script.js" };
const EXTENSIONS: Record<Tab, ReturnType<typeof html>[]> = {
  html: [html()],
  css: [css()],
  js: [javascript()],
};

export function CodeEditorPane({
  version,
  onSave,
}: {
  version: ProjectVersion;
  onSave: (patch: { html: string; css: string; js: string }) => void;
}) {
  const [tab, setTab] = useState<Tab>("html");
  const [draft, setDraft] = useState({ html: version.html, css: version.css, js: version.js });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    // Resets the editor draft whenever the underlying version identity
    // changes (new version selected/restored) — the documented pattern for
    // resetting state when a prop/key changes: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft({ html: version.html, css: version.css, js: version.js });
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.id]);

  function update(tab: Tab, value: string) {
    setDraft((d) => ({ ...d, [tab]: value }));
    setDirty(true);
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
        <div className="flex items-center gap-1">
          {(["html", "css", "js"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                tab === t ? "bg-app-surface-2 text-app-text" : "text-app-text-dim hover:text-app-text"
              )}
            >
              <Code2 size={12} />
              {LABEL[t]}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            onSave(draft);
            setDirty(false);
          }}
          disabled={!dirty}
          className="flex items-center gap-1.5 rounded-lg bg-app-primary px-3 py-1.5 text-xs font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-30"
        >
          <Check size={12} />
          Save & apply
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={draft[tab]}
          onChange={(v) => update(tab, v)}
          theme={vscodeDark}
          extensions={EXTENSIONS[tab]}
          height="100%"
          style={{ height: "100%", fontSize: 13 }}
          basicSetup={{ foldGutter: true, lineNumbers: true, highlightActiveLine: true }}
        />
      </div>
    </div>
  );
}
