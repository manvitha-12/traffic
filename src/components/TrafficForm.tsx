import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles } from "lucide-react";
import type { TrafficInput } from "@/lib/traffic-model";

interface TrafficFormProps {
  onSubmit: (input: TrafficInput) => Promise<void> | void;
  loading?: boolean;
  initial?: Partial<TrafficInput>;
}

export function TrafficForm({ onSubmit, loading, initial }: TrafficFormProps) {
  const now = new Date();
  const [hour, setHour] = useState<number>(initial?.hour ?? now.getHours());
  const [day, setDay] = useState<number>(initial?.day_of_week ?? ((now.getDay() + 6) % 7));
  const [temperature, setTemperature] = useState<number>(initial?.temperature ?? 28);
  const [vehicles, setVehicles] = useState<number>(initial?.vehicles ?? 220);
  const [rain, setRain] = useState<number>(initial?.rain ?? 0);
  const [holiday, setHoliday] = useState<boolean>(!!initial?.holiday);
  const [junction, setJunction] = useState<number>(initial?.junction ?? 1);
  const [events, setEvents] = useState<number>(initial?.nearby_events ?? 0);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      hour,
      day_of_week: day,
      temperature,
      vehicles,
      rain,
      holiday: holiday ? 1 : 0,
      junction,
      nearby_events: events,
    });
  };

  return (
    <form onSubmit={handle} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Hour of day: {hour}:00</Label>
        <Slider
          value={[hour]}
          min={0}
          max={23}
          step={1}
          onValueChange={(v) => setHour(v[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Day of week</Label>
        <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <SelectItem key={d} value={String(i)}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Temperature (°C)</Label>
        <Input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Vehicles (last hour)</Label>
        <Input
          type="number"
          value={vehicles}
          onChange={(e) => setVehicles(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Rain intensity</Label>
        <Select value={String(rain)} onValueChange={(v) => setRain(Number(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            <SelectItem value="1">Light</SelectItem>
            <SelectItem value="2">Heavy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Junction</Label>
        <Select value={String(junction)} onValueChange={(v) => setJunction(Number(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((j) => (
              <SelectItem key={j} value={String(j)}>
                Junction {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nearby events: {events}</Label>
        <Slider
          value={[events]}
          min={0}
          max={5}
          step={1}
          onValueChange={(v) => setEvents(v[0])}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
        <Label htmlFor="holiday-switch" className="cursor-pointer">
          Public holiday
        </Label>
        <Switch id="holiday-switch" checked={holiday} onCheckedChange={setHoliday} />
      </div>

      <div className="sm:col-span-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Predict density
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
