import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { predictTraffic, type TrafficInput } from "./traffic-model";

const InputSchema = z.object({
  hour: z.number().int().min(0).max(23),
  day_of_week: z.number().int().min(0).max(6).default(0),
  temperature: z.number().min(-30).max(60),
  rain: z.number().int().min(0).max(2).default(0),
  holiday: z.number().int().min(0).max(1).default(0),
  junction: z.number().int().min(1).max(4).default(1),
  vehicles: z.number().int().min(0).max(2000),
  nearby_events: z.number().int().min(0).max(10).default(0),
  save: z.boolean().optional().default(true),
});

export const runPrediction = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const input: TrafficInput = {
      hour: data.hour,
      day_of_week: data.day_of_week,
      temperature: data.temperature,
      rain: data.rain,
      holiday: data.holiday,
      junction: data.junction,
      vehicles: data.vehicles,
      nearby_events: data.nearby_events,
    };

    const result = predictTraffic(input);

    return {
      prediction: result.prediction,
      confidence: result.confidence,
      probabilities: result.probabilities,
      features: result.features,
    };
  });
