"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Coins, WalletCards } from "lucide-react";

export default function AdminWalletPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Platform Wallet (SG COINS)
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        High-level overview of SG COIN balances and flows from an internal
        admin perspective.
      </p>

      <ComponentCard title="Summary" desc="Key wallet KPIs for the platform.">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          <SummaryTile
            icon={<Coins className="w-5 h-5 text-brand-500" />}
            label="Total SG COINS in circulation"
            value="1,250,000 SG"
          />
          <SummaryTile
            icon={<WalletCards className="w-5 h-5 text-emerald-500" />}
            label="On hold in disputes"
            value="5,270 SG"
          />
          <SummaryTile
            icon={<WalletCards className="w-5 h-5 text-purple-500" />}
            label="Pending withdrawals"
            value="18,400 SG"
          />
        </div>
      </ComponentCard>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
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
    </div>
  );
}

