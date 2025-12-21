"use client";
import React from "react";
import {
  BoxIconLine,
  BoxCubeIcon,
  DollarLineIcon,
  GroupIcon,
  TaskIcon,
  UserIcon,
} from "@/icons";
import DashboardMetricCard from "../common/DashboardMetricCard";
import type { DashboardMetric, MetricType } from "@/types/dashboard";

interface EcommerceMetricsProps {
  metrics: DashboardMetric[];
  loading?: boolean;
}

const iconMap: Record<MetricType, React.ReactNode> = {
  jobSeekers: <GroupIcon className="text-gray-800 dark:text-white/90" />, 
  recruiters: <UserIcon className="text-gray-800 dark:text-white/90" />,
  activeContracts: <BoxCubeIcon className="text-gray-800 dark:text-white/90" />, 
  sgVolume: <DollarLineIcon className="text-gray-800 dark:text-white/90" />, 
  newJobs: <TaskIcon className="text-gray-800 dark:text-white/90" />, 
  supportTickets: <BoxIconLine className="text-gray-800 dark:text-white/90" />, 
};

const skeletonCards = Array.from({ length: 4 }, (_, index) => (
  <div
    key={`skeleton-${index}`}
    className="flex animate-pulse flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-6"
  >
    <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
    <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
    <div className="h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-800"></div>
  </div>
));

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({
  metrics,
  loading = false,
}) => {
  if (loading && metrics.length === 0) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
        style={{ gridAutoRows: "1fr" }}
      >
        {skeletonCards}
      </div>
    );
  }

  if (!metrics.length) {
    return null;
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
      style={{ gridAutoRows: "1fr" }}
    >
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={`${metric.label}-${metric.type}`}
          icon={
            iconMap[metric.type] ?? (
              <BoxIconLine className="text-gray-800 dark:text-white/90" />
            )
          }
          {...metric}
        />
      ))}
    </div>
  );
};
