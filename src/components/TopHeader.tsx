import { useLocation } from "@tanstack/react-router";
import { agentLogs } from "@/data/mockData";

const titles: Record<string, { title: string; sub: string }> = {
  "/":            { title: "AyuGraph Home",            sub: "Mission and capability architecture overview" },
  "/dashboard":   { title: "Operations Dashboard",     sub: "Real-time agentic intelligence overview" },
  "/discovery":   { title: "Facility Discovery",       sub: "Query Agent · natural-language facility search" },
  "/validator":   { title: "Trust Validator",          sub: "Validator Agent · claim/evidence cross-reference" },
  "/crisis-map":  { title: "Crisis Map",               sub: "Geospatial medical-desert atlas" },
  "/trace":       { title: "Agent Trace Viewer",       sub: "MLflow-style reasoning timeline" },
};

export function TopHeader() {
  const { pathname } = useLocation();
  const meta = titles[pathname] ?? titles["/"];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[oklch(0.95_0.01_220/0.84)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{meta.title}</h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{meta.sub}</p>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[oklch(0.93_0.012_220/0.9)] px-3 py-1.5 font-mono text-xs">
            <span className="text-muted-foreground">India Health Dataset</span>
            <span className="text-teal">·</span>
            <span className="font-semibold text-foreground">10,000 Facilities</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[oklch(0.74_0.18_150/0.35)] bg-[oklch(0.74_0.18_150/0.1)] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald">Live Sync</span>
          </div>
        </div>
      </div>

      {/* Agent activity ticker */}
      <div className="relative hidden overflow-hidden border-t border-[var(--color-border)] bg-[oklch(0.93_0.012_220/0.84)] py-1.5 md:block">
        <div className="flex w-max animate-ticker gap-12 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {[...agentLogs, ...agentLogs].map((log, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-teal">▸</span>
              {log}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
