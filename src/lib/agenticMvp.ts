import { facilities, type Facility, type TraceStep, type ValidationResult } from "@/data/mockData";

type QueryIntent = {
  specialties: string[];
  state?: string;
  tokens: string[];
};

type QueryRunResult = {
  query: string;
  ranked: Facility[];
  suppressed: string[];
  confidence: number;
  latencyMs: number;
  traceSteps: TraceStep[];
  tokenUsage: { input: number; output: number; costUsd: number };
};

const specialtyRules: Array<{ specialty: string; terms: string[] }> = [
  { specialty: "Oncology", terms: ["oncology", "cancer", "tumor", "chemo"] },
  { specialty: "Trauma", terms: ["trauma", "emergency", "critical", "accident"] },
  { specialty: "Pediatrics", terms: ["pediatric", "neonatal", "child", "nicu"] },
  { specialty: "Cardiac", terms: ["cardiac", "heart", "cardio"] },
  { specialty: "ICU", terms: ["icu", "intensive", "ventilator"] },
  { specialty: "Nephrology", terms: ["dialysis", "renal", "nephro"] },
  { specialty: "General Surgery", terms: ["surgery", "appendectomy", "operation"] },
];

const knownStates = [...new Set(facilities.map((f) => f.state))];

const latestTraceState: {
  query: string;
  traceSteps: TraceStep[];
  tokenUsage: { input: number; output: number; costUsd: number };
  timestamp: number;
} = {
  query: "Find cardiac surgery centers in Bihar",
  traceSteps: [],
  tokenUsage: { input: 0, output: 0, costUsd: 0 },
  timestamp: 0,
};

function parseIntent(query: string): QueryIntent {
  const q = query.toLowerCase();
  const specialties = specialtyRules
    .filter((rule) => rule.terms.some((term) => q.includes(term)))
    .map((rule) => rule.specialty);

  const state = knownStates.find((s) => q.includes(s.toLowerCase()));
  const tokens = q
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return {
    specialties: specialties.length ? specialties : ["General"],
    state,
    tokens,
  };
}

function quoteFor(report: string, keyword: string) {
  const idx = report.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx < 0) {
    return report.slice(0, 120);
  }
  const start = Math.max(0, idx - 35);
  const end = Math.min(report.length, idx + 85);
  return report.slice(start, end).trim();
}

function computeValidation(facility: Facility): ValidationResult {
  const report = facility.rawReport;
  const lower = report.toLowerCase();
  const contradictions: ValidationResult["contradictions"] = [];
  const evidence: ValidationResult["evidence"] = [];

  const claims = [
    `${facility.beds} inpatient beds`,
    `Specialties: ${facility.specialties.join(", ")}`,
    `Equipment listed: ${facility.equipment.slice(0, 3).join(", ")}`,
  ];

  if (facility.specialties.includes("Cardiac") && !/anesthesiolog|cath lab|cath-lab/i.test(lower)) {
    contradictions.push({
      text: "Cardiac capability appears without clear anesthesia/cath-lab evidence in report text.",
      severity: "high",
    });
    evidence.push({
      source: `${facility.id} · unstructured_report`,
      quote: quoteFor(report, "cardiac"),
    });
  }

  if (facility.specialties.includes("ICU") && /icu/i.test(lower) && /ventilator/i.test(lower)) {
    const nums = [...lower.matchAll(/(\d+)\s*(?:bed|beds|ventilator|ventilators)/g)].map((m) => Number(m[1]));
    if (nums.length >= 2 && nums[0] > nums[1] * 2) {
      contradictions.push({
        text: "ICU bed-to-ventilator ratio suggests overstated functional ICU capacity.",
        severity: "medium",
      });
      evidence.push({
        source: `${facility.id} · unstructured_report`,
        quote: quoteFor(report, "ventilator"),
      });
    }
  }

  if (facility.specialties.includes("Oncology") && !/linear accelerator|linac|pet-ct|oncology block/i.test(lower)) {
    contradictions.push({
      text: "Oncology service is listed but report lacks high-acuity oncology equipment evidence.",
      severity: "medium",
    });
    evidence.push({
      source: `${facility.id} · unstructured_report`,
      quote: quoteFor(report, "oncology"),
    });
  }

  if (contradictions.length === 0) {
    evidence.push({ source: `${facility.id} · unstructured_report`, quote: report.slice(0, 140) });
  }

  const penalty = contradictions.reduce((acc, c) => acc + (c.severity === "high" ? 22 : c.severity === "medium" ? 12 : 6), 0);
  const computedScore = Math.max(12, Math.min(99, Math.round(facility.trust - penalty + (contradictions.length ? 0 : 3))));
  const verdict =
    computedScore >= 80
      ? "VERIFIED - high confidence in reported capability."
      : computedScore >= 60
        ? "MEDIUM TRUST - usable with caution and explicit caveats."
        : "LOW TRUST - high contradiction risk, suppress for critical referrals.";

  return {
    claims,
    contradictions,
    evidence,
    computedScore,
    verdict,
  };
}

function scoreFacility(facility: Facility, intent: QueryIntent) {
  const text = `${facility.rawReport} ${facility.specialties.join(" ")} ${facility.equipment.join(" ")}`.toLowerCase();

  const specialtyHits = intent.specialties.filter((s) =>
    s === "General" ? true : facility.specialties.includes(s) || text.includes(s.toLowerCase()),
  ).length;

  const tokenHits = intent.tokens.filter((t) => t.length > 3 && text.includes(t)).length;
  const stateHit = intent.state && facility.state === intent.state ? 1 : 0;

  return specialtyHits * 35 + tokenHits * 4 + stateHit * 24 + facility.trust * 0.35;
}

function enrichFacility(facility: Facility): Facility {
  const validation = computeValidation(facility);
  return {
    ...facility,
    trust: validation.computedScore,
    validation,
  };
}

export function runDiscoveryAgent(query: string): QueryRunResult {
  const started = Date.now();
  const intent = parseIntent(query);

  const candidates = facilities
    .map((f) => ({ facility: enrichFacility(f), score: scoreFacility(f, intent) }))
    .sort((a, b) => b.score - a.score);

  const suppressed = candidates
    .filter((c) => c.facility.validation.computedScore < 50)
    .map((c) => `${c.facility.name} (trust=${c.facility.validation.computedScore})`);

  const ranked = candidates
    .filter((c) => c.facility.validation.computedScore >= 50)
    .slice(0, 8)
    .map((c) => c.facility);

  const confidence = Math.min(0.97, Math.max(0.58, 0.62 + ranked.length * 0.03 - suppressed.length * 0.02));
  const latencyMs = Date.now() - started + 70;

  const traceSteps: TraceStep[] = [
    {
      id: 1,
      agent: "QUERY AGENT",
      title: "PARSE - Decompose natural-language query",
      ms: 42,
      data: {
        raw_query: query,
        entities: {
          specialties: intent.specialties,
          state: intent.state ?? "any",
        },
        token_count: intent.tokens.length,
      },
    },
    {
      id: 2,
      agent: "QUERY AGENT",
      title: "VECTOR-STYLE RETRIEVAL - Rank candidate facilities",
      ms: 81,
      data: {
        candidates_scanned: facilities.length,
        top_candidates: candidates.slice(0, 5).map((c) => ({ facility: c.facility.name, score: Math.round(c.score) })),
      },
    },
    {
      id: 3,
      agent: "VALIDATOR AGENT",
      title: "CROSS-CHECK - Detect contradictions and trust gaps",
      ms: 116,
      data: {
        suppressed,
        flagged: candidates
          .filter((c) => c.facility.validation.contradictions.length > 0)
          .slice(0, 4)
          .map((c) => ({
            facility: c.facility.name,
            contradictions: c.facility.validation.contradictions.length,
            trust: c.facility.validation.computedScore,
          })),
      },
      evidence: ranked[0]
        ? {
            source: `${ranked[0].id} · unstructured_report`,
            quote: ranked[0].validation.evidence[0]?.quote ?? ranked[0].rawReport.slice(0, 120),
            highlight: ranked[0].specialties[0] ?? "capability",
          }
        : undefined,
    },
    {
      id: 4,
      agent: "QUERY AGENT",
      title: "RANK & RESPOND - Trust-aware final recommendation",
      ms: 59,
      data: {
        response_count: ranked.length,
        confidence,
        output: ranked.slice(0, 3).map((f, i) => ({ rank: i + 1, facility: f.name, trust: f.trust })),
      },
    },
  ];

  const tokenUsage = {
    input: Math.max(180, query.length * 6 + facilities.length * 9),
    output: Math.max(260, ranked.length * 95 + 140),
    costUsd: Number(((query.length * 0.0000024) + ranked.length * 0.00011 + 0.0008).toFixed(4)),
  };

  latestTraceState.query = query;
  latestTraceState.traceSteps = traceSteps;
  latestTraceState.tokenUsage = tokenUsage;
  latestTraceState.timestamp = Date.now();

  return {
    query,
    ranked,
    suppressed,
    confidence,
    latencyMs,
    traceSteps,
    tokenUsage,
  };
}

export function validateFacilityAgent(facility: Facility) {
  return enrichFacility(facility);
}

export function getLatestTrace() {
  if (!latestTraceState.traceSteps.length) {
    runDiscoveryAgent("Find cardiac surgery centers in Bihar");
  }
  return latestTraceState;
}

export function buildSystemSnapshot() {
  const enriched = facilities.map(enrichFacility);

  const buckets = [
    { bucket: "0-20", count: 0 },
    { bucket: "20-40", count: 0 },
    { bucket: "40-60", count: 0 },
    { bucket: "60-80", count: 0 },
    { bucket: "80-100", count: 0 },
  ];

  for (const f of enriched) {
    if (f.trust < 20) buckets[0].count++;
    else if (f.trust < 40) buckets[1].count++;
    else if (f.trust < 60) buckets[2].count++;
    else if (f.trust < 80) buckets[3].count++;
    else buckets[4].count++;
  }

  return {
    enriched,
    buckets,
  };
}
