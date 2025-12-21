"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
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

export default function MyTaskPage() {
  const router = useRouter();
  const { data } = useProfileData();
  const tasks = data?.tasks ?? [];

  const [statusFilter, setStatusFilter] = useState<"all" | ProfileTask["status"]>(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | ProfileTask["priority"]
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const handleRangeChange = useCallback((selectedDates: Date[], dateStr: string) => {
    if (!selectedDates.length) {
      setRangeStart("");
      setRangeEnd("");
      return;
    }
    if (selectedDates.length === 1) {
      setRangeStart(dateStr);
      setRangeEnd("");
      return;
    }
    const [start, end] = dateStr.split(" to ");
    setRangeStart(start || "");
    setRangeEnd(end || "");
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const startTimestamp = rangeStart
      ? new Date(rangeStart).setHours(0, 0, 0, 0)
      : null;
    const endTimestamp = rangeEnd
      ? new Date(rangeEnd).setHours(23, 59, 59, 999)
      : null;

    return tasks
      .filter((task) => (statusFilter === "all" ? true : task.status === statusFilter))
      .filter((task) =>
        priorityFilter === "all" ? true : task.priority === priorityFilter
      )
      .filter((task) => {
        if (!query) {
          return true;
        }
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignedBy.toLowerCase().includes(query)
        );
      })
      .filter((task) => {
        if (!startTimestamp && !endTimestamp) {
          return true;
        }
        const taskTimestamp = new Date(task.dueDate).getTime();
        if (startTimestamp !== null && taskTimestamp < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && taskTimestamp > endTimestamp) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, statusFilter, priorityFilter, searchTerm, rangeStart, rangeEnd]);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        My Task
      </p>

      <ComponentCard
        title="All tasks"
        desc="Full task list with filters for status, priority, and due date."
        headerRight={
          <div className="ml-auto flex items-end gap-3">
            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Status
              </span>
              <div className="flex h-8 w-36 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as ProfileTask["status"] | "all")
                  }
                  className="w-full bg-transparent text-[11px] font-medium text-gray-600 focus:outline-none dark:text-gray-300"
                >
                  <option value="all">All statuses</option>
                  <option value="assigned">Assigned</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Priority
              </span>
              <div className="flex h-8 w-36 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900">
                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as ProfileTask["priority"] | "all")
                  }
                  className="w-full bg-transparent text-[11px] font-medium text-gray-600 focus:outline-none dark:text-gray-300"
                >
                  <option value="all">All priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Date (icon-only) */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Date
              </span>
              <div className="relative h-8 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <DatePicker
                  id="my-task-date-range"
                  mode="range"
                  wrapperClassName="absolute right-[-4px]"
                  inputClassName="absolute inset-0 opacity-0 cursor-pointer"
                  defaultDate={rangeStart && rangeEnd ? `${rangeStart} to ${rangeEnd}` : undefined}
                  onChange={handleRangeChange}
                />
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                Search
              </span>
              <Input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks"
                className="h-8 w-52 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 dark:bg-gray-900"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Assigned By</th>
                {/* <th className="px-6 py-3 font-medium">Due Date</th> */}
                {/* <th className="px-6 py-3 font-medium">Due Time</th> */}
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Status</th>
                {/* <th className="px-6 py-3 font-medium">Today</th> */}
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No tasks match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => router.push(`/MyTask/${task.id}`)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {task.description}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {task.assignedBy}
                    </td>
                    {/* <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {task.dueTime}
                    </td> */}
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-3">
                      {task.isToday ? (
                        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No
                        </span>
                      )}
                    </td> */}
                    <td className="px-6 py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          router.push(`/MyTask/${task.id}`);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-200"
                        aria-label={`View ${task.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}
