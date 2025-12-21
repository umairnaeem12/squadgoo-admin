"use client";
import { useEffect, useState } from "react";
import { useDashboardDateRange } from "@/context/DashboardDateRangeContext";
import type { DashboardDataResponse, DashboardPeriod } from "@/types/dashboard";

type FetchStatus = "idle" | "loading" | "success" | "error";

export const useDashboardCardData = (period: DashboardPeriod) => {
  const { dateRange } = useDashboardDateRange();
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetch(
      `/api/dashboard?start=${dateRange.start}&end=${dateRange.end}&period=${period}`,
      {
        signal: controller.signal,
        cache: "no-store",
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load dashboard data");
        }
        return res.json();
      })
      .then((json: DashboardDataResponse) => {
        setData(json);
        setStatus("success");
      })
      .catch((err) => {
        const fetchError = err as Error;
        if (fetchError.name === "AbortError") {
          return;
        }
        setError(fetchError.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [dateRange.end, dateRange.start, period]);

  return { data, status, error };
};
