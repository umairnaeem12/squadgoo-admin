"use client";
import React from "react";
import { BoxCubeIcon, BoxIconLine, DollarLineIcon, GroupIcon } from "@/icons";
import DashboardMetricCard from "../common/DashboardMetricCard";

const metrics = [
  {
    label: "Job Seekers",
    value: "3,782",
    trend: "+11.0% vs last month",
    trendDirection: "up" as const,
    icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
  },
  {
    label: "Recruiters",
    value: "5,359",
    trend: "-9.0% vs last month",
    trendDirection: "down" as const,
    icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
  },
  {
    label: "Active Contracts",
    value: "1,246",
    trend: "+4.2% QoQ",
    trendDirection: "up" as const,
    icon: <BoxCubeIcon className="text-gray-800 dark:text-white/90" />,
  },
  {
    label: "Monthly SG Coin Volume",
    value: "$218k",
    trend: "+18.9% vs baseline",
    trendDirection: "up" as const,
    icon: <DollarLineIcon className="text-gray-800 dark:text-white/90" />,
  },
  {
    label: "Jobs Posted Today",
    value: "248",
    trend: "+6.4% vs yesterday",
    trendDirection: "up" as const,
    icon: <BoxCubeIcon className="text-gray-800 dark:text-white/90" />,
  },
  {
    label: "New Support Tickets",
    value: "37",
    trend: "-12.3% vs last week",
    trendDirection: "down" as const,
    icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
  },
];

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      {metrics.map((metric) => (
        <DashboardMetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
};
