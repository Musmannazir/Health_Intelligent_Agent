import { cn } from "@/lib/utils";

export function trustColor(score: number) {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-destructive)";
}

export function TrustRing({ score, size = 72, stroke = 6, label = "TRUST", pulse = false }: {
  score: number; size?: number; stroke?: number; label?: string; pulse?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = trustColor(score);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", pulse && "animate-pulse-glow rounded-full")}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.30 0.03 250)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-base font-bold leading-none" style={{ color }}>{score}%</span>
        <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
