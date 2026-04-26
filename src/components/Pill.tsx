import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  Oncology:           "bg-[oklch(0.79_0.14_188/0.15)] text-teal border-[oklch(0.79_0.14_188/0.4)]",
  ICU:                "bg-[oklch(0.70_0.14_230/0.15)] text-[var(--color-info)] border-[oklch(0.70_0.14_230/0.4)]",
  Trauma:             "bg-[oklch(0.78_0.16_70/0.15)] text-amber border-[oklch(0.78_0.16_70/0.4)]",
  Cardiac:            "bg-[oklch(0.62_0.21_22/0.15)] text-crimson border-[oklch(0.62_0.21_22/0.4)]",
  Pediatrics:         "bg-[oklch(0.74_0.18_150/0.15)] text-emerald border-[oklch(0.74_0.18_150/0.4)]",
  Nephrology:         "bg-[oklch(0.70_0.14_230/0.15)] text-[var(--color-info)] border-[oklch(0.70_0.14_230/0.4)]",
  Transplant:         "bg-[oklch(0.79_0.14_188/0.15)] text-teal border-[oklch(0.79_0.14_188/0.4)]",
  Hematology:         "bg-[oklch(0.62_0.21_22/0.15)] text-crimson border-[oklch(0.62_0.21_22/0.4)]",
  "Surgical Oncology":"bg-[oklch(0.79_0.14_188/0.15)] text-teal border-[oklch(0.79_0.14_188/0.4)]",
  General:            "bg-[oklch(0.30_0.03_250)] text-muted-foreground border-[var(--color-border)]",
  "General Surgery":  "bg-[oklch(0.30_0.03_250)] text-muted-foreground border-[var(--color-border)]",
  Obstetrics:         "bg-[oklch(0.74_0.18_150/0.15)] text-emerald border-[oklch(0.74_0.18_150/0.4)]",
};

export function Pill({ label, className }: { label: string; className?: string }) {
  const cls = colorMap[label] ?? "bg-[var(--color-secondary)] text-foreground border-[var(--color-border)]";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider", cls, className)}>
      {label}
    </span>
  );
}
