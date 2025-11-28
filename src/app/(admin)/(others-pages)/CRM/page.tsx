"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Activity, Database, Users } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        CRM Overview
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        High-level CRM-style snapshot for super admins to review growth, risk
        and engagement across all SquadGoo user types.
      </p>

      <ComponentCard
        title="User base summary"
        desc="These blocks mirror the metrics surfaced on the main dashboard."
      >
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          <MetricTile
            icon={<Users className="w-5 h-5 text-brand-500" />}
            label="Active users (30 days)"
            value="8,420"
            helper="Jobseekers, Recruiters and Individuals combined."
          />
          <MetricTile
            icon={<Database className="w-5 h-5 text-emerald-500" />}
            label="Fully KYC verified"
            value="6,980"
            helper="Sumsub-verified identity and address."
          />
          <MetricTile
            icon={<Activity className="w-5 h-5 text-red-500" />}
            label="High-risk watchlist"
            value="42 accounts"
            helper="Repeated disputes, chargebacks or serious complaints."
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Segments to track later"
        desc="Tie these segments to filters and exports once a backend is available."
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
          <li>Jobseekers by badge tier, acceptance rating and earnings.</li>
          <li>Recruiters by badge tier, spend and dispute rate.</li>
          <li>Individuals by marketplace activity and gig completion.</li>
          <li>Squad profiles and Squad Courier performance.</li>
        </ul>
      </ComponentCard>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
      {helper && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
}

