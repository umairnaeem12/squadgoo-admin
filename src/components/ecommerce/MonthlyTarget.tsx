"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useDashboardCardData } from "@/hooks/useDashboardCardData";
import { useDashboardDateRange } from "@/context/DashboardDateRangeContext";
import type { DashboardPeriod } from "@/types/dashboard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const periodLabels: Record<DashboardPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function MonthlyTarget() {
  const [growthPeriod, setGrowthPeriod] = useState<DashboardPeriod>("weekly");
  const { data, status } = useDashboardCardData(growthPeriod);
  const growth = data?.growth;
  const isLoading = status === "loading";
  const { dateRange } = useDashboardDateRange();

  const progress = growth?.progress ?? 0;
  const fallbackPeriod = {
    callout: growth?.callout ?? "+5.7% vs last week",
    target: growth?.target ?? "$20K",
    revenue: growth?.revenue ?? "$18.2K",
    today: growth?.today ?? "$2.1K",
    description:
      growth?.description ?? "Revenue + engagement tracking for the current window.",
  };

  const periodData = growth?.periods?.[growthPeriod] ?? fallbackPeriod;

  const summary = [
    {
      label: "Target",
      value: periodData.target,
    },
    {
      label: "Revenue",
      value: periodData.revenue,
    },
    {
      label: "Today",
      value: periodData.today,
    },
  ];

  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#465FFF"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: {
            size: "80%",
          },
          track: {
            background: "#E4E7EC",
            strokeWidth: "100%",
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: function (val: number) {
                return `${val.toFixed(1)}%`;
              },
            },
          },
        },
      },
      fill: {
        type: "solid",
        colors: ["#465FFF"],
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
    }),
    []
  );

  const series = [progress];

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {periodLabels[growthPeriod]} Growth
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              {periodData.description}
            </p>
            <div className="mt-2 text-xs font-medium text-gray-500">
              {periodLabels[growthPeriod]} view · {dateRange.start} – {dateRange.end}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>Filter:</span>
            <select
              value={growthPeriod}
              onChange={(event) =>
                setGrowthPeriod(event.target.value as DashboardPeriod)
              }
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm transition hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-300"
            >
              {Object.entries(periodLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-gray-400">Range</span>
          </div>
        </div>
        <div className="relative mt-5">
          <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {periodData.callout}
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You earned {periodData.today} so far, trending {periodData.callout.toLowerCase()}.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        {summary.map((item) => (
          <div key={item.label}>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              {item.label}
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-gray-900/60">
          <span className="h-3 w-3 animate-spin rounded-full border border-brand-500 border-t-transparent"></span>
        </div>
      )}
    </div>
  );
}
