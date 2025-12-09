"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  BadgeCheck,
  Briefcase,
  Group,
  Layers,
  MapPin,
  Users,
} from "lucide-react";

const pools = [
  {
    title: "Labour Pool",
    icon: Users,
    description:
      "Central directory of top talents awaiting offers. Recruiters can browse, filter by industry and send manual offers straight from here.",
    metrics: [
      { label: "Active profiles", value: "4,812" },
      { label: "Average match score", value: "86%" },
      { label: "Ready for quick jobs", value: "1,940" },
    ],
  },
  {
    title: "Squad Pool",
    icon: Group,
    description:
      "Grouped jobseeker squads (families/friends) ready for multi-person gigs. Admins can manage membership, ownership transfers and badge perks.",
    metrics: [
      { label: "Total squads", value: "428" },
      { label: "Avg members / squad", value: "3.2" },
      { label: "Gold badge squads", value: "74" },
    ],
  },
  {
    title: "Contractor Pool (ABN)",
    icon: BadgeCheck,
    description:
      "ABN jobseekers targeting contract/gig work. Required for individuals' offers and marketplace courier services.",
    metrics: [
      { label: "Available contractors", value: "2,365" },
      { label: "Verified ABN", value: "2,102" },
      { label: "Resume verified", value: "890" },
    ],
  },
  {
    title: "Employee Pool (TFN)",
    icon: Briefcase,
    description:
      "TFN candidates for traditional employment. Quick jobs can exclude TFN workers from in-app payments as per doc constraints.",
    metrics: [
      { label: "Active TFN profiles", value: "1,980" },
      { label: "Bronze+ badge", value: "1,104" },
      { label: "Awaiting KYC", value: "143" },
    ],
  },
];

const filters = [
  "Industry / job title",
  "Availability calendar",
  "Badge tier",
  "Acceptance rating",
  "Max radius from home",
];

export default function TalentPoolsPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Talent Pools
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mirrors the SquadGoo doc sections for Labour Pool, Squad Pool,
          Contractor Pool and Employee Pool so ops can monitor supply.
        </p>
      </div>

      <ComponentCard
        title="Recruiter view"
        desc="High-level stats pulled into the dashboard tiles when recruiters open Labour/Squad/Contractor/Employee pools."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {pools.map((pool) => (
            <div
              key={pool.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <pool.icon className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {pool.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pool.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-gray-700 dark:text-gray-300">
                {pool.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 dark:border-gray-800"
                  >
                    <span>{metric.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Filtering & actions"
        desc="Doc lists filters recruiters can apply plus actions like reuse offers or convert to quick jobs."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Standard filters
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-gray-700 dark:text-gray-300">
              {filters.map((filter) => (
                <li key={filter}>{filter}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Admin monitoring
            </p>
            <ul className="mt-3 space-y-2">
              <li>Track top searched industries and supply-demand gaps.</li>
              <li>Highlight squads eligible for courier work or marketplace deliveries.</li>
              <li>
                Surface acceptance rating drops so support can intervene before
                profiles are deprioritized.
              </li>
              <li>
                Allow recruiters to reuse drafted offers directly from pool
                views (matches doc's "re-use offer" callout).
              </li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Geography & badges"
        desc="Ensures we notate the proximity + badge gating mentioned in the doc."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Radius awareness
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Labour and contractor pool entries respect each profile's
              preferred radius from home. Admin toggles will later allow us to
              override or widen search areas for surge hiring.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Badge filtering
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Recruiters can limit pools to Bronze/Platinum/Gold badge holders
              or PRO (resume verified) users. This page documents those rules so
              we can enforce them consistently in both manual and quick search
              engines.
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
