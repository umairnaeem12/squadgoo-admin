"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  Gavel,
  MessageCircle,
  Scale,
} from "lucide-react";

type DisputeStatus = "Open" | "In Review" | "Resolved";

type Dispute = {
  id: string;
  type: "Job" | "Marketplace";
  raisedBy: string;
  against: string;
  reason: string;
  status: DisputeStatus;
  amountHold: number;
  createdAt: string;
};

const DISPUTES: Dispute[] = [
  {
    id: "DSP-9001",
    type: "Job",
    raisedBy: "Rakesh Sharma (Jobseeker)",
    against: "TalentMatch HR (Recruiter)",
    reason: "Quick job ended early but full hours not paid",
    status: "In Review",
    amountHold: 180,
    createdAt: "10 Feb, 2025",
  },
  {
    id: "DSP-9002",
    type: "Marketplace",
    raisedBy: "Mia Collins (Buyer)",
    against: "Shehroz Motors (Seller)",
    reason: "Item not as described – motorbike mechanical issues",
    status: "Open",
    amountHold: 5000,
    createdAt: "18 Feb, 2025",
  },
  {
    id: "DSP-9003",
    type: "Job",
    raisedBy: "Squad Courier",
    against: "Rakesh Sharma (Buyer)",
    reason: "Courier completed delivery but buyer disputes distance",
    status: "Resolved",
    amountHold: 90,
    createdAt: "02 Feb, 2025",
  },
];

export default function DisputeResolutionPage() {
  const openCount = DISPUTES.filter((d) => d.status === "Open").length;
  const inReviewCount = DISPUTES.filter((d) => d.status === "In Review").length;
  const resolvedCount = DISPUTES.filter((d) => d.status === "Resolved").length;

  const totalOnHold = DISPUTES.reduce((sum, d) => sum + d.amountHold, 0);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dispute Resolution Centre
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage disputes for jobs, marketplace trades and Squad Courier flows.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          label="Open disputes"
          value={openCount.toString()}
          helper="Require mediator assignment and first response."
        />
        <SummaryCard
          icon={<Scale className="w-5 h-5 text-amber-500" />}
          label="In review"
          value={inReviewCount.toString()}
          helper="Evidence being collected from both parties."
        />
        <SummaryCard
          icon={<BadgeCheck className="w-5 h-5 text-emerald-500" />}
          label="Resolved"
          value={resolvedCount.toString()}
          helper="Closed with refund, release or fine."
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-brand-500" />}
          label="SG Coins on hold"
          value={`${totalOnHold.toLocaleString()} SG`}
          helper="Held until case is closed or refunded."
        />
      </div>

      {/* Dispute table – aligned with document flow */}
      <ComponentCard
        title="Active disputes"
        desc="Each dispute is tied to a specific order or job and follows the evidence, mediation and re-appeal flow described in the SquadGoo specification."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Raised by</th>
                <th className="px-6 py-3 font-medium">Against</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Amount on hold</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {DISPUTES.map((d) => (
                <tr
                  key={d.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {d.id}
                  </td>
                  <td className="px-6 py-3 text-xs">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.raisedBy}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.against}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.reason}
                  </td>
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {d.amountHold.toLocaleString()} SG
                  </td>
                  <td className="px-6 py-3">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {d.createdAt}
                  </td>
                  <td className="px-6 py-3">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                      <MessageCircle className="w-3 h-3" />
                      Open mediator chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}

function SummaryCard({
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
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
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
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: DisputeStatus }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium";

  if (status === "Open") {
    return (
      <span
        className={`${base} bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300`}
      >
        <AlertTriangle className="w-3 h-3" />
        {status}
      </span>
    );
  }

  if (status === "In Review") {
    return (
      <span
        className={`${base} bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300`}
      >
        <Scale className="w-3 h-3" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`${base} bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300`}
    >
      <BadgeCheck className="w-3 h-3" />
      {status}
    </span>
  );
}

