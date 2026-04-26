import { type Facility } from "@/data/mockData";
import { TrustRing } from "./TrustRing";
import { Pill } from "./Pill";
import { GlassCard } from "./GlassCard";
import { Bed, Stethoscope, MapPin, Activity } from "lucide-react";

export function FacilityCard({ f, delay, onTrace }: { f: Facility; delay: number; onTrace: (f: Facility) => void }) {
  return (
    <GlassCard delay={delay} className="flex flex-col gap-4 hover:border-[var(--color-border-strong)] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold leading-tight">{f.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {f.city}, {f.state} · {f.pin}
          </div>
        </div>
        <TrustRing score={f.trust} pulse={f.trust >= 80} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {f.specialties.map((s) => <Pill key={s} label={s} />)}
      </div>

      <div className="grid grid-cols-3 gap-3 border-y border-[var(--color-border)] py-3 font-mono text-xs">
        <Stat icon={Bed} label="Beds" value={f.beds.toLocaleString()} />
        <Stat icon={Stethoscope} label="Doctors" value={f.doctors.toString()} />
        <Stat icon={Activity} label="Equipment" value={f.equipment.length.toString()} />
      </div>

      <div className="text-xs text-muted-foreground">
        <div className="font-mono uppercase tracking-wider text-[10px] mb-1">Equipment</div>
        <div className="flex flex-wrap gap-1.5">
          {f.equipment.slice(0, 3).map((e) => (
            <span key={e} className="rounded border border-[var(--color-border)] bg-[oklch(0.20_0.02_250)] px-2 py-0.5 font-mono text-[10px]">{e}</span>
          ))}
          {f.equipment.length > 3 && (
            <span className="rounded border border-[var(--color-border)] bg-transparent px-2 py-0.5 font-mono text-[10px] text-teal">+{f.equipment.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onTrace(f)}
          className="flex-1 rounded-md border border-[var(--color-border-strong)] bg-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-teal transition-colors hover:bg-[oklch(0.79_0.14_188/0.1)]"
        >
          View Thought Process
        </button>
        <button className="rounded-md border border-[var(--color-border)] bg-[oklch(0.20_0.02_250)] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
          View on Map
        </button>
      </div>
    </GlassCard>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}
