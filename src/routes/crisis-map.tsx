import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { criticalPins, mapMarkers, type MapMarker } from "@/data/mockData";

export const Route = createFileRoute("/crisis-map")({
  head: () => ({
    meta: [
      { title: "Crisis Map — AyuGraph" },
      { name: "description", content: "Geospatial atlas of medical-desert PIN codes across India with oncology, trauma, and pediatric coverage gaps." },
      { property: "og:title", content: "Crisis Map — AyuGraph" },
      { property: "og:description", content: "Interactive crisis map of healthcare deserts and underserved regions." },
    ],
  }),
  component: CrisisMap,
});

type Filter = "all" | "oncology" | "trauma" | "pediatric";

function CrisisMap() {
  const [filter, setFilter] = useState<Filter>("all");
  const [Mod, setMod] = useState<typeof import("react-leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("react-leaflet").then((m) => { if (!cancelled) setMod(m); });
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(
    () => filter === "all" ? mapMarkers : mapMarkers.filter((m) => m.gapTypes.includes(filter)),
    [filter],
  );

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="overflow-hidden p-0">
        <div className="relative h-[560px] w-full">
          {/* Filters top-left */}
          <div className="absolute left-4 top-4 z-[500] flex gap-2">
            {(["all", "oncology", "trauma", "pediatric"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition-colors " +
                  (filter === f
                    ? "border-[var(--color-primary)] bg-[oklch(0.78_0.11_210/0.18)] text-teal"
                    : "border-[var(--color-border)] bg-[oklch(1_0_0/0.8)] text-muted-foreground hover:text-foreground")
                }
              >
                {f === "all" ? "All" : `${f} Gaps`}
              </button>
            ))}
          </div>

          {/* Legend top-right */}
          <div className="absolute right-4 top-4 z-[500] rounded-xl border border-[var(--color-border)] bg-[oklch(1_0_0/0.84)] p-3 backdrop-blur-md">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Legend</div>
            <Legend color="var(--color-destructive)" size={14} label="Medical Desert (0–1 / 100k)" />
            <Legend color="var(--color-warning)"     size={11} label="Underserved (2–5 / 100k)" />
            <Legend color="var(--color-success)"     size={8}  label="Adequate Coverage" />
          </div>

          {Mod ? (
            <Mod.MapContainer
              center={[22.9734, 78.6569] as [number, number]}
              zoom={5}
              scrollWheelZoom
              className="h-full w-full"
              attributionControl
            >
              <Mod.TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap, CartoDB · AyuGraph'
              />
              {visible.map((m) => (
                <Mod.CircleMarker
                  key={m.id}
                  center={[m.lat, m.lng]}
                  radius={tierSize(m.tier)}
                  pathOptions={{
                    color: tierColor(m.tier),
                    fillColor: tierColor(m.tier),
                    fillOpacity: 0.55,
                    weight: 2,
                  }}
                >
                  <Mod.Popup>
                    <div className="space-y-0.5">
                      <div><b>PIN:</b> {m.pin}</div>
                      <div><b>{m.district}, {m.state}</b></div>
                      <div>Nearest Oncology: {m.nearestOnc}km</div>
                      <div>Nearest ICU: {m.nearestICU}km</div>
                      <div>Population: {m.population.toLocaleString()}</div>
                      <div style={{ color: tierColor(m.tier), fontWeight: 700 }}>
                        {m.classification}
                      </div>
                    </div>
                  </Mod.Popup>
                </Mod.CircleMarker>
              ))}
            </Mod.MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Loading map…
            </div>
          )}
        </div>
      </GlassCard>

      {/* Critical PINs table */}
      <GlassCard>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Top 10 Critical PIN Codes</h3>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Sorted by desert score · descending</p>
          </div>
          <span className="rounded border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-crimson">
            CRITICAL
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border-strong)] text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4">PIN</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">District</th>
                <th className="py-2 pr-4 text-right">Nearest ICU</th>
                <th className="py-2 pr-4 text-right">Nearest Oncology</th>
                <th className="py-2 pr-4 text-right">Population</th>
                <th className="py-2 pr-4 text-right">Desert Score</th>
              </tr>
            </thead>
            <tbody>
              {criticalPins.slice(0, 10).map((p) => (
                <tr key={p.pin} className="border-b border-[var(--color-border)] transition-colors hover:bg-[oklch(0.96_0.01_220)]">
                  <td className="py-2 pr-4 text-teal">{p.pin}</td>
                  <td className="py-2 pr-4">{p.state}</td>
                  <td className="py-2 pr-4">{p.district}</td>
                  <td className="py-2 pr-4 text-right">{p.nearestICU} km</td>
                  <td className="py-2 pr-4 text-right">{p.nearestOnc} km</td>
                  <td className="py-2 pr-4 text-right text-muted-foreground">{p.population.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right">
                    <span
                      className="inline-block rounded px-2 py-0.5 font-bold"
                      style={{ background: `${scoreColor(p.desertScore)}20`, color: scoreColor(p.desertScore) }}
                    >
                      {p.desertScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function Legend({ color, size, label }: { color: string; size: number; label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5 font-mono text-[10px]">
      <span className="rounded-full" style={{ background: color, width: size, height: size, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function tierColor(t: MapMarker["tier"]) {
  if (t === "desert") return "#E5383B";
  if (t === "underserved") return "#F5A623";
  return "#2ECC71";
}
function tierSize(t: MapMarker["tier"]) {
  if (t === "desert") return 18;
  if (t === "underserved") return 12;
  return 8;
}
function scoreColor(s: number) {
  if (s >= 85) return "#E5383B";
  if (s >= 60) return "#F5A623";
  return "#2ECC71";
}
