import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Activity,
  Database,
  FileSpreadsheet,
  Settings2,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SquadGoo Dashboard",
  description: "Internal admin panel for SquadGoo platform controls and reports",
};

export default function Ecommerce() {
  return (
    <div className="space-y-6">
      {/* Top analytics row */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
      </div>

      {/* Super admin controls – matches Admin Panel Control / Platform Controls / ATO / CRM */}
      <ComponentCard
        title="Admin Panel Control"
        desc="High-level switches and reports for platform behaviour, taxation exports and CRM overview (dummy data only)"
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* Platform Controls */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                <Settings2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Platform Controls
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Quick Search, Manual Search, marketplace access, in‑platform payments and Squad
              Courier can all be controlled from here once wired to a backend.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li>• Quick Search: Enabled</li>
              <li>• Manual Search: Enabled</li>
              <li>• Marketplace: Pilot in AU states</li>
              <li>• In‑platform payments: Enabled for Bronze+ badges</li>
            </ul>
          </div>

          {/* ATO Reports */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                <FileSpreadsheet className="w-5 h-5 text-brand-500 dark:text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ATO Reports
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Summary of SG Coin flows and GST‑relevant activity. In a real system these buttons
              would generate CSV / JSON exports for accountants.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li>• Jobs & SG Coin summary (monthly)</li>
              <li>• Wallet withdrawals & bank payouts</li>
              <li>• Marketplace sales and fees</li>
            </ul>
          </div>

          {/* CRM */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                <Activity className="w-5 h-5 text-brand-500 dark:text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                CRM Overview
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Read‑only CRM style snapshot of your user base – useful for super admins during
              audits and risk reviews.
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>
                  Active users last 30 days:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    8,420
                  </span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                <span>
                  Fully KYC verified:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    6,980
                  </span>
                </span>
              </p>
              <p>
                High‑risk watchlist:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  42 accounts
                </span>
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
