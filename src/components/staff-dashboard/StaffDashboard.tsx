"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  Clock,
  MessageCircle,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import { useStaffDashboard } from "@/hooks/useStaffDashboard";
import { useStaffRole } from "@/context/StaffRoleContext";
import { useNotifications } from "@/context/NotificationContext";
import { useProfileData } from "@/hooks/useProfileData";
import type { ProfileTask } from "@/types/profile";
import type {
  StaffNotificationItem,
  StaffPriority,
  StaffTransferItem,
} from "@/types/staff-dashboard";

const priorityTone: Record<StaffPriority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
};

const priorityLabel: Record<StaffPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const relativeTime = (value: string) => {
  const target = new Date(value).getTime();
  const now = Date.now();
  const diffMs = now - target;
  const absMinutes = Math.round(Math.abs(diffMs) / 60000);
  const absHours = Math.round(absMinutes / 60);
  if (absMinutes < 60) {
    return diffMs >= 0 ? `${absMinutes}m ago` : `in ${absMinutes}m`;
  }
  if (absHours < 24) {
    return diffMs >= 0 ? `${absHours}h ago` : `in ${absHours}h`;
  }
  const days = Math.round(absHours / 24);
  return diffMs >= 0 ? `${days}d ago` : `in ${days}d`;
};

const StaffDashboard = () => {
  const { role, setRole, config, roleOptions } = useStaffRole();
  const { data, status, error } = useStaffDashboard();
  const { notifications: globalNotifications, unreadCount } = useNotifications();
  const { data: profileData } = useProfileData();

  const isLoading = status === "loading";
  const accessMenus = data?.access.menus ?? [];
  const [highCategory, setHighCategory] = useState<
    "all" | "overview" | "transfer" | "chat" | "followup" | "notification"
  >("all");
  const [transferFilter, setTransferFilter] = useState<"all" | "ticket" | "chat" | "dispute">(
    "all"
  );
  const [chatFilter, setChatFilter] = useState<"all" | "open" | "pending" | "transferred">(
    "all"
  );
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | StaffPriority
  >("all");
  const [followupFilter, setFollowupFilter] = useState<"all" | StaffPriority>("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState<
    "all" | ProfileTask["status"]
  >("all");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<
    "all" | ProfileTask["priority"]
  >("all");

  const mergedNotifications: StaffNotificationItem[] = useMemo(() => {
    const mappedGlobal = globalNotifications.slice(0, 3).map((item) => ({
      id: `global-${item.id}`,
      title: item.title,
      detail: item.preview,
      timeAgo: relativeTime(item.createdAt),
      href: item.href,
      priority: item.read ? ("low" as StaffPriority) : ("medium" as StaffPriority),
      type: item.type,
    }));
    return [...(data?.notifications ?? []), ...mappedGlobal];
  }, [data?.notifications, globalNotifications]);

  const highPriority = useMemo(() => {
    if (!data) return [];
    const items: Array<{
      id: string;
      title: string;
      href: string;
      note: string;
      priority: StaffPriority;
      icon: ReactNode;
      category: "overview" | "transfer" | "chat" | "followup" | "notification";
    }> = [];

    data.overview
      .filter((item) => item.priority === "high")
      .forEach((item) =>
        items.push({
          id: `overview-${item.id}`,
          title: item.label,
          href: item.href,
          note: `${item.count} to handle`,
          priority: item.priority,
          icon: <Sparkles className="h-4 w-4 text-red-500" />,
          category: "overview",
        })
      );

    data.transfers.forEach((item) =>
      items.push({
        id: `transfer-${item.id}`,
        title: item.title,
        href: item.href,
        note: item.note ?? "Transferred to you",
        priority: item.priority,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        category: "transfer",
      })
    );

    data.liveChats.items
      .filter((item) => item.priority === "high")
      .forEach((item) =>
        items.push({
          id: `chat-${item.id}`,
          title: `${item.customer} / ${item.channel === "call" ? "Call" : "Live chat"}`,
          href: item.href,
          note: `${item.status} / waiting ${item.waitMinutes}m`,
          priority: item.priority,
          icon: <MessagesSquare className="h-4 w-4 text-red-500" />,
          category: "chat",
        })
      );

    data.followUps
      .filter((item) => item.priority === "high")
      .forEach((item) =>
        items.push({
          id: `followup-${item.id}`,
          title: item.title,
          href: item.href,
          note: relativeTime(item.dueAt),
          priority: item.priority,
          icon: <Clock className="h-4 w-4 text-red-500" />,
          category: "followup",
        })
      );

    data.notifications
      .filter((item) => item.priority === "high")
      .forEach((item) =>
        items.push({
          id: `notif-${item.id}`,
          title: item.title,
          href: item.href,
          note: item.detail,
          priority: item.priority,
          icon: <BellRing className="h-4 w-4 text-red-500" />,
          category: "notification",
        })
      );

    return items;
  }, [data]);

  const filteredHighPriority = highPriority.filter((item) =>
    highCategory === "all" ? true : item.category === highCategory
  );

  const filteredTransfers = (data?.transfers ?? []).filter((item) =>
    transferFilter === "all" ? true : item.type === transferFilter
  );

  const filteredLiveChats = (data?.liveChats.items ?? []).filter((item) =>
    chatFilter === "all" ? true : item.status === chatFilter
  );

  const filteredNotifications = (mergedNotifications ?? []).filter((item) =>
    notificationFilter === "all" ? true : item.priority === notificationFilter
  );

  const filteredFollowUps = (data?.followUps ?? []).filter((item) =>
    followupFilter === "all" ? true : item.priority === followupFilter
  );

  const todayTasks = useMemo(
    () => (profileData?.tasks ?? []).filter((task) => task.isToday),
    [profileData?.tasks]
  );

  const filteredTodayTasks = todayTasks
    .filter((task) =>
      taskStatusFilter === "all" ? true : task.status === taskStatusFilter
    )
    .filter((task) =>
      taskPriorityFilter === "all" ? true : task.priority === taskPriorityFilter
    )
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
        Failed to load staff dashboard. {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Staff Dashboard
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              What to work on today
            </h1>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {data?.dateLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
              {config.departments.join(" | ")}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?.todayHeadline ?? "Prioritize high-priority transfers first."}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gray-400">
            <span>{data?.shift ?? "Today"}</span>
            <span className="h-1 w-1 rounded-full bg-gray-400" aria-hidden />
            <span>{config.duties.join(" | ")}</span>
          </div>
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 lg:mt-3 lg:w-auto lg:flex-row lg:items-start lg:gap-4">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
              Role
            </span>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as typeof role)
                }
                className="bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-white/[0.04] dark:text-gray-200 lg:min-w-[360px]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
              Access
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {accessMenus.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-[12px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-white/[0.03]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
          <span>Loading your role-based view...</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Action & today view
          </p>
          <ComponentCard
            title="High priority - do these first"
            desc="Transferred conversations, unanswered chats, and follow-ups overdue."
            headerRight={
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <select
                  value={highCategory}
                  onChange={(event) =>
                    setHighCategory(event.target.value as typeof highCategory)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All</option>
                  <option value="transfer">Transfers</option>
                  <option value="chat">Chats</option>
                  <option value="followup">Follow-ups</option>
                  <option value="overview">Today counts</option>
                  <option value="notification">Notifications</option>
                </select>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {filteredHighPriority.length} items
              </div>
            }
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredHighPriority.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                  No high-priority items right now.
                </p>
              ) : (
                filteredHighPriority.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-200">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityTone[item.priority]}`}
                        >
                          {priorityLabel[item.priority]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.note}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))
              )}
            </div>
          </ComponentCard>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Workload overview
          </p>
          <ComponentCard
            title="Today's overview"
            desc="Counts for today across chats, tickets, and follow-ups."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data?.overview.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                      {item.count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[item.priority]}`}
                  >
                    {priorityLabel[item.priority]}
                  </span>
                </Link>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Today's tasks"
            desc="Tasks assigned for today with quick filters."
            headerRight={
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <select
                  value={taskStatusFilter}
                  onChange={(event) =>
                    setTaskStatusFilter(event.target.value as typeof taskStatusFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All status</option>
                  <option value="assigned">Assigned</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={taskPriorityFilter}
                  onChange={(event) =>
                    setTaskPriorityFilter(event.target.value as typeof taskPriorityFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <span className="hidden sm:inline text-gray-400">
                  {filteredTodayTasks.length} tasks
                </span>
              </div>
            }
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTodayTasks.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                  No tasks scheduled for today.
                </p>
              ) : (
                filteredTodayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.description}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                        Due at {task.dueTime}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[task.priority as StaffPriority]}`}
                    >
                      {priorityLabel[task.priority as StaffPriority]}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ComponentCard>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Notifications
          </p>
          <ComponentCard
            title="Notifications with context"
            desc={`${unreadCount} unread across modules.`}
            headerRight={
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Priority</span>
                <select
                  value={notificationFilter}
                  onChange={(event) =>
                    setNotificationFilter(event.target.value as typeof notificationFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            }
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <span
                    className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${priorityTone[item.priority]}`}
                  >
                    <BellRing className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.detail}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                      {item.timeAgo}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </ComponentCard>
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Handovers & chats
          </p>
          <ComponentCard
            title="Transferred conversations & tickets"
            desc="Who sent it, when, and time since last response."
            headerRight={
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Filter</span>
                <select
                  value={transferFilter}
                  onChange={(event) =>
                    setTransferFilter(event.target.value as typeof transferFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All</option>
                  <option value="ticket">Tickets</option>
                  <option value="chat">Chats</option>
                  <option value="dispute">Disputes</option>
                </select>
              </div>
            }
          >
            <div className="space-y-3 px-2 py-3">
              {filteredTransfers.map((item: StaffTransferItem) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        From {item.from}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.note}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityTone[item.priority]}`}
                    >
                      {priorityLabel[item.priority]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                      <Clock className="h-3.5 w-3.5" />
                      {relativeTime(item.transferredAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                      <MessageCircle className="h-3.5 w-3.5" />
                      No response for {item.lastResponseMinutes}m
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                      <Sparkles className="h-3.5 w-3.5" />
                      {item.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Live chat status"
            desc="Open, pending, and transferred chats."
            headerRight={
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Status</span>
                <select
                  value={chatFilter}
                  onChange={(event) =>
                    setChatFilter(event.target.value as typeof chatFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
            }
          >
            <div className="space-y-3 px-2 py-3">
              {filteredLiveChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={chat.href}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {chat.customer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.channel === "call" ? "Call" : "Live chat"} / {chat.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Waiting {chat.waitMinutes} minutes
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[chat.priority]}`}
                  >
                    {priorityLabel[chat.priority]}
                  </span>
                </Link>
              ))}
            </div>
          </ComponentCard>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Team context
          </p>
          <ComponentCard
            title="Department snapshot"
            desc="New queries and unresolved work today."
          >
            <div className="space-y-3 px-2 py-3">
              {data?.departments.map((dept) => (
                <Link
                  key={dept.id}
                  href={dept.href ?? "/"}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {dept.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dept.info}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                        New today
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dept.newToday}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                        Unresolved
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dept.unresolved}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Duties & access today"
            desc="What you're supposed to work on and where you can go."
          >
            <div className="space-y-4 px-2 py-3">
              <div className="grid grid-cols-1 gap-3">
                {data?.duties.map((duty) => (
                  <Link
                    key={duty.id}
                    href={duty.href}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {duty.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {duty.detail}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[duty.priority ?? "medium"]}`}
                    >
                      {priorityLabel[duty.priority ?? "medium"]}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                {data?.access.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Follow-up & history awareness"
            desc="Yesterday's conversations and today's reminders."
            headerRight={
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Priority</span>
                <select
                  value={followupFilter}
                  onChange={(event) =>
                    setFollowupFilter(event.target.value as typeof followupFilter)
                  }
                  className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            }
          >
            <div className="space-y-3 px-2 py-3">
              {filteredFollowUps.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.context}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                      {relativeTime(item.dueAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[item.priority]}`}
                  >
                    {priorityLabel[item.priority]}
                  </span>
                </Link>
              ))}
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
