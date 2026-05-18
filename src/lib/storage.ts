export type PredictionRecord = {
  id: string;
  hour: number;
  day_of_week: number;
  temperature: number;
  rain: number;
  holiday: number;
  junction: number;
  vehicles: number;
  nearby_events: number;
  prediction: string;
  confidence: number;
  prob_low: number;
  prob_medium: number;
  prob_high: number;
  created_at: string;
};

const STORAGE_KEY = "traffic-predictions-history";

export function getPredictions(): PredictionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse predictions from local storage", error);
    return [];
  }
}

export function savePrediction(prediction: Omit<PredictionRecord, "id" | "created_at">): PredictionRecord {
  const newRecord: PredictionRecord = {
    ...prediction,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const existing = getPredictions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newRecord, ...existing]));
  }

  return newRecord;
}
