"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Activity, PlugZap, Timer, Truck } from "lucide-react";

export default function PlatformControlsPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Platform Controls
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Central switches for Quick Search, Manual Search, marketplace access
        and Squad Courier, as outlined in the SquadGoo specification.
      </p>

      <ComponentCard
        title="Core matching engines"
        desc="High-level toggles for the two matchmaking modes and related automation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ControlTile
            icon={<PlugZap className="w-5 h-5 text-brand-500" />}
            label="Quick Search"
            description="System-driven offers, live tracking, SG COIN timers and auto-matching for urgent roles."
          />
          <ControlTile
            icon={<Timer className="w-5 h-5 text-emerald-500" />}
            label="Manual Search"
            description="Lower-cost, manual offers where recruiters and individuals browse profiles and send offers."
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Ecosystem features"
        desc="Controls for Marketplace and Squad Courier add-ons."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ControlTile
            icon={<Activity className="w-5 h-5 text-purple-500" />}
            label="Marketplace"
            description="Local buying/selling with SG COIN-only payments, dispute resolution and 0.2% seller fee."
          />
          <ControlTile
            icon={<Truck className="w-5 h-5 text-orange-500" />}
            label="Squad Courier"
            description="On-demand couriers drawn from jobseekers for marketplace deliveries and inspections."
          />
        </div>
      </ComponentCard>
    </div>
  );
}

function ControlTile({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          {icon}
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span>Configured later via backend flags</span>
      </div>
    </div>
  );
}

