import React from "react";
import Link from "next/link";
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
  href?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendDirection = "up",
  badgeColor,
  href,
}) => {
  const resolvedBadgeColor: BadgeColor =
    badgeColor ?? (trendDirection === "up" ? "success" : "error");

  const TrendIcon = trendDirection === "up" ? ArrowUpIcon : ArrowDownIcon;

  const cardContent = (
    <div
      className={`min-h-[170px] h-full flex-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/10 dark:bg-white/10 dark:shadow-black/30 md:p-6 ${
        href ? "cursor-pointer hover:border-brand-300 hover:shadow-lg" : ""
      }`}
    >
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-xl text-gray-500 shadow-inner shadow-gray-200 dark:bg-gray-800 dark:text-white/60">
          {icon}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
        {trend && (
          <div className="flex justify-end">
            <Badge
              color={resolvedBadgeColor}
              startIcon={
                <TrendIcon
                  className={
                    trendDirection === "down" ? "text-error-500" : undefined
                  }
                />
              }
            >
              {trend}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link aria-label={label} href={href} className="block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default React.memo(DashboardMetricCard);
