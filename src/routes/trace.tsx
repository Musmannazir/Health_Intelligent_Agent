import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { traceSteps, tokenUsage } from "@/data/mockData";
import { ChevronDown, ChevronRight, Coins, Cpu, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/trace")({
  head: () => ({
    meta: [
      { title: "Agent Trace Viewer — AyuGraph" },
      { name: "description", content: "MLflow-style timeline of agent reasoning steps for the query 'Find cardiac surgery centers in Bihar'." },
      { property: "og:title", content: "Agent Trace Viewer — AyuGraph" },
      { property: "og:description", content: "Step-by-step explainability for every agentic decision." },
    ],
  }),
  component: TracePage,
});

const pipeline = [
  { id: "user",   label: "User Query",       active: false },
  { id: "qparse", label: "Query Agent",      active: true },
  { id: "vsearch",label: "Vector Search",    active: false },
  { id: "valid",  label: "Validator Agent",  active: false },
  { id: "trust",  label: "Trust Filter",     active: false },
  { id: "rank",   label: "Ranked Results",   active: false },
];

function TracePage() {
  const [activeIdx, setActiveIdx] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Pipeline */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Pipeline</div>
            <h3 className="font-display text-lg font-semibold">Trace · "Find cardiac surgery centers in Bihar"</h3>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[oklch(0.16_0.018_250)] px-3 py-2">
            <Coins className="h-4 w-4 text-amber" />
            <div className="flex gap-4 font-mono text-[11px]">
              <span><span className="text-muted-foreground">in</span> <span className="text-foreground">{tokenUsage.input}</span></span>
              <span><span className="text-muted-foreground">out</span> <span className="text-foreground">{tokenUsage.output}</span></span>
              <span><span className="text-muted-foreground">$</span> <span className="text-teal">{tokenUsage.costUsd}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pipeline.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2">
              <button
                onClick={() => setActiveIdx(i)}
                className={
                  "rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all " +
                  (activeIdx === i
                    ? "border-[var(--color-primary)] bg-[oklch(0.79_0.14_188/0.18)] text-teal glow-teal"
                    : "border-[var(--color-border)] bg-[oklch(0.16_0.018_250)] text-muted-foreground hover:text-foreground")
                }
              >
                {node.label}
              </button>
              {i < pipeline.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Steps timeline */}
      <div className="grid grid-cols-[40px_1fr] gap-4">
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--color-border-strong)]" />
        </div>
        <div className="flex flex-col gap-4">
          {traceSteps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StepCard idx={i} step={s} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, idx }: { step: typeof traceSteps[number]; idx: number }) {
  const [open, setOpen] = useState(idx < 2);
  return (
    <div className="relative -ml-12 pl-12">
      <span className="absolute left-2 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[oklch(0.14_0.018_250)] font-mono text-[11px] font-bold text-teal glow-teal">
        {step.id}
      </span>
      <GlassCard delay={0}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded border border-[var(--color-border-strong)] bg-[oklch(0.79_0.14_188/0.1)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-teal">
                {step.agent}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">·</span>
              <span className="rounded border border-[var(--color-border)] bg-[oklch(0.20_0.022_250)] px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                <Cpu className="mr-1 inline h-2.5 w-2.5" />{step.ms}ms
              </span>
            </div>
            <h4 className="mt-2 font-display text-base font-semibold">{step.title}</h4>
          </div>
          <button onClick={() => setOpen((o) => !o)} className="text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <pre className="mt-3 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[oklch(0.10_0.018_250)] p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              <code>{JSON.stringify(step.data, null, 2)}</code>
            </pre>

            {step.evidence && (
              <div className="mt-3 rounded-md border border-[oklch(0.79_0.14_188/0.3)] bg-[oklch(0.79_0.14_188/0.06)] p-3">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Source Evidence</div>
                <div className="font-mono text-[11px] text-muted-foreground">{step.evidence.source}</div>
                <div className="mt-1 font-mono text-xs">
                  {highlight(step.evidence.quote, step.evidence.highlight)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}

function highlight(text: string, needle: string) {
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return <span className="text-foreground">"{text}"</span>;
  return (
    <span className="text-foreground">
      "{text.slice(0, i)}
      <mark className="rounded bg-[oklch(0.79_0.14_188/0.35)] px-1 text-teal">{text.slice(i, i + needle.length)}</mark>
      {text.slice(i + needle.length)}"
    </span>
  );
}
