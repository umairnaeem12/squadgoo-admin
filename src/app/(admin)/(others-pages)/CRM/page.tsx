"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  Activity,
  AlertTriangle,
  Database,
  Download,
  Eye,
  Flag,
  PieChart,
  Share2,
  Star,
  Users,
} from "lucide-react";

const segments = [
  {
    title: "Jobseekers",
    items: [
      "By badge tier (Bronze / Platinum / Gold)",
      "Acceptance rating bands",
      "Quick vs Manual job mix",
      "Earnings buckets",
    ],
  },
  {
    title: "Recruiters",
    items: [
      "Badge tier & spend",
      "Dispute rate",
      "Squad hiring usage",
      "Referral conversions",
    ],
  },
  {
    title: "Individuals",
    items: [
      "Marketplace activity",
      "Gig completion / cancellation",
      "Courier usage",
      "Quick vs Manual offer usage",
    ],
  },
  {
    title: "Squads / Courier",
    items: [
      "Squad size vs success rate",
      "Courier acceptance and dispute metrics",
      "Shared wallet balances",
      "Badge inheritance within squads",
    ],
  },
];

const watchlist = [
  {
    id: "USR-2091",
    type: "Recruiter",
    reason: "Multiple quick job cancellations (no fault of jobseeker)",
    status: "Under review",
  },
  {
    id: "USR-1204",
    type: "Jobseeker",
    reason: "Chargeback after marketplace purchase",
    status: "Flagged",
  },
];

const referralStats = [
  {
    label: "Active referral campaigns",
    value: "3",
    helper: "Jobseeker badges, recruiter badges, marketplace sellers.",
  },
  {
    label: "Last 30 days conversions",
    value: "218",
    helper: "+12% vs prior period",
  },
  {
    label: "SG Coin payouts",
    value: "2,180 SG",
    helper: "Pending 7-day hold for fraud checks",
  },
];

const exports = [
  {
    title: "Segment export",
    detail: "CSV/JSON snapshots by badge tier, acceptance rating, spend or referral source.",
  },
  {
    title: "Watchlist export",
    detail: "List of users on compliance watch (with reasons & timestamps).",
  },
  {
    title: "Referral performance",
    detail: "Campaign response data, SG Coin payouts and status.",
  },
];

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
        title="User segmentation"
        desc="Break down the user base by the dimensions the doc calls out."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          {segments.map((segment) => (
            <div
              key={segment.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <PieChart className="w-5 h-5 text-brand-500" />
                <p className="text-sm font-semibold">{segment.title}</p>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {segment.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Watchlist & compliance"
        desc="Doc highlights high-risk accounts and negative review handling."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Current watchlist
              </p>
            </div>
            <ul className="mt-3 space-y-3">
              {watchlist.map((entry) => (
                <li key={entry.id} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{entry.id} · {entry.type}</span>
                    <span className="text-red-500 dark:text-red-300">{entry.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{entry.reason}</p>
                  <button className="mt-2 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                    <Eye className="w-3 h-3" />
                    View account
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Escalation policy
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Three strike system for recruiters with no-fault cancellations.</li>
              <li>{`Jobseekers with < 60% acceptance rating flagged for review.`}</li>
              <li>Marketplace sellers with repeated courier disputes require manual approval.</li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Referral tracking"
        desc="Doc mentions referral bonuses tied to badges."
      >
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          {referralStats.map((stat) => (
            <MetricTile key={stat.label} icon={<Share2 className="w-5 h-5 text-brand-500" />} label={stat.label} value={stat.value} helper={stat.helper} />
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <p className="font-semibold text-gray-900 dark:text-white">Example referral flow</p>
          <p className="mt-1">
            Jobseeker invites another user → referral accepts badge offer → referral bonus (5-20 SG coins) placed on 7-day hold before release.
          </p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Exports & integrations"
        desc="Map CRM exports to finance / compliance as per doc."
      >
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          {exports.map((exportItem) => (
            <div
              key={exportItem.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{exportItem.title}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{exportItem.detail}</p>
              <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          ))}
        </div>
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
