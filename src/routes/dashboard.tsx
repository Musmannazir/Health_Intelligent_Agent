import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { GlassCard } from "@/components/GlassCard";
import { agentLogs, desertStates, trustBuckets } from "@/data/mockData";
import { Building2, ShieldCheck, AlertTriangle, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard - AyuGraph" },
      { name: "description", content: "Real-time agentic intelligence overview: 10,000 facilities, trust distribution, and medical desert hotspots." },
      { property: "og:title", content: "Dashboard - AyuGraph" },
      { property: "og:description", content: "Operations dashboard for India's healthcare facility intelligence layer." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Total Facilities", value: "10,000", sub: "Indexed nationwide", Icon: Building2, tone: "text-teal" },
  { label: "Verified (Trust >= 80%)", value: "6,240", sub: "62.4% of catalog", Icon: ShieldCheck, tone: "text-emerald" },
  { label: "Medical Deserts", value: "847", sub: "PIN codes flagged", Icon: AlertTriangle, tone: "text-crimson" },
  { label: "Discovery to Care Reduction", value: "73%", sub: "Average wayfinding gain", Icon: TrendingDown, tone: "text-amber" },
];

function Dashboard() {
  const [feed, setFeed] = useState<{ id: number; t: string; msg: string }[]>(() =>
    agentLogs.slice(0, 5).map((m, i) => ({ id: i, t: stamp(-i * 9), msg: m })),
  );

  useEffect(() => {
    let i = 5;
    let counter = feed.length;
    const id = setInterval(() => {
      const msg = agentLogs[i % agentLogs.length];
      i++;
      counter++;
      setFeed((prev) => [{ id: counter, t: stamp(0), msg }, ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <GlassCard key={k.label} delay={i * 0.05} tealTop className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k.label}</span>
              <k.Icon className={`h-4 w-4 ${k.tone}`} />
            </div>
            <div className="font-mono text-4xl font-bold leading-none">{k.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.sub}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GlassCard delay={0.2}>
          <ChartHeader title="Trust Score Distribution" sub="Facilities bucketed by validator trust score" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustBuckets} margin={{ top: 16, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="oklch(0.88 0.015 230 / 0.95)" vertical={false} />
                <XAxis dataKey="bucket" stroke="oklch(0.52 0.014 235)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis stroke="oklch(0.52 0.014 235)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip {...lightTooltip} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {trustBuckets.map((_, i) => (
                    <Cell key={i} fill={i < 2 ? "oklch(0.62 0.21 22)" : i < 4 ? "oklch(0.78 0.16 70)" : "oklch(0.74 0.18 150)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 h-1 w-full rounded-full" style={{ background: "var(--gradient-trust)" }} />
        </GlassCard>

        <GlassCard delay={0.25}>
          <ChartHeader title="Top 5 Medical Desert States" sub="Healthcare gap density by state" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={desertStates} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="oklch(0.88 0.015 230 / 0.95)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.52 0.014 235)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis type="category" dataKey="state" stroke="oklch(0.52 0.014 235)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} width={100} />
                <Tooltip {...lightTooltip} />
                <Bar dataKey="gaps" fill="oklch(0.62 0.21 22)" radius={[0, 4, 4, 0]}>
                  {desertStates.map((_, i) => (
                    <Cell key={i} fill={`oklch(${0.62 - i * 0.03} 0.21 ${22 + i * 4})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.3}>
        <ChartHeader title="Recent Agent Activity" sub="Live event stream - auto-refresh 4s" />
        <ul className="mt-2 flex flex-col">
          <AnimatePresence initial={false}>
            {feed.map((e) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-3 border-b border-[var(--color-border)] py-2.5 font-mono text-xs last:border-0"
              >
                <span className="shrink-0 text-muted-foreground">{e.t}</span>
                <span className={agentColor(e.msg)}>{e.msg}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </GlassCard>
    </div>
  );
}

function ChartHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

const lightTooltip = {
  cursor: { fill: "oklch(0.78 0.11 210 / 0.1)" },
  contentStyle: {
    background: "oklch(1 0 0)",
    border: "1px solid oklch(0.82 0.02 230 / 0.7)",
    borderRadius: 10,
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "oklch(0.25 0.02 246)",
    boxShadow: "0 10px 24px -18px oklch(0.25 0.02 246 / 0.45)",
  },
  itemStyle: { color: "oklch(0.68 0.11 210)" },
  labelStyle: { color: "oklch(0.52 0.014 235)" },
} as const;

function stamp(offsetSec: number) {
  const d = new Date(Date.now() + offsetSec * 1000);
  return d.toTimeString().slice(0, 8);
}

function agentColor(msg: string) {
  if (msg.includes("EXTRACTION")) return "text-teal";
  if (msg.includes("VALIDATOR")) return "text-amber";
  if (msg.includes("QUERY")) return "text-[var(--color-info)]";
  return "text-foreground";
}
