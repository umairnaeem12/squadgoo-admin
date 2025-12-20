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

export default function MonthlySalesChart() {
  const [chartPeriod, setChartPeriod] = useState<DashboardPeriod>("weekly");
  const { data, status } = useDashboardCardData(chartPeriod);
  const sales = data?.sales;
  const isLoading = status === "loading";
  const { dateRange } = useDashboardDateRange();

  const categories = sales?.categories ?? ["Loading"];
  const values = sales?.values ?? [0];

  const options: ApexOptions = useMemo(
    () => ({
      colors: values.length ? ["#465fff"] : ["#cbd5f5"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "bar",
        height: 180,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "39%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Outfit",
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
    }),
    [categories, values]
  );

  const series = useMemo(
    () => [
      {
        name: "Sales",
        data: values.length ? values : [0],
      },
    ],
    [values]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {periodLabels[chartPeriod]} Sales
          </h3>
          <div className="mt-2 text-xs font-medium text-gray-500">
            {periodLabels[chartPeriod]} view · {dateRange.start} – {dateRange.end}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span>Filter:</span>
          <select
            value={chartPeriod}
            onChange={(event) =>
              setChartPeriod(event.target.value as DashboardPeriod)
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

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-gray-900/60">
                <span className="h-3 w-3 animate-spin rounded-full border border-brand-500 border-t-transparent"></span>
              </div>
            )}
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
