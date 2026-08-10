"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Project } from "@/lib/types";
import { useAveroStore } from "@/lib/store";

const SUGGESTIONS = [
  "Make it feel more minimal",
  "Change the color to emerald green",
  "Add a pricing section",
  "Rewrite the headline",
];

export function ChatPanel({ project }: { project: Project }) {
  const sendChatMessage = useAveroStore((s) => s.sendChatMessage);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [project.chat.length, thinking]);

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || thinking) return;
    setInput("");
    setThinking(true);
    // Randomized "thinking" delay for a natural feel — computed here, inside
    // an event handler, never during render.
    // eslint-disable-next-line react-hooks/purity
    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      sendChatMessage(project.id, value);
      setThinking(false);
    }, delay);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-app-border px-4 py-3.5">
        <Sparkles size={15} className="text-app-primary-soft" />
        <h2 className="text-sm font-semibold">Chat to edit</h2>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {project.chat.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
                m.role === "user" ? "bg-app-surface-2 text-app-text-muted" : "bg-app-primary/15 text-app-primary-soft"
              }`}
            >
              {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === "user" ? "bg-app-primary text-white" : "bg-app-surface-2 text-app-text"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-app-primary/15 text-app-primary-soft">
              <Bot size={12} />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-app-surface-2 px-3.5 py-3">
              <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-app-text-dim" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-app-text-dim" style={{ animationDelay: "160ms" }} />
              <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-app-text-dim" style={{ animationDelay: "320ms" }} />
            </div>
          </div>
        )}
      </div>

      {project.chat.length < 3 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-app-border px-2.5 py-1 text-[11px] text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-app-border p-3">
        <div className="flex items-end gap-2 rounded-xl border border-app-border bg-app-bg-soft px-3 py-2 focus-within:border-app-primary/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Ask Avero to change anything…"
            className="max-h-28 flex-1 resize-none bg-transparent py-1 text-[13px] placeholder:text-app-text-dim focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || thinking}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-app-primary text-white transition enabled:hover:brightness-110 disabled:opacity-30"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
