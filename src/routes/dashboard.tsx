import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPredictions } from "@/lib/storage";
import { StatCard } from "@/components/StatCard";
import { PredictionCard } from "@/components/PredictionCard";
import {
  Activity,
  AlertTriangle,
  Car,
  Clock,
  Gauge,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrafficClass } from "@/lib/traffic-model";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TrafficAI" },
      { name: "description", content: "Live traffic predictions and analytics dashboard." },
    ],
  }),
  component: DashboardPage,
});

type PredictionRow = {
  id: string;
  hour: number;
  vehicles: number;
  prediction: string;
  confidence: number;
  prob_low: number;
  prob_medium: number;
  prob_high: number;
  created_at: string;
};

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["recent-predictions"],
    queryFn: async () => {
      return getPredictions().slice(0, 50) as PredictionRow[];
    },
    refetchInterval: 10000,
  });

  const rows = data ?? [];
  const total = rows.length;
  const highCount = rows.filter((r) => r.prediction === "High").length;
  const avgVehicles = total
    ? Math.round(rows.reduce((s, r) => s + r.vehicles, 0) / total)
    : 0;
  const avgConfidence = total
    ? Math.round((rows.reduce((s, r) => s + Number(r.confidence), 0) / total) * 100)
    : 0;

  const trend = [...rows]
    .reverse()
    .map((r) => ({
      t: new Date(r.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      vehicles: r.vehicles,
      confidence: Math.round(Number(r.confidence) * 100),
    }));

  const distribution = (["Low", "Medium", "High"] as const).map((cls) => ({
    name: cls,
    value: rows.filter((r) => r.prediction === cls).length,
  }));
  const PIE_COLORS = ["var(--color-success)", "var(--color-warning)", "var(--color-danger)"];

  const latest = rows[0];

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live overview of recent predictions and traffic conditions.
          </p>
        </div>
        <Link
          to="/predict"
          className="inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New prediction
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Predictions" value={total} icon={Activity} hint="last 50 events" />
        <StatCard
          label="Avg vehicles/hr"
          value={avgVehicles}
          icon={Car}
          tone="accent"
        />
        <StatCard
          label="Avg confidence"
          value={`${avgConfidence}%`}
          icon={Gauge}
          tone="success"
        />
        <StatCard
          label="High-density alerts"
          value={highCount}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Vehicle trend
              </div>
              <div className="text-sm">Recent prediction load</div>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 h-64">
            {isLoading || trend.length === 0 ? (
              <EmptyChart loading={isLoading} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vehicles"
                    stroke="var(--color-primary)"
                    fill="url(#g1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {latest ? (
            <PredictionCard
              prediction={latest.prediction as TrafficClass}
              confidence={Number(latest.confidence)}
              probabilities={{
                Low: Number(latest.prob_low),
                Medium: Number(latest.prob_medium),
                High: Number(latest.prob_high),
              }}
            />
          ) : (
            <div className="glass rounded-2xl p-6 text-sm text-muted-foreground text-center">
              No predictions yet. Run one to populate the dashboard.
            </div>
          )}
          <div className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Class distribution
            </div>
            <div className="h-48 mt-3">
              {total === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {distribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-2 flex justify-around text-xs">
              {distribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className="text-muted-foreground">
                    {d.name} · {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <div className="text-sm font-medium">Recent predictions</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground text-left">
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Hour</th>
                <th className="py-2 px-2">Vehicles</th>
                <th className="py-2 px-2">Prediction</th>
                <th className="py-2 px-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 8).map((r) => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="py-2 px-2 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-2">{r.hour}:00</td>
                  <td className="py-2 px-2">{r.vehicles}</td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        r.prediction === "High"
                          ? "text-danger"
                          : r.prediction === "Medium"
                            ? "text-warning"
                            : "text-success"
                      }
                    >
                      {r.prediction}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    {(Number(r.confidence) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Nothing yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ loading }: { loading?: boolean }) {
  return (
    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
      {loading ? "Loading…" : "No data yet"}
    </div>
  );
}
