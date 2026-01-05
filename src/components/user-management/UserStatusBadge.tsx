"use client";

import type { UserStatus } from "@/types/user-management";

interface UserStatusBadgeProps {
  status: UserStatus;
  size?: "sm" | "md";
}

export default function UserStatusBadge({ status, size = "sm" }: UserStatusBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5";

  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    },
    inactive: {
      label: "Inactive",
      className: "bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20",
    },
    suspended: {
      label: "Suspended",
      className: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
    },
    "pending-deletion": {
      label: "Pending Deletion",
      className: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-green-500" : status === "suspended" ? "bg-orange-500" : status === "pending-deletion" ? "bg-red-500" : "bg-gray-400"}`} />
      {config.label}
    </span>
  );
}
