"use client";
import { useEffect, useMemo, useState } from "react";
import { useDashboardDateRange } from "@/context/DashboardDateRangeContext";

const todayIso = new Date().toISOString().split("T")[0];

const DashboardDateFilter = () => {
  const { dateRange, setDateRange } = useDashboardDateRange();
  const [localStart, setLocalStart] = useState(dateRange.start);
  const [localEnd, setLocalEnd] = useState(dateRange.end);

  useEffect(() => {
    setLocalStart(dateRange.start);
    setLocalEnd(dateRange.end);
  }, [dateRange]);

  const rangeLabel = useMemo(() => {
    if (!localStart || !localEnd) {
      return "Custom range";
    }
    const startLabel = new Date(localStart).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endLabel = new Date(localEnd).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startLabel} - ${endLabel}`;
  }, [localStart, localEnd]);

  const isValidRange =
    localStart && localEnd && localStart.length && localEnd.length && localStart <= localEnd;

  const applyRange = () => {
    if (!isValidRange) {
      return;
    }
    setDateRange({
      start: localStart,
      end: localEnd,
    });
  };

  return (
    <div className="flex flex-col gap-2 text-right sm:text-left">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Date range
      </span>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <input
          type="date"
          className="h-10 rounded-lg border border-transparent bg-transparent text-sm text-gray-700 outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-500/40"
          max={todayIso}
          value={localStart}
          onChange={(event) => setLocalStart(event.target.value)}
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="date"
          className="h-10 rounded-lg border border-transparent bg-transparent text-sm text-gray-700 outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-500/40"
          max={todayIso}
          value={localEnd}
          onChange={(event) => setLocalEnd(event.target.value)}
        />
        <button
          type="button"
          disabled={!isValidRange}
          onClick={applyRange}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          Apply
        </button>
      </div>
      <p className="text-xs text-gray-500">Currently showing {rangeLabel}</p>
    </div>
  );
};

export default DashboardDateFilter;
