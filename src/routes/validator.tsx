import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TrustRing } from "@/components/TrustRing";
import { Typewriter } from "@/components/Typewriter";
import { facilities, type Facility } from "@/data/mockData";
import { RotateCw, AlertOctagon, CheckCircle2, FileSearch } from "lucide-react";
import { validateFacilityAgent } from "@/lib/agenticMvp";

export const Route = createFileRoute("/validator")({
  head: () => ({
    meta: [
      { title: "Trust Validator — AyuGraph" },
      { name: "description", content: "Inspect raw unstructured facility reports and re-run the Validator Agent to surface contradictions, evidence, and trust scores." },
      { property: "og:title", content: "Trust Validator — AyuGraph" },
      { property: "og:description", content: "Cross-reference claims against evidence in unstructured medical reports." },
    ],
  }),
  component: ValidatorPage,
});

function ValidatorPage() {
  const [selected, setSelected] = useState<Facility>(() => validateFacilityAgent(facilities[1])); // Apex Care default — most interesting
  const [runId, setRunId] = useState(0);
  const [step, setStep] = useState(0);

  const onSelect = (f: Facility) => {
    setSelected(validateFacilityAgent(f));
    setRunId((r) => r + 1);
    setStep(0);
  };

  const revalidate = () => {
    setSelected((prev) => validateFacilityAgent(prev));
    setRunId((r) => r + 1);
    setStep(0);
  };

  const v = selected.validation;
  const lines: { tag: string; text: string; color: string }[] = [
    { tag: "INIT",      color: "text-teal",    text: `Loading facility ${selected.id} (${selected.name})...` },
    { tag: "EXTRACT",   color: "text-teal",    text: `Parsed ${v.claims.length} structured claims from raw report.` },
    ...v.claims.map((c) => ({ tag: "CLAIM",   color: "text-[var(--color-info)]", text: `→ ${c}` })),
    { tag: "XREF",      color: "text-amber",   text: `Cross-referencing ${v.evidence.length} evidence source(s)...` },
    ...v.evidence.map((e) => ({ tag: "EVIDENCE", color: "text-muted-foreground", text: `[${e.source}] "${e.quote}"` })),
    ...(v.contradictions.length === 0
      ? [{ tag: "CHECK", color: "text-emerald", text: "No contradictions detected." }]
      : v.contradictions.map((c) => ({
          tag: c.severity === "high" ? "FLAG-HIGH" : c.severity === "medium" ? "FLAG-MED" : "FLAG-LOW",
          color: c.severity === "high" ? "text-crimson" : c.severity === "medium" ? "text-amber" : "text-muted-foreground",
          text: `⚠ ${c.text}`,
        }))),
    { tag: "SCORE",     color: "text-teal",    text: `Computed trust score: ${v.computedScore}%` },
    { tag: "VERDICT",   color: v.computedScore >= 80 ? "text-emerald" : v.computedScore >= 60 ? "text-amber" : "text-crimson",
                        text: v.verdict },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[400px_1fr]">
      {/* LEFT */}
      <div className="flex flex-col gap-4">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">
            <FileSearch className="h-3 w-3" /> Select Facility
          </div>
          <select
            value={selected.id}
            onChange={(e) => onSelect(facilities.find((f) => f.id === e.target.value)!)}
            className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[oklch(1_0_0/0.92)] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-[var(--color-primary)]"
          >
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>{f.name} — {f.city}</option>
            ))}
          </select>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Raw Unstructured Report</div>
            <span className="rounded border border-[var(--color-border)] px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              row {Math.floor(Math.random() * 9000) + 1000}
            </span>
          </div>
          <textarea
            readOnly
            value={selected.rawReport}
            className="h-56 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[oklch(0.98_0.006_220)] p-3 font-mono text-xs leading-relaxed text-muted-foreground outline-none"
          />
          <button
            onClick={revalidate}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-teal transition-colors hover:bg-[oklch(0.78_0.11_210/0.12)]"
          >
            <RotateCw className="h-3.5 w-3.5" /> Re-Validate
          </button>
        </GlassCard>
      </div>

      {/* RIGHT */}
      <GlassCard className="flex min-h-[500px] flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Validator Agent · Output Stream</div>
            <h2 className="mt-1 font-display text-xl font-bold">{selected.name}</h2>
          </div>
          <TrustRing score={v.computedScore} size={84} pulse />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[oklch(0.98_0.006_220)] p-4 font-mono text-xs leading-relaxed">
          <StreamingLines key={runId} lines={lines} onAdvance={setStep} />
        </div>

        {/* Summary footer */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={CheckCircle2} label="Claims" value={v.claims.length.toString()} tone="text-teal" />
          <Stat icon={AlertOctagon} label="Contradictions" value={v.contradictions.length.toString()} tone={v.contradictions.length ? "text-crimson" : "text-emerald"} />
          <Stat icon={FileSearch} label="Evidence Refs" value={v.evidence.length.toString()} tone="text-[var(--color-info)]" />
        </div>
        {step >= 0 && (
          <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Step {Math.min(step + 1, lines.length)} of {lines.length}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function StreamingLines({ lines, onAdvance }: { lines: { tag: string; text: string; color: string }[]; onAdvance: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  const current = lines[idx];

  return (
    <div className="flex flex-col gap-1.5">
      {lines.slice(0, idx).map((l, i) => (
        <div key={i} className="flex gap-3">
          <span className="w-24 shrink-0 text-muted-foreground">[{l.tag}]</span>
          <span className={l.color}>{l.text}</span>
        </div>
      ))}
      {current && (
        <div className="flex gap-3">
          <span className="w-24 shrink-0 text-muted-foreground">[{current.tag}]</span>
          <Typewriter
            text={current.text}
            speed={15}
            className={current.color}
            onDone={() => {
              setTimeout(() => {
                setIdx((i) => i + 1);
                onAdvance(idx + 1);
              }, 200);
            }}
          />
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof CheckCircle2; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[oklch(1_0_0/0.9)] p-3">
      <Icon className={`h-4 w-4 ${tone}`} />
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`font-mono text-lg font-bold ${tone}`}>{value}</div>
      </div>
    </div>
  );
}
