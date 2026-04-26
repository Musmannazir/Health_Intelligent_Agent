import { Link, useLocation } from "@tanstack/react-router";
import { House, LayoutDashboard, Search, ShieldCheck, Map, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/",           label: "Home",          icon: House },
  { to: "/dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { to: "/discovery",  label: "Discovery",     icon: Search },
  { to: "/validator",  label: "Validator",     icon: ShieldCheck },
  { to: "/crisis-map", label: "Crisis Map",    icon: Map },
  { to: "/trace",      label: "Trace Viewer",  icon: Network },
] as const;

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      className="group fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col justify-between border-r border-[var(--color-border)] bg-[oklch(0.94_0.012_220/0.86)] backdrop-blur-xl transition-[width,background-color] duration-300 hover:w-[228px] hover:bg-[oklch(0.91_0.014_220/0.95)] md:flex"
    >
      {/* Logo */}
      <div>
        <Link to="/" className="flex h-16 items-center gap-3 px-4">
          <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 text-teal" aria-hidden>
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
            <path d="M16 7v18M7 16h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="3" fill="currentColor" />
            <circle cx="7" cy="16" r="1.8" fill="currentColor" />
            <circle cx="25" cy="16" r="1.8" fill="currentColor" />
            <circle cx="16" cy="7" r="1.8" fill="currentColor" />
            <circle cx="16" cy="25" r="1.8" fill="currentColor" />
          </svg>
          <span className="font-display text-base font-semibold tracking-tight text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Ayu<span className="text-teal">Graph</span>
          </span>
        </Link>

        <nav className="mt-4 flex flex-col gap-1 px-2">
          {items.map((item) => {
            const active = item.to === "/"
              ? pathname === "/"
              : item.to === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[oklch(0.78_0.11_210/0.14)] text-teal"
                    : "text-muted-foreground hover:bg-[oklch(0.78_0.11_210/0.08)] hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-[var(--color-primary)]" />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Agent Status */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[oklch(0.9_0.014_220/0.86)] px-3 py-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
          </span>
          <div className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Agent Status</div>
            <div className="text-xs font-semibold text-emerald">3 Agents Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
