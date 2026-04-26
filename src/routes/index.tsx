import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BrainCircuit, SearchCheck, ShieldAlert, MapPinned, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AyuGraph - Agentic Healthcare Intelligence" },
      {
        name: "description",
        content:
          "Agentic Healthcare Intelligence System for auditing messy facility reports, finding specialized care deserts, and reducing discovery-to-care time.",
      },
      { property: "og:title", content: "AyuGraph - Agentic Healthcare Intelligence" },
      {
        property: "og:description",
        content:
          "Navigate 10,000 unstructured facility reports to uncover life-saving capabilities and close the discovery-to-care gap.",
      },
    ],
  }),
  component: HomePage,
});

const capabilities = [
  {
    title: "Audit Capability at Scale",
    text: "Sift through thousands of unstructured notes to verify if a hospital has a functional ICU, not just an advertised one.",
    Icon: SearchCheck,
  },
  {
    title: "Identify Specialized Deserts",
    text: "Locate regional gaps in high-acuity care such as Oncology, Dialysis, and Emergency Trauma before crises escalate.",
    Icon: MapPinned,
  },
  {
    title: "Navigate the Truth Gap",
    text: "Reason through non-standard facility descriptions and surface contradictions where claims do not match reported equipment.",
    Icon: ShieldAlert,
  },
];

function HomePage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <GlassCard className="overflow-hidden p-0">
        <div className="relative px-6 py-8 md:px-10 md:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,oklch(0.86_0.08_208/0.32),transparent_38%)]" />
          <div className="relative z-10 max-w-4xl animate-fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[oklch(0.95_0.01_220/0.82)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-teal">
              <BrainCircuit className="h-3.5 w-3.5" /> Agentic Healthcare Intelligence System
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              No family should have to guess where to find urgent care.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              AyuGraph helps teams reason over unstructured facility reports to surface real care capability,
              reduce search friction, and guide people to treatment faster.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/discovery"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-foreground)] transition-transform hover:-translate-y-0.5"
              >
                Start Discovery <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[oklch(0.95_0.01_220/0.82)] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-[var(--color-secondary)]"
              >
                Open Analytics Dashboard
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {capabilities.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
          >
            <GlassCard className="h-full">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-strong)] bg-[oklch(0.78_0.11_210/0.16)] text-teal">
                <item.Icon className="h-4 w-4" />
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard tealTop>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Metric value="10,000" label="Facility reports to reason over" />
          <Metric value="3" label="Core agent responsibilities" />
          <Metric value="1" label="Outcome: faster path to care" />
        </div>
      </GlassCard>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[oklch(0.95_0.01_220/0.82)] p-4">
      <div className="font-mono text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
    </div>
  );
}
