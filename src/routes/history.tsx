import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPredictions } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — TrafficAI" },
      { name: "description", content: "Full history of past traffic predictions." },
    ],
  }),
  component: HistoryPage,
});

type Row = {
  id: string;
  hour: number;
  temperature: number;
  vehicles: number;
  rain: number;
  holiday: number;
  junction: number;
  nearby_events: number;
  prediction: string;
  confidence: number;
  created_at: string;
};

function HistoryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["history-all"],
    queryFn: async () => {
      return getPredictions().slice(0, 500) as Row[];
    },
  });

  const rows = (data ?? []).filter((r) => {
    if (filter !== "all" && r.prediction !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        String(r.hour).includes(q) ||
        String(r.vehicles).includes(q) ||
        r.prediction.toLowerCase().includes(q) ||
        `junction ${r.junction}`.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">History</h1>
        <p className="text-sm text-muted-foreground">
          Browse and filter every saved prediction.
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hour, vehicles, prediction…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">{rows.length} records</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground text-left">
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Hour</th>
                <th className="py-2 px-2">Junction</th>
                <th className="py-2 px-2">Vehicles</th>
                <th className="py-2 px-2">Temp</th>
                <th className="py-2 px-2">Rain</th>
                <th className="py-2 px-2">Events</th>
                <th className="py-2 px-2">Prediction</th>
                <th className="py-2 px-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted-foreground">
                    No records.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-2">{r.hour}:00</td>
                  <td className="py-2 px-2">J{r.junction}</td>
                  <td className="py-2 px-2">{r.vehicles}</td>
                  <td className="py-2 px-2">{Number(r.temperature).toFixed(0)}°</td>
                  <td className="py-2 px-2">
                    {["None", "Light", "Heavy"][r.rain] ?? r.rain}
                  </td>
                  <td className="py-2 px-2">{r.nearby_events}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
