export type DashboardPeriod = "weekly" | "monthly" | "yearly";
export type MetricTrendDirection = "up" | "down";

export type MetricType =
  | "jobSeekers"
  | "recruiters"
  | "activeContracts"
  | "sgVolume"
  | "newJobs"
  | "supportTickets";

export interface DashboardMetric {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: MetricTrendDirection;
  href?: string;
  type: MetricType;
}

export interface DashboardSalesData {
  categories: string[];
  values: number[];
}

export interface DashboardGrowthPeriodData {
  callout: string;
  target: string;
  revenue: string;
  today: string;
  description: string;
}

export interface DashboardGrowthData {
  progress: number;
  periods: Record<DashboardPeriod, DashboardGrowthPeriodData>;
  callout?: string;
  target?: string;
  revenue?: string;
  today?: string;
  description?: string;
  activePeriod?: DashboardPeriod;
}

export interface DashboardActivitySummary {
  jobsPostedToday: number;
  jobsFilledToday: number;
  avgTimeToFill: string;
  newJobSeekers: number;
  newRecruiters: number;
  usersOnlineNow: number;
  newSupportTickets: number;
  ticketsResolvedToday: number;
  highRiskAlerts: number;
}

export interface DashboardDataResponse {
  metrics: DashboardMetric[];
  sales: DashboardSalesData;
  growth: DashboardGrowthData;
  summary: DashboardActivitySummary;
  updatedAt: string;
  range: {
    start: string;
    end: string;
  };
}
