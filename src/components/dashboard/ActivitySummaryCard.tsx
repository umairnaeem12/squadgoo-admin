"use client";

import React from "react";
import type { DashboardActivitySummary } from "@/types/dashboard";

interface ActivitySummaryCardProps {
  summary?: DashboardActivitySummary;
  loading?: boolean;
}

const defaultSummary: DashboardActivitySummary = {
  jobsPostedToday: 0,
  jobsFilledToday: 0,
  avgTimeToFill: "0.0 hours",
  newJobSeekers: 0,
  newRecruiters: 0,
  usersOnlineNow: 0,
  newSupportTickets: 0,
  ticketsResolvedToday: 0,
  highRiskAlerts: 0,
};

const ActivitySummaryCard: React.FC<ActivitySummaryCardProps> = ({
  summary,
  loading = false,
}) => {
  const data = summary ?? defaultSummary;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-gray-900/60">
          <span className="h-3 w-3 animate-spin rounded-full border border-brand-500 border-t-transparent"></span>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Today's Activity Summary
          </h3>
          <p className="text-sm text-gray-500">
            High-level snapshot for today's SquadGoo platform activity within the selected range.
          </p>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="space-y-1 text-sm text-gray-500">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Jobs
            </p>
            <p>
              Jobs posted today: <span className="font-semibold text-gray-900 dark:text-white">{data.jobsPostedToday.toLocaleString("en-US")}</span>
            </p>
            <p>
              Jobs filled today: <span className="font-semibold text-gray-900 dark:text-white">{data.jobsFilledToday.toLocaleString("en-US")}</span>
            </p>
            <p>
              Average time to fill: <span className="font-semibold text-gray-900 dark:text-white">{data.avgTimeToFill}</span>
            </p>
          </div>
          <div className="space-y-1 text-sm text-gray-500">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Users
            </p>
            <p>
              New job seekers: <span className="font-semibold text-gray-900 dark:text-white">{data.newJobSeekers.toLocaleString("en-US")}</span>
            </p>
            <p>
              New recruiters: <span className="font-semibold text-gray-900 dark:text-white">{data.newRecruiters.toLocaleString("en-US")}</span>
            </p>
            <p>
              Users online now: <span className="font-semibold text-gray-900 dark:text-white">{data.usersOnlineNow.toLocaleString("en-US")}</span>
            </p>
          </div>
          <div className="space-y-1 text-sm text-gray-500">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Support & Risk
            </p>
            <p>
              New support tickets: <span className="font-semibold text-gray-900 dark:text-white">{data.newSupportTickets.toLocaleString("en-US")}</span>
            </p>
            <p>
              Tickets resolved today: <span className="font-semibold text-gray-900 dark:text-white">{data.ticketsResolvedToday.toLocaleString("en-US")}</span>
            </p>
            <p>
              High-risk alerts triggered: <span className="font-semibold text-gray-900 dark:text-white">{data.highRiskAlerts.toLocaleString("en-US")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummaryCard;
