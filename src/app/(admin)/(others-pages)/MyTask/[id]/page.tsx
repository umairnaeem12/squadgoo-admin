"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useProfileData } from "@/hooks/useProfileData";
import type { ProfileTask } from "@/types/profile";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getStatusClass = (status: ProfileTask["status"]) => {
  if (status === "completed") {
    return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
  }
  if (status === "pending") {
    return "bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-200";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
};

const getPriorityClass = (priority: ProfileTask["priority"]) => {
  if (priority === "high") {
    return "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-200";
  }
  if (priority === "medium") {
    return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
  }
  return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
};

export default function MyTaskDetailPage() {
  const params = useParams();
  const taskId = typeof params.id === "string" ? params.id : params.id?.[0];
  const { data } = useProfileData();

  const task = useMemo(() => {
    if (!taskId) {
      return null;
    }
    return data?.tasks.find((item) => item.id === taskId) ?? null;
  }, [data?.tasks, taskId]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-800 dark:bg-white/5">
        Loading task...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-2 md:p-4 space-y-4">
        <Link
          href="/MyTask"
          className="text-sm font-medium text-brand-600 hover:text-brand-500"
        >
          ← Back to tasks
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-800 dark:bg-white/5">
          Task not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/MyTask"
          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to tasks
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Main content */}
      <ComponentCard title={"Task Details"}>
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Assigned by {task.assignedBy}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
            Description
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {task.description}
          </p>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3 dark:border-gray-800 dark:bg-gray-900/40">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
              Due date
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(task.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
              Due time
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {task.dueTime}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
              Today
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {task.isToday ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
