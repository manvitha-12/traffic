import { createFileRoute } from "@tanstack/react-router";
import { MODEL_METRICS } from "@/lib/traffic-model";
import { StatCard } from "@/components/StatCard";
import { Award, Brain, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — TrafficAI" },
      {
        name: "description",
        content: "Model metrics, confusion matrix, and feature importance.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const metricBars = [
    { name: "Accuracy", v: MODEL_METRICS.accuracy },
    { name: "Precision", v: MODEL_METRICS.precision },
    { name: "Recall", v: MODEL_METRICS.recall },
    { name: "F1", v: MODEL_METRICS.f1 },
    { name: "ROC-AUC", v: MODEL_METRICS.roc_auc },
  ];

  const featureImportance = [
    { name: "vehicles_last_hour", v: 0.28 },
    { name: "peak_hour", v: 0.19 },
    { name: "congestion_score", v: 0.17 },
    { name: "rain_intensity", v: 0.12 },
    { name: "nearby_events", v: 0.1 },
    { name: "hour", v: 0.06 },
    { name: "junction", v: 0.04 },
    { name: "weekend", v: 0.03 },
    { name: "holiday", v: 0.01 },
  ];

  const max = Math.max(...MODEL_METRICS.confusion_matrix.flat());

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Offline-tuned ensemble (Random Forest + XGBoost via VotingClassifier).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Accuracy"
          value={`${(MODEL_METRICS.accuracy * 100).toFixed(1)}%`}
          icon={Target}
        />
        <StatCard
          label="F1 score"
          value={MODEL_METRICS.f1.toFixed(3)}
          icon={Award}
          tone="accent"
        />
        <StatCard
          label="ROC-AUC"
          value={MODEL_METRICS.roc_auc.toFixed(3)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="CV mean"
          value={`${MODEL_METRICS.cv_mean.toFixed(3)} ± ${MODEL_METRICS.cv_std.toFixed(3)}`}
          icon={Brain}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Evaluation metrics
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricBars}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  domain={[0, 1]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Feature importance
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="v" radius={[0, 6, 6, 0]} fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Confusion matrix
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="text-sm border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="px-3 py-2 text-muted-foreground text-xs">actual ↓ / pred →</th>
                {MODEL_METRICS.classes.map((c) => (
                  <th key={c} className="px-3 py-2 text-xs text-muted-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODEL_METRICS.confusion_matrix.map((row, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {MODEL_METRICS.classes[i]}
                  </td>
                  {row.map((cell, j) => {
                    const intensity = cell / max;
                    const correct = i === j;
                    return (
                      <td
                        key={j}
                        className="px-4 py-3 text-center rounded-md font-medium"
                        style={{
                          background: correct
                            ? `color-mix(in oklab, var(--color-success) ${intensity * 60}%, transparent)`
                            : `color-mix(in oklab, var(--color-danger) ${intensity * 45}%, transparent)`,
                          color: "var(--color-foreground)",
                        }}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
