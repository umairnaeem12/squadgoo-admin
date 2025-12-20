import { NextRequest, NextResponse } from "next/server";
import type { DashboardPeriod } from "@/types/dashboard";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const formatLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const defaultRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return { start, end };
};

const ensureRange = (start?: string | null, end?: string | null) => {
  const safeDefault = defaultRange();
  const parsedStart = start ? new Date(start) : safeDefault.start;
  const parsedEnd = end ? new Date(end) : safeDefault.end;
  if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
    return safeDefault;
  }
  if (parsedEnd < parsedStart) {
    return { start: parsedEnd, end: parsedStart };
  }
  return { start: parsedStart, end: parsedEnd };
};

const periodSettings: Record<DashboardPeriod, {
  label: string;
  days: number;
  revenueRange: [number, number];
  targetRange: [number, number];
  todayRange: [number, number];
}> = {
  weekly: {
    label: "last week",
    days: 7,
    revenueRange: [16800, 23500],
    targetRange: [18000, 24000],
    todayRange: [700, 1600],
  },
  monthly: {
    label: "last month",
    days: 30,
    revenueRange: [120000, 165000],
    targetRange: [125000, 175000],
    todayRange: [1700, 3200],
  },
  yearly: {
    label: "last year",
    days: 90,
    revenueRange: [850000, 1100000],
    targetRange: [900000, 1150000],
    todayRange: [2000, 4200],
  },
};

const ensurePeriod = (value: string | null): DashboardPeriod =>
  value && value in periodSettings ? (value as DashboardPeriod) : "weekly";

type MetricFormat = "currency" | "number";

const formatMetricValue = (value: number, format: MetricFormat) =>
  format === "currency"
    ? `$${value.toLocaleString("en-US")}`
    : value.toLocaleString("en-US");

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const metricDefinitions = [
  {
    label: "Job Seekers",
    type: "jobSeekers",
    min: 3200,
    max: 4200,
    href: "/JobseekerDirectory",
    format: "number",
  },
  {
    label: "Recruiters",
    type: "recruiters",
    min: 4500,
    max: 5400,
    href: "/RecruiterDirectory",
    format: "number",
  },
  {
    label: "Active Contracts",
    type: "activeContracts",
    min: 1100,
    max: 1400,
    href: "/JobPostManagement",
    format: "number",
  },
  {
    label: "SG Coin Volume",
    type: "sgVolume",
    min: 160000,
    max: 250000,
    href: "/MarketplaceControl",
    format: "currency",
  },
  {
    label: "Jobs Posted Today",
    type: "newJobs",
    min: 150,
    max: 280,
    href: "/JobPostManagement",
    format: "number",
  },
  {
    label: "Support Tickets",
    type: "supportTickets",
    min: 20,
    max: 55,
    href: "/support-tickets",
    format: "number",
  },
];

const buildMetrics = () =>
  metricDefinitions.map((metric) => {
    const direction = Math.random() > 0.5 ? "up" : "down";
    const trendValue = (Math.random() * 5 + 1).toFixed(1);
    const period = direction === "up" ? "last week" : "last month";

    return {
      label: metric.label,
      value: formatMetricValue(randomBetween(metric.min, metric.max), metric.format),
      trend: `${direction === "up" ? "+" : "-"}${trendValue}% vs ${period}`,
      trendDirection: direction,
      href: metric.href,
      type: metric.type,
    };
  });

const buildSales = (end: Date, days: number) => {
  const categories: string[] = [];
  const values: number[] = [];
  const cursor = new Date(end);
  cursor.setDate(cursor.getDate() - (days - 1));
  for (let i = 0; i < days; i += 1) {
    categories.push(formatLabel(new Date(cursor)));
    values.push(randomBetween(120, 360));
    cursor.setDate(cursor.getDate() + 1);
  }
  return { categories, values };
};

const buildGrowth = (activePeriod: DashboardPeriod) => {
  const progress = parseFloat((65 + Math.random() * 25).toFixed(1));
  type GrowthSnapshot = {
    callout: string;
    target: string;
    revenue: string;
    today: string;
    description: string;
  };
  const periods = (Object.keys(periodSettings) as DashboardPeriod[]).reduce(
    (acc, period) => {
      const settings = periodSettings[period];
      acc[period] = {
        callout: `+${(Math.random() * 6 + 4).toFixed(1)}% vs ${settings.label}`,
        target: `$${randomBetween(
          settings.targetRange[0],
          settings.targetRange[1]
        ).toLocaleString("en-US")}`,
        revenue: `$${randomBetween(
          settings.revenueRange[0],
          settings.revenueRange[1]
        ).toLocaleString("en-US")}`,
        today: `$${randomBetween(
          settings.todayRange[0],
          settings.todayRange[1]
        ).toLocaleString("en-US")}`,
        description:
          `Revenue + engagement tracking for the ${settings.label} window. Drill into the charts if you need a deeper look.`,
      };
      return acc;
    },
    {} as Record<DashboardPeriod, GrowthSnapshot>
  );

  return {
    progress,
    periods,
    activePeriod,
    callout: periods[activePeriod].callout,
    target: periods[activePeriod].target,
    revenue: periods[activePeriod].revenue,
    today: periods[activePeriod].today,
    description: periods[activePeriod].description,
  };
};

const buildSummary = () => {
  const randomHours = (1.8 + Math.random() * 2).toFixed(1);
  return {
    jobsPostedToday: randomBetween(180, 270),
    jobsFilledToday: randomBetween(140, 210),
    avgTimeToFill: `${randomHours} hours`,
    newJobSeekers: randomBetween(60, 130),
    newRecruiters: randomBetween(18, 42),
    usersOnlineNow: randomBetween(420, 760),
    newSupportTickets: randomBetween(25, 45),
    ticketsResolvedToday: randomBetween(30, 55),
    highRiskAlerts: randomBetween(1, 6),
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { start, end } = ensureRange(
    searchParams.get("start"),
    searchParams.get("end")
  );
  const requestedPeriod = ensurePeriod(searchParams.get("period"));

  const sales = buildSales(end, periodSettings[requestedPeriod].days);
  const metrics = buildMetrics();
  const growth = buildGrowth(requestedPeriod);
  const summary = buildSummary();

  return NextResponse.json({
    metrics,
    sales,
    growth,
    summary,
    range: {
      start: formatDate(start),
      end: formatDate(end),
    },
    updatedAt: new Date().toISOString(),
  });
}
