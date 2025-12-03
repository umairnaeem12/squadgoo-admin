import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

type TrendDirection = "up" | "down";

type BadgeColor = "success" | "error" | "warning" | "info";

interface DashboardMetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: TrendDirection;
  badgeColor?: BadgeColor;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendDirection = "up",
  badgeColor,
}) => {
  const resolvedBadgeColor: BadgeColor =
    badgeColor ?? (trendDirection === "up" ? "success" : "error");

  const TrendIcon = trendDirection === "up" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>

        {trend && (
          <Badge color={resolvedBadgeColor}>
            <TrendIcon
              className={
                trendDirection === "down" ? "text-error-500" : undefined
              }
            />
            {trend}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default React.memo(DashboardMetricCard);
