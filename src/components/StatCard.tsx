import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "primary" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className,
}: StatCardProps) {
  return (
    <div className={cn("glass rounded-xl p-4 relative overflow-hidden", className)}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[image:var(--gradient-primary)] opacity-10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className={cn("h-4 w-4", tones[tone])} />}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
