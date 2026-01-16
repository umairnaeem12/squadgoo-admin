"use client";

import { useEffect, useState } from "react";
import { useStaffRole } from "@/context/StaffRoleContext";
import type { StaffDashboardResponse } from "@/types/staff-dashboard";

type FetchStatus = "idle" | "loading" | "success" | "error";

export const useStaffDashboard = () => {
  const { role } = useStaffRole();
  const [data, setData] = useState<StaffDashboardResponse | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetch(`/api/staff-dashboard?role=${role}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load staff dashboard");
        }
        return res.json();
      })
      .then((json: StaffDashboardResponse) => {
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
  }, [role]);

  return { data, status, error };
};
