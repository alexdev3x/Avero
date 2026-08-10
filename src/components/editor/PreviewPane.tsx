"use client";

import { useMemo, useState } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { ProjectVersion } from "@/lib/types";
import { renderDocument } from "@/lib/generator";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function PreviewPane({ version, siteName }: { version: ProjectVersion; siteName: string }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [key, setKey] = useState(0);

  const doc = useMemo(() => renderDocument(version.html, version.css, version.js, siteName), [version, siteName]);

  return (
    <div className="flex h-full flex-col bg-app-bg-soft">
      <div className="flex items-center justify-between border-b border-app-border px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-lg border border-app-border bg-app-surface p-1">
          {(
            [
              ["desktop", Monitor],
              ["tablet", Tablet],
              ["mobile", Smartphone],
            ] as [Device, typeof Monitor][]
          ).map(([d, Icon]) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={cn(
                "flex h-7 w-8 items-center justify-center rounded-md transition",
                device === d ? "bg-app-primary text-white" : "text-app-text-dim hover:text-app-text"
              )}
              title={d}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex items-center gap-1.5 rounded-lg border border-app-border px-2.5 py-1.5 text-xs text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          <button
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) {
                w.document.write(doc);
                w.document.close();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-app-border px-2.5 py-1.5 text-xs text-app-text-muted transition hover:border-app-border-strong hover:text-app-text"
          >
            <ExternalLink size={12} />
            Open
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto h-full overflow-hidden rounded-xl border border-app-border bg-white shadow-2xl shadow-black/40 transition-all duration-300"
          style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
        >
          <iframe key={key} title="Live preview" srcDoc={doc} className="h-full min-h-[720px] w-full border-0" />
        </div>
      </div>
    </div>
  );
}
