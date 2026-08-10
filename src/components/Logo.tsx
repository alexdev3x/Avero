import { cn } from "@/lib/utils";

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-lg font-bold", className)}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%)",
        fontSize: size * 0.55,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 4px 14px rgba(124,92,255,0.35)",
      }}
    >
      <span className="text-white">A</span>
    </div>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo />
      <span className="text-lg font-bold tracking-tight text-app-text">Avero</span>
    </div>
  );
}
