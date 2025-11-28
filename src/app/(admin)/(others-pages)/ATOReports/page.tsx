"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Database, FileSpreadsheet, WalletCards } from "lucide-react";

export default function ATOReportsPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        ATO Reports
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Read-only view of SG COIN flows and export stubs for accountants and
        taxation reporting (ATO and similar authorities).
      </p>

      <ComponentCard
        title="Reporting scopes"
        desc="Mirror the breakdowns described in the SquadGoo product document."
      >
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="space-y-1">
            <h3 className="font-semibold">Jobs</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Quick and Manual jobs paid in SG COINS.</li>
              <li>Wallet holds, releases and compensation payouts.</li>
              <li>Badge-related benefits funded by the platform.</li>
            </ul>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Marketplace</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Buyer-to-seller transfers and 0.2% platform fee.</li>
              <li>Courier jobs paid via Squad Courier.</li>
              <li>Refunds, fines and dispute outcomes.</li>
            </ul>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Wallet / SG COINS</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Top-ups from fiat into SG COINS.</li>
              <li>Withdrawals from SG COINS back to AUD.</li>
              <li>Breakdown per user type (Jobseeker, Recruiter, Individual).</li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Exports"
        desc="Buttons are placeholders; wire them to real export endpoints later."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <ExportTile
            icon={<FileSpreadsheet className="w-5 h-5 text-brand-500" />}
            label="Jobs & SG COIN summary"
          />
          <ExportTile
            icon={<WalletCards className="w-5 h-5 text-emerald-500" />}
            label="Wallet withdrawals & bank payouts"
          />
          <ExportTile
            icon={<Database className="w-5 h-5 text-purple-500" />}
            label="Marketplace sales and fees"
          />
        </div>
      </ComponentCard>
    </div>
  );
}

function ExportTile({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
            {icon}
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {label}
          </p>
        </div>
        <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
          Download CSV
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        Once wired, this will generate a period-based export suitable for
        accountants and tax lodgements.
      </p>
    </div>
  );
}

