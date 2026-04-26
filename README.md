# AyuGraph Health Nexus

Agentic Healthcare Intelligence MVP for faster, safer facility discovery across messy medical records.

Built for Challenge 03: Serving A Nation - Building Agentic Healthcare Maps for 1.4 Billion Lives.

## Problem

Healthcare access is often a discovery and coordination problem, not only an infrastructure problem.
People may travel long distances only to find that a listed facility cannot provide the required critical care.

AyuGraph addresses this by adding a reasoning layer over unstructured facility descriptions to:

1. Discover facilities by intent, not just keywords.
2. Validate claims against evidence and detect contradictions.
3. Surface trust-aware recommendations and traceable decisions.
4. Highlight high-risk medical deserts geographically.

## What This MVP Delivers

This project implements a working in-app agentic loop:

1. Parse query intent.
2. Retrieve and rank candidate facilities.
3. Validate contradictions and compute trust.
4. Produce traceable reasoning steps.
5. Present results in decision-friendly UI views.

### Product Routes

1. Home: mission and capability overview.
2. Dashboard: operational KPIs and health access signals.
3. Discovery: natural-language query to trust-weighted results.
4. Validator: facility-level contradiction checks and trust scoring.
5. Trace Viewer: step-by-step reasoning and evidence snippets.
6. Crisis Map: geospatial view of underserved and critical zones.

## Agentic Core

The MVP agent engine is implemented in `src/lib/agenticMvp.ts`.

It includes:

1. Intent parsing from natural-language input.
2. Retrieval-style candidate scoring.
3. Rule-based validation for claim-evidence mismatch.
4. Trust score recomputation.
5. Structured trace step generation.
6. Run metadata (confidence, latency, token/cost estimates).

## Tech Stack

1. React 19 + TypeScript + Vite.
2. TanStack Router for route architecture.
3. Tailwind CSS + Radix UI primitives.
4. Framer Motion for interaction and progressive disclosure.
5. Recharts for analytics visualizations.
6. React Leaflet for map rendering.

## Quick Start

Prerequisites:

1. Node.js 18+
2. npm

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Challenge Alignment

### Core Features

1. Massive Unstructured Extraction: partial in MVP (logic flow exists; running on representative synthetic records).
2. Multi-Attribute Reasoning: implemented in MVP (query parse + retrieval + ranking + filtering).
3. Trust Scorer: implemented in MVP (contradiction detection and trust-aware suppression).

### Stretch Features

1. Agentic Traceability: implemented (step-level reasoning and evidence snippets in Trace Viewer).
2. Self-Correction Loop: implemented in-app via validator re-check path.
3. Dynamic Crisis Mapping: implemented at product level with current data layer.

## Important Note on Dataset Availability

The official challenge dataset file `VF_Hackathon_Dataset_India_Large.xlsx` was not available in this workspace during build.

Because of that, this submission focuses on validating the full agentic workflow and product experience using representative synthetic records.

The architecture is intentionally designed so real dataset ingestion can be added without rewriting the UI experience.

## Planned Upgrade Path (When XLSX Is Available)

1. Add XLSX ingestion and normalization adapter.
2. Replace synthetic source with dataset-backed retrieval index.
3. Attach row-level citations for every recommended facility.
4. Add benchmark/evaluation panel (consistency, confidence, latency).
5. Integrate Databricks-native observability and vector search stack.

## Repository Structure

```text
src/
	components/         # Shared UI and domain components
	data/               # Current representative dataset
	lib/
		agenticMvp.ts     # Agent loop: parse/retrieve/validate/trace
	routes/             # Home, dashboard, discovery, validator, trace, map
```

## Submission Positioning

This is a functional agentic MVP demonstrating:

1. Reasoning over unstructured facility narratives.
2. Trust-aware decision support.
3. Transparent, traceable recommendations.
4. Crisis visualization for planning and for intervention.

With the official dataset plugged in, the same architecture is ready to scale to challenge-grade evaluation.
