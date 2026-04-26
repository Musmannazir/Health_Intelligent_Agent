export type Facility = {
  id: string;
  name: string;
  city: string;
  state: string;
  pin: string;
  specialties: string[];
  trust: number;
  beds: number;
  doctors: number;
  equipment: string[];
  rawReport: string;
  validation: ValidationResult;
};

export type ValidationResult = {
  claims: string[];
  contradictions: { text: string; severity: "high" | "medium" | "low" }[];
  evidence: { source: string; quote: string }[];
  computedScore: number;
  verdict: string;
};

export const facilities: Facility[] = [
  {
    id: "f1",
    name: "Safdarjung Hospital",
    city: "New Delhi",
    state: "Delhi",
    pin: "110029",
    specialties: ["Trauma", "Oncology", "ICU", "Cardiac"],
    trust: 96,
    beds: 2900,
    doctors: 412,
    equipment: ["MRI 3T", "CT Scanner", "Linear Accelerator", "Cath Lab", "Dialysis Unit"],
    rawReport:
      "Safdarjung Hosp, New Delhi. 2900 beds verified via MoHFW registry. Active trauma center, 24x7 ICU (84 beds), oncology dept w/ linear accelerator (Varian TrueBeam). Cardiac surg team: 12 surgeons, 8 anesthesiologists. Equip log Q3-2024 confirms MRI 3T operational.",
    validation: {
      claims: [
        "2900 inpatient beds",
        "Active Level-1 Trauma Center",
        "Oncology with Linear Accelerator",
        "Cardiac surgery — 12 surgeons, 8 anesthesiologists",
      ],
      contradictions: [],
      evidence: [
        { source: "MoHFW Registry · row 0421", quote: "Safdarjung — 2900 beds — Tertiary" },
        { source: "Equipment Log Q3-2024", quote: "Varian TrueBeam · operational · cal 2024-08-12" },
      ],
      computedScore: 96,
      verdict: "VERIFIED — All claims cross-referenced. No contradictions. Recommend INDEX.",
    },
  },
  {
    id: "f2",
    name: "Apex Care Hospital",
    city: "Patna",
    state: "Bihar",
    pin: "800001",
    specialties: ["Cardiac", "General Surgery"],
    trust: 34,
    beds: 80,
    doctors: 9,
    equipment: ["ECG", "X-Ray", "Basic OT"],
    rawReport:
      "Hosp has 2 OT, claims crdiac surg & advanced surgery, staff: 1 gen surgeon, equipmnt: ECG, X-Ray, ultrasound. No anesthesia staff listed. Beds: ~80. Cardiac specialist visits Tue/Fri only.",
    validation: {
      claims: [
        "Advertises 'Advanced Cardiac Surgery'",
        "2 Operating Theatres",
        "80 inpatient beds",
        "1 general surgeon on staff",
      ],
      contradictions: [
        { text: "Claims Advanced Cardiac Surgery but lists 0 anesthesiologists", severity: "high" },
        { text: "Claims Advanced Surgery but only 1 general surgeon on roster", severity: "high" },
        { text: "No cath-lab or perfusionist listed despite cardiac claim", severity: "medium" },
      ],
      evidence: [
        { source: "row 4821 · unstructured_notes", quote: "...crdiac surg... staff: 1 gen surgeon..." },
        { source: "row 4821 · equipment", quote: "ECG, X-Ray, ultrasound" },
      ],
      computedScore: 34,
      verdict: "LOW TRUST — Critical capability mismatch. Suppress from cardiac search results.",
    },
  },
  {
    id: "f3",
    name: "Sanjay Gandhi PGI",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pin: "226014",
    specialties: ["Oncology", "Nephrology", "ICU", "Transplant"],
    trust: 92,
    beds: 1100,
    doctors: 286,
    equipment: ["MRI", "PET-CT", "Linear Accelerator", "Dialysis (24)", "ECMO"],
    rawReport:
      "SGPGI Lucknow — institute of national importance. 1100 beds, dedicated oncology block, PET-CT installed 2022. ECMO program active. Renal transplant: 180+ procedures FY24.",
    validation: {
      claims: ["PET-CT operational", "ECMO program", "Renal transplant program", "1100 beds"],
      contradictions: [],
      evidence: [
        { source: "MoHFW Registry · row 0188", quote: "SGPGI Lucknow — 1100 beds — INI" },
        { source: "Annual Report FY24", quote: "180 renal transplants performed" },
      ],
      computedScore: 92,
      verdict: "VERIFIED — Tertiary referral center. INDEX with HIGH priority.",
    },
  },
  {
    id: "f4",
    name: "Sawai Man Singh Hospital",
    city: "Jaipur",
    state: "Rajasthan",
    pin: "302004",
    specialties: ["Trauma", "Pediatrics", "ICU"],
    trust: 84,
    beds: 1750,
    doctors: 320,
    equipment: ["CT Scanner", "MRI", "NICU 40 beds", "Pediatric ICU"],
    rawReport:
      "SMS Hospital Jaipur — govt tertiary, 1750 beds. NICU 40 cots. Pediatric trauma daily intake ~30. CT 24x7. MRI weekday only.",
    validation: {
      claims: ["1750 beds", "NICU 40 cots", "24x7 CT scan", "Pediatric trauma intake"],
      contradictions: [{ text: "MRI claimed 24x7 elsewhere but log shows weekday-only", severity: "low" }],
      evidence: [{ source: "row 1042 · ops_log", quote: "MRI: Mon-Fri 08:00-20:00" }],
      computedScore: 84,
      verdict: "VERIFIED with minor caveat. INDEX.",
    },
  },
  {
    id: "f5",
    name: "Ranchi Sadar Hospital",
    city: "Ranchi",
    state: "Jharkhand",
    pin: "834001",
    specialties: ["General", "Pediatrics"],
    trust: 58,
    beds: 300,
    doctors: 42,
    equipment: ["X-Ray", "Ultrasound", "Basic Lab", "12-bed ICU"],
    rawReport:
      "Sadar Hosp Ranchi. 300 beds. ICU has 12 beds but only 4 ventilators. Pediatric ward 40 beds. No oncology services. Blood bank shared with district facility.",
    validation: {
      claims: ["12-bed ICU", "4 ventilators", "300 beds", "Pediatric ward 40 beds"],
      contradictions: [{ text: "ICU bed-to-ventilator ratio 3:1 — capacity overstated", severity: "medium" }],
      evidence: [{ source: "row 7711 · equipment", quote: "ICU: 12 beds | Ventilators: 4" }],
      computedScore: 58,
      verdict: "MEDIUM TRUST — Index but flag ICU capacity constraints in results.",
    },
  },
  {
    id: "f6",
    name: "Tata Memorial Hospital",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400012",
    specialties: ["Oncology", "Hematology", "Surgical Oncology"],
    trust: 98,
    beds: 700,
    doctors: 240,
    equipment: ["Cyclotron", "PET-CT", "Linear Accelerator x4", "Robotic Surgery"],
    rawReport:
      "Tata Memorial Mumbai — apex cancer center. 4 LINACs, cyclotron operational, 70k OPD/yr. Robotic da Vinci system since 2018. NABH accredited.",
    validation: {
      claims: ["4 Linear Accelerators", "Cyclotron", "Robotic surgery", "NABH accredited"],
      contradictions: [],
      evidence: [
        { source: "NABH Registry", quote: "TMH Mumbai · NABH cert · valid 2026" },
        { source: "Annual Report FY24", quote: "70,213 cancer OPD visits" },
      ],
      computedScore: 98,
      verdict: "VERIFIED — Apex oncology center. PIN with MAX priority.",
    },
  },
  {
    id: "f7",
    name: "District Hospital Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pin: "462001",
    specialties: ["General", "Obstetrics"],
    trust: 67,
    beds: 450,
    doctors: 58,
    equipment: ["CT Scanner", "Ultrasound", "16-bed ICU", "Labour Ward"],
    rawReport:
      "DH Bhopal. 450 beds. CT installed 2021. ICU 16 beds. OBGYN dept handles ~600 deliveries/month. No NICU — refers to Hamidia.",
    validation: {
      claims: ["CT scanner installed 2021", "16-bed ICU", "600 deliveries/month"],
      contradictions: [{ text: "Handles 600 deliveries/month but no NICU on site", severity: "medium" }],
      evidence: [{ source: "row 3301 · referrals", quote: "Neonates referred to Hamidia (8.4 km)" }],
      computedScore: 67,
      verdict: "MEDIUM TRUST — Index for general care; suppress for high-risk obstetric queries.",
    },
  },
  {
    id: "f8",
    name: "AIIMS Patna",
    city: "Patna",
    state: "Bihar",
    pin: "801507",
    specialties: ["Oncology", "Cardiac", "Trauma", "ICU"],
    trust: 89,
    beds: 960,
    doctors: 305,
    equipment: ["MRI 3T", "PET-CT", "Linear Accelerator", "Cath Lab x2"],
    rawReport:
      "AIIMS Patna — 960 beds operational, oncology block opened 2023, 2 cath labs, cardiac surg team of 7 + 5 anesthesiologists. PET-CT operational.",
    validation: {
      claims: ["960 beds", "PET-CT", "2 Cath Labs", "Cardiac surgery — 7 surgeons, 5 anesthesiologists"],
      contradictions: [],
      evidence: [
        { source: "MoHFW · row 0902", quote: "AIIMS Patna · 960 beds · INI" },
        { source: "row 0902 · unstructured_notes", quote: "...cardiac surg team of 7 + 5 anesthesiologists..." },
      ],
      computedScore: 89,
      verdict: "VERIFIED — INDEX with HIGH priority for Bihar cardiac queries.",
    },
  },
];

export const trustBuckets = [
  { bucket: "0–20", count: 412, color: "var(--color-destructive)" },
  { bucket: "20–40", count: 1186, color: "var(--color-destructive)" },
  { bucket: "40–60", count: 2162, color: "var(--color-warning)" },
  { bucket: "60–80", count: 3240, color: "var(--color-warning)" },
  { bucket: "80–100", count: 3000, color: "var(--color-success)" },
];

export const desertStates = [
  { state: "Uttar Pradesh", gaps: 213 },
  { state: "Bihar", gaps: 187 },
  { state: "Rajasthan", gaps: 142 },
  { state: "Madhya Pradesh", gaps: 128 },
  { state: "Jharkhand", gaps: 96 },
];

export const agentLogs = [
  '[EXTRACTION AGENT] — Parsed facility "Safdarjung Hospital, Delhi" · Extracted 23 fields',
  '[VALIDATOR AGENT] — CONTRADICTION DETECTED: "Apex Care, Patna" claims Advanced Surgery but lists 0 Anesthesiologists · Trust Score: 34%',
  '[QUERY AGENT] — Answered query "Oncology centers in UP within 50km" · 7 results returned · Confidence: 91%',
  '[EXTRACTION AGENT] — Ingested batch shard 0042 · 412 unstructured records normalized',
  '[VALIDATOR AGENT] — Verified "Tata Memorial, Mumbai" · NABH cross-ref OK · Trust Score: 98%',
  '[QUERY AGENT] — Vector recall: "pediatric ICU Rajasthan" · top-k=8 · latency 84ms',
  '[EXTRACTION AGENT] — Field "anesthesia_staff" missing for 14 facilities in Bihar',
  '[VALIDATOR AGENT] — Suppressed "Apex Care, Patna" from cardiac search results',
  '[QUERY AGENT] — Reranked 12 candidates · trust-weighted Borda fusion',
  '[EXTRACTION AGENT] — OCR pass on PDF report 8821-J · 1.2s · 96% confidence',
  '[VALIDATOR AGENT] — Flagged ICU bed:ventilator ratio anomaly · Ranchi Sadar',
  '[QUERY AGENT] — Detected medical desert · PIN 814165 · nearest oncology 184km',
];

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  pin: string;
  state: string;
  district: string;
  tier: "desert" | "underserved" | "adequate";
  nearestICU: number;
  nearestOnc: number;
  population: number;
  desertScore: number;
  gapTypes: ("oncology" | "trauma" | "pediatric")[];
  classification: string;
};

export const mapMarkers: MapMarker[] = [
  { id: "m1",  lat: 28.6139, lng: 77.2090, pin: "110029", state: "Delhi",         district: "South Delhi",  tier: "adequate",   nearestICU: 2,   nearestOnc: 4,   population: 2700000, desertScore: 12, gapTypes: [],                                       classification: "ADEQUATE" },
  { id: "m2",  lat: 19.0760, lng: 72.8777, pin: "400012", state: "Maharashtra",   district: "Mumbai",       tier: "adequate",   nearestICU: 1,   nearestOnc: 2,   population: 12400000, desertScore: 8,  gapTypes: [],                                       classification: "ADEQUATE" },
  { id: "m3",  lat: 25.5941, lng: 85.1376, pin: "800001", state: "Bihar",         district: "Patna",        tier: "underserved",nearestICU: 9,   nearestOnc: 38,  population: 2046000, desertScore: 58, gapTypes: ["oncology"],                             classification: "UNDERSERVED" },
  { id: "m4",  lat: 25.0961, lng: 85.3131, pin: "803101", state: "Bihar",         district: "Nalanda",      tier: "desert",     nearestICU: 47,  nearestOnc: 142, population: 280000,  desertScore: 89, gapTypes: ["oncology","trauma"],                    classification: "CRITICAL" },
  { id: "m5",  lat: 24.7914, lng: 85.0002, pin: "824201", state: "Bihar",         district: "Gaya",         tier: "desert",     nearestICU: 62,  nearestOnc: 168, population: 470000,  desertScore: 92, gapTypes: ["oncology","pediatric"],                 classification: "CRITICAL" },
  { id: "m6",  lat: 26.8467, lng: 80.9462, pin: "226014", state: "Uttar Pradesh", district: "Lucknow",      tier: "adequate",   nearestICU: 3,   nearestOnc: 6,   population: 3500000, desertScore: 14, gapTypes: [],                                       classification: "ADEQUATE" },
  { id: "m7",  lat: 27.5706, lng: 81.6960, pin: "262701", state: "Uttar Pradesh", district: "Bahraich",     tier: "desert",     nearestICU: 71,  nearestOnc: 184, population: 540000,  desertScore: 94, gapTypes: ["oncology","trauma","pediatric"],         classification: "CRITICAL" },
  { id: "m8",  lat: 26.4499, lng: 80.3319, pin: "208001", state: "Uttar Pradesh", district: "Kanpur",       tier: "underserved",nearestICU: 5,   nearestOnc: 28,  population: 2950000, desertScore: 44, gapTypes: ["oncology"],                             classification: "UNDERSERVED" },
  { id: "m9",  lat: 26.9124, lng: 75.7873, pin: "302004", state: "Rajasthan",     district: "Jaipur",       tier: "adequate",   nearestICU: 2,   nearestOnc: 8,   population: 3100000, desertScore: 18, gapTypes: [],                                       classification: "ADEQUATE" },
  { id: "m10", lat: 27.1751, lng: 78.0421, pin: "342001", state: "Rajasthan",     district: "Jodhpur",      tier: "underserved",nearestICU: 14,  nearestOnc: 62,  population: 1140000, desertScore: 51, gapTypes: ["oncology"],                             classification: "UNDERSERVED" },
  { id: "m11", lat: 25.3463, lng: 70.7833, pin: "344001", state: "Rajasthan",     district: "Barmer",       tier: "desert",     nearestICU: 88,  nearestOnc: 212, population: 220000,  desertScore: 96, gapTypes: ["oncology","trauma","pediatric"],         classification: "CRITICAL" },
  { id: "m12", lat: 23.2599, lng: 77.4126, pin: "462001", state: "Madhya Pradesh",district: "Bhopal",       tier: "underserved",nearestICU: 4,   nearestOnc: 22,  population: 1880000, desertScore: 41, gapTypes: ["pediatric"],                             classification: "UNDERSERVED" },
  { id: "m13", lat: 21.9497, lng: 80.7081, pin: "481001", state: "Madhya Pradesh",district: "Balaghat",     tier: "desert",     nearestICU: 56,  nearestOnc: 178, population: 320000,  desertScore: 87, gapTypes: ["oncology","trauma"],                    classification: "CRITICAL" },
  { id: "m14", lat: 23.3441, lng: 85.3096, pin: "834001", state: "Jharkhand",     district: "Ranchi",       tier: "underserved",nearestICU: 6,   nearestOnc: 34,  population: 1080000, desertScore: 47, gapTypes: ["oncology"],                             classification: "UNDERSERVED" },
  { id: "m15", lat: 24.4844, lng: 86.6979, pin: "814165", state: "Jharkhand",     district: "Dumka",        tier: "desert",     nearestICU: 78,  nearestOnc: 184, population: 380000,  desertScore: 91, gapTypes: ["oncology","pediatric"],                 classification: "CRITICAL" },
  { id: "m16", lat: 22.5726, lng: 88.3639, pin: "700001", state: "West Bengal",   district: "Kolkata",      tier: "adequate",   nearestICU: 2,   nearestOnc: 5,   population: 4500000, desertScore: 11, gapTypes: [],                                       classification: "ADEQUATE" },
];

export const criticalPins = mapMarkers
  .filter((m) => m.tier === "desert")
  .sort((a, b) => b.desertScore - a.desertScore)
  .map((m) => ({
    pin: m.pin,
    state: m.state,
    district: m.district,
    nearestICU: m.nearestICU,
    nearestOnc: m.nearestOnc,
    population: m.population,
    desertScore: m.desertScore,
  }));

export type TraceStep = {
  id: number;
  agent: "QUERY AGENT" | "VALIDATOR AGENT";
  title: string;
  ms: number;
  data: Record<string, unknown>;
  evidence?: { source: string; quote: string; highlight: string };
};

export const traceSteps: TraceStep[] = [
  {
    id: 1,
    agent: "QUERY AGENT",
    title: "PARSE — Decompose natural-language query",
    ms: 84,
    data: {
      raw_query: "Find cardiac surgery centers in Bihar",
      intent: "facility_lookup",
      entities: { specialty: "cardiac surgery", region: "Bihar", country: "IN" },
      filters: { specialty: ["Cardiac"], state: ["Bihar"] },
      embedding_dim: 1536,
    },
    evidence: {
      source: "row 0902 · unstructured_notes",
      quote: "AIIMS Patna · cardiac surg team of 3 surgeons + 2 anesthesia",
      highlight: "cardiac surg team of 3",
    },
  },
  {
    id: 2,
    agent: "QUERY AGENT",
    title: "VECTOR SEARCH — Cosine similarity over facility index",
    ms: 142,
    data: {
      index: "facilities_v3",
      shards_hit: 4,
      top_k: 12,
      candidates: ["AIIMS Patna", "Apex Care Patna", "IGIMS Patna", "+9 more"],
      latency_ms: 142,
    },
  },
  {
    id: 3,
    agent: "VALIDATOR AGENT",
    title: "CROSS-REFERENCE — Validate claims vs. evidence",
    ms: 318,
    data: {
      checks_run: ["staff_consistency", "equipment_match", "registry_xref"],
      verified: ["AIIMS Patna", "IGIMS Patna"],
      flagged: [
        { facility: "Apex Care Patna", reason: "0 anesthesiologists for cardiac claim", severity: "high" },
      ],
    },
    evidence: {
      source: "row 4821 · unstructured_notes",
      quote: "Apex Care · staff: 1 gen surgeon · No anesthesia staff listed",
      highlight: "No anesthesia staff listed",
    },
  },
  {
    id: 4,
    agent: "QUERY AGENT",
    title: "RANK & RESPOND — Trust-weighted Borda fusion",
    ms: 67,
    data: {
      ranking_strategy: "trust_weighted_borda",
      results: [
        { rank: 1, facility: "AIIMS Patna", trust: 89 },
        { rank: 2, facility: "IGIMS Patna", trust: 81 },
        { rank: 3, facility: "Mahavir Vatsalya", trust: 74 },
      ],
      suppressed: ["Apex Care Patna (trust=34, contradiction)"],
      response_confidence: 0.91,
    },
  },
];

export const tokenUsage = { input: 847, output: 1203, costUsd: 0.0023 };
