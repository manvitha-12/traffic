import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Gauge } from "lucide-react";
import type { TrafficClass } from "@/lib/traffic-model";

interface PredictionCardProps {
  prediction: TrafficClass;
  confidence: number;
  probabilities: { Low: number; Medium: number; High: number };
  className?: string;
}

const config: Record<
  TrafficClass,
  { color: string; bg: string; ring: string; icon: typeof Gauge; label: string }
> = {
  Low: {
    color: "text-success",
    bg: "from-success/20 to-transparent",
    ring: "ring-success/40",
    icon: CheckCircle2,
    label: "Free flowing",
  },
  Medium: {
    color: "text-warning",
    bg: "from-warning/20 to-transparent",
    ring: "ring-warning/40",
    icon: Gauge,
    label: "Moderate congestion",
  },
  High: {
    color: "text-danger",
    bg: "from-danger/20 to-transparent",
    ring: "ring-danger/40",
    icon: AlertTriangle,
    label: "Heavy congestion",
  },
};

export function PredictionCard({
  prediction,
  confidence,
  probabilities,
  className,
}: PredictionCardProps) {
  const cfg = config[prediction];
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 ring-1",
        cfg.ring,
        `bg-gradient-to-br ${cfg.bg}`,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6", cfg.color)} />
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Predicted density
          </div>
          <div className={cn("text-3xl font-bold tracking-tight", cfg.color)}>
            {prediction}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-muted-foreground">confidence</div>
          <div className="text-lg font-semibold">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {(["Low", "Medium", "High"] as const).map((c) => {
          const p = probabilities[c];
          return (
            <div key={c}>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{c}</span>
                <span>{(p * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    c === "Low" && "bg-success",
                    c === "Medium" && "bg-warning",
                    c === "High" && "bg-danger",
                  )}
                  style={{ width: `${p * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">{cfg.label}</div>
    </div>
  );
}
