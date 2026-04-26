import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  Oncology:           "bg-[oklch(0.78_0.11_210/0.12)] text-teal border-[oklch(0.78_0.11_210/0.35)]",
  ICU:                "bg-[oklch(0.70_0.14_230/0.12)] text-[var(--color-info)] border-[oklch(0.70_0.14_230/0.32)]",
  Trauma:             "bg-[oklch(0.78_0.16_70/0.12)] text-amber border-[oklch(0.78_0.16_70/0.34)]",
  Cardiac:            "bg-[oklch(0.62_0.21_22/0.12)] text-crimson border-[oklch(0.62_0.21_22/0.34)]",
  Pediatrics:         "bg-[oklch(0.74_0.18_150/0.12)] text-emerald border-[oklch(0.74_0.18_150/0.34)]",
  Nephrology:         "bg-[oklch(0.70_0.14_230/0.12)] text-[var(--color-info)] border-[oklch(0.70_0.14_230/0.32)]",
  Transplant:         "bg-[oklch(0.78_0.11_210/0.12)] text-teal border-[oklch(0.78_0.11_210/0.35)]",
  Hematology:         "bg-[oklch(0.62_0.21_22/0.12)] text-crimson border-[oklch(0.62_0.21_22/0.34)]",
  "Surgical Oncology":"bg-[oklch(0.78_0.11_210/0.12)] text-teal border-[oklch(0.78_0.11_210/0.35)]",
  General:            "bg-[oklch(0.96_0.01_220)] text-muted-foreground border-[var(--color-border)]",
  "General Surgery":  "bg-[oklch(0.96_0.01_220)] text-muted-foreground border-[var(--color-border)]",
  Obstetrics:         "bg-[oklch(0.74_0.18_150/0.12)] text-emerald border-[oklch(0.74_0.18_150/0.34)]",
};

export function Pill({ label, className }: { label: string; className?: string }) {
  const cls = colorMap[label] ?? "bg-[var(--color-secondary)] text-foreground border-[var(--color-border)]";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em]", cls, className)}>
      {label}
    </span>
  );
}
