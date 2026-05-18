import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/60 backdrop-blur-xl bg-background/60">
      <div className="flex h-full items-center gap-3 px-3 sm:px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium tracking-tight">
            Smart Traffic Density Prediction
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center rounded-md bg-[image:var(--gradient-primary)] px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
          >
            New prediction
          </Link>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            model online
          </span>
        </div>
      </div>
    </header>
  );
}
