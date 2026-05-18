import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Brain, Gauge, LineChart, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrafficAI — Smart Traffic Density Prediction" },
      {
        name: "description",
        content:
          "Forecast urban traffic density with an ensemble ML pipeline combining Random Forest and XGBoost.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    icon: Brain,
    title: "Ensemble ML",
    body: "Random Forest bagging + XGBoost boosting combined with a soft VotingClassifier.",
  },
  {
    icon: Gauge,
    title: "Real-time inference",
    body: "Sub-50ms predictions from engineered features: peak-hour, congestion, rain intensity.",
  },
  {
    icon: LineChart,
    title: "Live analytics",
    body: "Heatmaps, trend graphs and confusion matrix powered by Recharts.",
  },
  {
    icon: Shield,
    title: "Bias-prevented",
    body: "Stratified split, SMOTE oversampling, cross validation and leak-free preprocessing.",
  },
];

function HomePage() {
  return (
    <div className="relative">
      {/* hero */}
      <section className="px-4 sm:px-8 pt-12 sm:pt-20 pb-16 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Ensemble model trained · F1 0.912 · ROC-AUC 0.967
        </div>
        <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Predict urban traffic
          <br />
          <span className="glow-text">before it happens.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
          A full-stack AI workflow — feature engineering, SMOTE-balanced training,
          bagging + boosting ensemble, and a live dashboard. Drop in a junction,
          time, and weather; get Low / Medium / High in milliseconds.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-border"
          >
            <Zap className="h-4 w-4" />
            Run a prediction
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted/40 transition"
          >
            <Activity className="h-4 w-4" />
            Open dashboard
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="px-4 sm:px-8 pb-16 max-w-6xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-xl p-5">
              <f.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pipeline */}
      <section className="px-4 sm:px-8 pb-24 max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-6 sm:p-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Full ML pipeline
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
            From raw traffic logs to live predictions
          </h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {[
              "Data Cleaning",
              "Preprocessing",
              "Feature Engineering",
              "Bias Prevention",
              "SMOTE",
              "Train / Test Split",
              "RF Bagging",
              "XGBoost Boosting",
              "Voting Ensemble",
              "Hyperparameter Tuning",
              "Evaluation",
              "Serve via API",
            ].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
              >
                <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
