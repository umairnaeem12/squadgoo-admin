"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export interface DashboardDateRange {
  start: string;
  end: string;
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getDefaultRange = (): DashboardDateRange => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

interface DashboardDateRangeContextValue {
  dateRange: DashboardDateRange;
  setDateRange: (range: DashboardDateRange) => void;
}

const DashboardDateRangeContext = createContext<
  DashboardDateRangeContextValue | undefined
>(undefined);

export const DashboardDateRangeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dateRange, setDateRange] = useState<DashboardDateRange>(
    getDefaultRange()
  );

  const value = useMemo(
    () => ({ dateRange, setDateRange }),
    [dateRange]
  );

  return (
    <DashboardDateRangeContext.Provider value={value}>
      {children}
    </DashboardDateRangeContext.Provider>
  );
};

export const useDashboardDateRange = () => {
  const context = useContext(DashboardDateRangeContext);
  if (!context) {
    throw new Error(
      "useDashboardDateRange must be used within DashboardDateRangeProvider"
    );
  }
  return context;
};
