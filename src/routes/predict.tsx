import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { TrafficForm } from "@/components/TrafficForm";
import { PredictionCard } from "@/components/PredictionCard";
import { runPrediction } from "@/lib/predictions.functions";
import type { TrafficInput } from "@/lib/traffic-model";
import { savePrediction } from "@/lib/storage";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Predict — TrafficAI" },
      { name: "description", content: "Run a live traffic-density prediction." },
    ],
  }),
  component: PredictPage,
});

function PredictPage() {
  const predict = useServerFn(runPrediction);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: "Low" | "Medium" | "High";
    confidence: number;
    probabilities: { Low: number; Medium: number; High: number };
    features: {
      peak_hour: number;
      weekend: number;
      moving_avg_traffic: number;
      congestion_score: number;
      rain_intensity_score: number;
    };
  } | null>(null);

  const onSubmit = async (input: TrafficInput) => {
    setLoading(true);
    try {
      const res = await predict({ data: { ...input, save: false } });
      savePrediction({
        ...input,
        prediction: res.prediction,
        confidence: res.confidence,
        prob_low: res.probabilities.Low,
        prob_medium: res.probabilities.Medium,
        prob_high: res.probabilities.High,
      });
      setResult(res);
      toast.success(`Predicted ${res.prediction} (${(res.confidence * 100).toFixed(1)}%)`);
    } catch (e: any) {
      toast.error(e?.message ?? "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Predict density</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide current conditions — the ensemble model returns a probability over
          Low / Medium / High.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="glass rounded-2xl p-5 sm:p-7">
          <TrafficForm onSubmit={onSubmit} loading={loading} />
        </div>

        <div className="space-y-4">
          {result ? (
            <>
              <PredictionCard
                prediction={result.prediction}
                confidence={result.confidence}
                probabilities={result.probabilities}
              />
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Engineered features
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">peak_hour</span>
                    <span>{result.features.peak_hour}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">weekend</span>
                    <span>{result.features.weekend}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">moving_avg_traffic</span>
                    <span>{result.features.moving_avg_traffic}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">congestion_score</span>
                    <span>{result.features.congestion_score}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">rain_intensity_score</span>
                    <span>{result.features.rain_intensity_score}</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              Fill in the form and run a prediction to see live model output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
