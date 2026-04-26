import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";
import { type Facility } from "@/data/mockData";
import { FacilityCard } from "@/components/FacilityCard";
import { GlassCard } from "@/components/GlassCard";
import { runDiscoveryAgent } from "@/lib/agenticMvp";

export const Route = createFileRoute("/discovery")({
  head: () => ({
    meta: [
      { title: "Facility Discovery — AyuGraph" },
      { name: "description", content: "Query Agent: natural-language search across India's healthcare facility index with vector retrieval and trust validation." },
      { property: "og:title", content: "Facility Discovery — AyuGraph" },
      { property: "og:description", content: "Ask anything: 'Oncology centers in rural Bihar with ICU capacity'." },
    ],
  }),
  component: Discovery,
});

const suggestions = [
  "Trauma centers in UP",
  "Dialysis units near Delhi",
  "Pediatric hospitals in Rajasthan",
  "Cancer care in Jharkhand",
];

const phases = ["Parsing Query", "Vector Search", "Validating Results"] as const;

function Discovery() {
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<-1 | 0 | 1 | 2 | 3>(-1); // -1 idle, 0/1/2 thinking, 3 done
  const [results, setResults] = useState<Facility[]>([]);
  const [runMeta, setRunMeta] = useState<{ latencyMs: number; confidence: number; trace: ReturnType<typeof runDiscoveryAgent>["traceSteps"]; tokenUsage: ReturnType<typeof runDiscoveryAgent>["tokenUsage"] } | null>(null);
  const [trace, setTrace] = useState<Facility | null>(null);

  const run = (queryText?: string) => {
    const query = (queryText ?? q).trim();
    if (!query) return;
    if (queryText !== undefined) setQ(queryText);

    const result = runDiscoveryAgent(query);
    setResults([]);
    setRunMeta({
      latencyMs: result.latencyMs,
      confidence: result.confidence,
      trace: result.traceSteps,
      tokenUsage: result.tokenUsage,
    });
    setPhase(0);
    setTimeout(() => setPhase(1), 700);
    setTimeout(() => setPhase(2), 1400);
    setTimeout(() => {
      setPhase(3);
      setResults(result.ranked);
    }, 2100);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Query bar */}
      <GlassCard className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-teal" />
          Query Agent · Terminal Interface
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-[oklch(1_0_0/0.86)] px-4 py-3">
          <span className="font-mono text-teal">{">"}</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && q && run()}
            placeholder="Ask anything... e.g., 'Find oncology centers in rural Bihar with ICU capacity'"
            className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <span className="caret font-mono" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="rounded-full border border-[var(--color-border)] bg-[oklch(0.98_0.006_220)] px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-[var(--color-border-strong)] hover:text-teal"
            >
              {s}
            </button>
          ))}
          <div className="ml-auto" />
          <button
            onClick={() => q && run()}
            disabled={!q}
            className="animate-pulse-glow inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-foreground)] transition-opacity disabled:opacity-40 disabled:animate-none"
          >
            <Search className="h-3.5 w-3.5" /> Run Query
          </button>
        </div>
      </GlassCard>

      {/* Thinking */}
      <AnimatePresence>
        {phase >= 0 && phase < 3 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Agent Thinking…</div>
              <div className="flex items-center gap-3">
                {phases.map((label, i) => {
                  const active = phase === i;
                  const done = phase > i;
                  return (
                    <div key={label} className="flex flex-1 items-center gap-3">
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className={done ? "text-emerald" : active ? "text-teal" : "text-muted-foreground"}>
                            {done ? "✓" : active ? "→" : "○"}
                          </span>
                          <span className={active ? "text-foreground" : done ? "text-emerald" : "text-muted-foreground"}>
                            {label}
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-[oklch(0.9_0.012_220)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: done ? "100%" : active ? "100%" : "0%" }}
                            transition={{ duration: active ? 1.4 : 0, ease: "easeInOut" }}
                            className="h-full bg-[var(--color-primary)]"
                          />
                        </div>
                      </div>
                      {i < 2 && <span className="text-muted-foreground">·</span>}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {phase === 3 && (
        <>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span><span className="text-teal">{results.length}</span> facilities · trust-weighted ranking</span>
            <span>
              latency {runMeta?.latencyMs ?? 0}ms · confidence {Math.round((runMeta?.confidence ?? 0) * 100)}%
            </span>
          </div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((f, i) => (
                <FacilityCard key={f.id} f={f} delay={i * 0.05} onTrace={setTrace} />
              ))}
            </div>
          ) : (
            <GlassCard>
              <div className="font-mono text-xs text-muted-foreground">
                No high-confidence facilities found for this query. Try broader terms or remove strict constraints.
              </div>
            </GlassCard>
          )}
        </>
      )}

      {/* Trace modal */}
      <AnimatePresence>
        {trace && runMeta && (
          <TraceModal
            facility={trace}
            traceSteps={runMeta.trace}
            tokenUsage={runMeta.tokenUsage}
            onClose={() => setTrace(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TraceModal({
  facility,
  traceSteps,
  tokenUsage,
  onClose,
}: {
  facility: Facility;
  traceSteps: ReturnType<typeof runDiscoveryAgent>["traceSteps"];
  tokenUsage: ReturnType<typeof runDiscoveryAgent>["tokenUsage"];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.35_0.01_246/0.2)] p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Thought Process</div>
        <h2 className="font-display text-2xl font-bold">{facility.name}</h2>
        <p className="font-mono text-xs text-muted-foreground">
          Token usage · in {tokenUsage.input} / out {tokenUsage.output} · ${tokenUsage.costUsd}
        </p>

        <ol className="mt-5 flex flex-col gap-3">
          {traceSteps.map((s) => (
            <li key={s.id} className="rounded-xl border border-[var(--color-border)] bg-[oklch(1_0_0/0.9)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] font-mono text-[11px] font-bold text-[var(--color-primary-foreground)]">{s.id}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-teal">{s.agent}</span>
                  <span className="font-display text-sm font-semibold">{s.title}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{s.ms}ms</span>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}
