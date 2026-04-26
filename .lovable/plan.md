## AyuGraph — Agentic Healthcare Intelligence

A production-quality, fully-functional demo app with the **Medical Noir / Data Cartography** aesthetic. All data is mocked but realistic; every interaction works end-to-end with zero placeholders.

---

### 🎨 Design System

- **Palette** (CSS tokens in `src/styles.css`, oklch):
  - Background `#0A0D14` (near-black) + dark navy surfaces
  - Primary teal `#00D4C8`, Amber `#F5A623`, Crimson `#E5383B`, Emerald `#2ECC71`
- **Fonts** (Google Fonts, loaded in `__root.tsx` head):
  - **Syne** — display headings
  - **IBM Plex Mono** — numbers, scores, code blocks, terminal input
  - **DM Sans** — body text
- **Glass cards** — semi-transparent dark surfaces, 1px teal border, `backdrop-blur`
- **Micro-animations** — Framer Motion staggered fade-ins, pulse glow on active scores, blinking terminal cursor, typewriter effect for agent output

---

### 🏗️ Architecture

TanStack Router file routes (one per section):
- `src/routes/__root.tsx` — sidebar + top header layout shell, fonts, ticker
- `src/routes/index.tsx` — Dashboard
- `src/routes/discovery.tsx` — Facility Discovery / Query Agent
- `src/routes/validator.tsx` — Trust Validator
- `src/routes/crisis-map.tsx` — Crisis Map
- `src/routes/trace.tsx` — Agent Trace Viewer

Shared building blocks in `src/components/`:
- `AppSidebar.tsx` — fixed 64px sidebar, expands to 220px on hover, logo, nav icons w/ tooltips, "3 Agents Online" pulse
- `TopHeader.tsx` — page title, dataset badge, Live Sync pulse, scrolling agent ticker
- `GlassCard.tsx`, `TrustRing.tsx` (circular SVG progress), `Pill.tsx`, `Typewriter.tsx`, `TerminalInput.tsx`, `PulseDot.tsx`
- `FacilityCard.tsx`, `TraceStep.tsx`, `PipelineFlow.tsx`

All mock data in `src/data/mockData.ts`:
- 8 realistic Indian facilities (varied trust 34–96%)
- 10+ rotating agent log messages
- 15+ map markers (real lat/lng across India)
- Trust-bucket distribution & top-5 desert states
- Trace steps for "cardiac surgery centers in Bihar"
- Top 10 critical PIN codes table data

---

### 📐 Layout (every page)

**Left sidebar (fixed)** — collapsed 64px / hover-expanded 220px, glass dark with right teal border. Logo (medical-cross + graph-node SVG in teal). Nav: Dashboard, Discovery, Validator, Crisis Map, Trace Viewer. Bottom: green pulse + "3 Agents Online".

**Top header** — page title (Syne), right side "India Health Dataset · 10,000 Facilities" badge + Live Sync pulse, horizontal scrolling agent ticker beneath.

---

### 📊 1. Dashboard (`/`)

- 4 KPI glass cards (teal top border): 10,000 Facilities · 6,240 Verified · 847 Medical Deserts · 73% Reduction
- **Left chart** — Recharts `BarChart` of trust-score buckets (red→amber→green gradient bars)
- **Right chart** — Horizontal Recharts bar chart, Top 5 desert states (UP, Bihar, Rajasthan, MP, Jharkhand)
- **Recent Agent Activity Feed** — auto-cycling list, new entry every 4s via `setInterval`, 10+ realistic timestamped messages, color-coded by agent

---

### 🔍 2. Facility Discovery (`/discovery`)

- Terminal-style query bar with blinking teal cursor, IBM Plex Mono, placeholder *"Ask anything..."*
- 4 quick-tap suggestion chips
- "Run Query" button with teal glow pulse
- On submit: 3-step animated progress *Parsing Query → Vector Search → Validating Results* (1.5s each)
- Then reveals 8 facility result cards (staggered fade-in) with: name (Syne), location, specialty pills, **TrustRing** circular progress (color by score), beds/doctors/equipment, "View Thought Process" (opens trace modal), "View on Map"

---

### ✅ 3. Trust Validator (`/validator`)

- **Left** — searchable dropdown of 8 facilities; below it, dark textarea with messy unstructured source text
- **Right** — Validator Agent output streamed line-by-line via typewriter (~15ms/char): claim list, contradictions found, evidence citations, computed trust score with the TrustRing
- "Re-Validate" button replays the animation

---

### 🗺️ 4. Crisis Map (`/crisis-map`)

- **React-Leaflet** with CartoDB dark tiles
- 15+ hardcoded markers (real lat/lng) as `CircleMarker`s color/size-coded RED/AMBER/GREEN by desert tier
- Click popup: PIN code, nearest oncology/ICU distances, classification
- Top-left filter buttons: All / Oncology Gaps / Trauma Gaps / Pediatric Gaps
- Top-right legend panel
- Below map: data table — Top 10 critical PIN codes (PIN, State, District, Nearest ICU, Nearest Oncology, Population, Desert Score) in IBM Plex Mono

Leaflet CSS imported in `__root.tsx`; React-Leaflet rendered client-side only (guarded for SSR).

---

### 🧠 5. Agent Trace Viewer (`/trace`)

- **Top** — horizontal pipeline flow: `[User Query] → [Query Agent] → [Vector Search] → [Validator Agent] → [Trust Filter] → [Ranked Results]`, active node glows teal
- **Token Usage** mini-panel (847 in / 1,203 out / $0.0023)
- **Timeline** of 4 trace steps for *"Find cardiac surgery centers in Bihar"*:
  - Step badge (teal circle), agent tag, collapsible JSON code block, execution-time badge
  - Steps 1 & 3 include "Source Evidence" with matched text highlighted in teal

---

### 🔧 Technical

- TanStack Start + React 19, Tailwind v4 tokens in `src/styles.css`
- Add deps: `recharts`, `leaflet`, `react-leaflet`, `framer-motion`, `lucide-react` (already), plus `@types/leaflet`
- All charts responsive via Recharts `ResponsiveContainer`
- Zero backend; all mock data hardcoded in `src/data/mockData.ts`
- Each route sets its own `head()` meta (title, description, og)

---

### ✅ Final Checklist

- [ ] 5 sections built and navigable via sidebar
- [ ] Query flow with 3-step animated thinking → 8 results
- [ ] Validator typewriter streaming works + Re-Validate
- [ ] Leaflet map renders with colored markers, popups, filters, legend
- [ ] Trace viewer pipeline + 4 timeline steps + token panel
- [ ] Dashboard KPIs, 2 charts, auto-cycling activity feed (4s)
- [ ] Syne + IBM Plex Mono + DM Sans loaded globally
- [ ] Medical-noir dark theme (no purple, no Inter)
- [ ] No placeholder text anywhere