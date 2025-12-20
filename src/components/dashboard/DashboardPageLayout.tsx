"use client";

import { DashboardDateRangeProvider } from "@/context/DashboardDateRangeContext";
import DashboardDateFilter from "@/components/common/DashboardDateFilter";
import ActivitySummaryCard from "@/components/dashboard/ActivitySummaryCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";

const DashboardContent = () => {
  const { data, status, error } = useDashboardData();
  const isLoading = status === "loading";

  const rangeLabel = data
    ? `${new Date(data.range.start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${new Date(data.range.end).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : "Last 7 days";

  const updatedLabel = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Real-time dashboard
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            SquadGoo Admin
          </h1>
          <p className="text-sm text-gray-500">
            Showing {rangeLabel} - latest values pulled {updatedLabel ?? "moments ago"}
          </p>
        </div>
        <DashboardDateFilter />
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-white/[0.03]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500"></span>
          <span>Updating metrics with the latest data.</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/40">
          Failed to load dashboard data. {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics metrics={data?.metrics ?? []} loading={isLoading} />
          <MonthlySalesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
      </div>
      {/* <ActivitySummaryCard summary={data?.summary} loading={isLoading} /> */}
    </div>
  );
};

const DashboardPageLayout = () => (
  <DashboardDateRangeProvider>
    <DashboardContent />
  </DashboardDateRangeProvider>
);

export default DashboardPageLayout;
