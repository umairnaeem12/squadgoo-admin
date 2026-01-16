"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import {
  AlertTriangle,
  BellRing,
  Clock,
  Coins,
  MessageCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markRead, toggleRead, remove, clearAll } =
    useNotifications();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = useMemo(
    () => notifications.length > 0 && selectedIds.length === notifications.length,
    [notifications.length, selectedIds.length]
  );

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(notifications.map((item) => item.id));
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => remove(id));
    setSelectedIds([]);
  };

  const iconMap = {
    clock: <Clock className="w-4 h-4 text-brand-500" />,
    alert: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    coins: <Coins className="w-4 h-4 text-emerald-500" />,
    chat: <MessageCircle className="w-4 h-4 text-purple-500" />,
    bell: <BellRing className="w-4 h-4 text-slate-500" />,
  };

  const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {unreadCount} unread notifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {allSelected ? "Clear selection" : "Select all"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete selected
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      </div>

      <ComponentCard
        title="All notifications"
        desc="Click a notification to open the relevant page with full context."
      >
        <div className="flex flex-col gap-4">
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
              You are all caught up.
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  markRead(notification.id);
                  router.push(notification.href);
                }}
                className={`block w-full text-left rounded-2xl border p-5 transition hover:border-brand-200 ${
                  notification.read
                    ? "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                    : "border-brand-100 bg-brand-50/60 dark:border-brand-500/30 dark:bg-brand-500/10"
                }`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    checked={selectedIds.includes(notification.id)}
                    onChange={(event) => {
                      event.stopPropagation();
                      handleSelect(notification.id);
                    }}
                  />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    {iconMap[notification.icon]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                          {notification.type}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            notification.read
                              ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200"
                          }`}
                        >
                          {notification.read ? "Read" : "Unread"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{notification.source}</span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDateTime(notification.createdAt)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="line-clamp-2">{notification.preview}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                      {notification.fullText}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleRead(notification.id);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:text-gray-400 dark:hover:text-brand-300"
                      aria-label={notification.read ? "Mark unread" : "Mark read"}
                    >
                      {notification.read ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        remove(notification.id);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-400 dark:hover:text-red-300"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ComponentCard>
    </div>
  );
}
