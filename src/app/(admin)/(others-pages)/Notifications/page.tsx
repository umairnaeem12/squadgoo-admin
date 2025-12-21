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
        desc="Click a notification to open the relevant page."
      >
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
              You are all caught up.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-wrap items-center gap-3 px-6 py-4 ${
                  notification.read ? "" : "bg-brand-100/60 dark:bg-brand-500/20"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={selectedIds.includes(notification.id)}
                  onChange={() => handleSelect(notification.id)}
                />
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  {iconMap[notification.icon]}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    markRead(notification.id);
                    router.push(notification.href);
                  }}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                      {notification.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {notification.desc}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {notification.time}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(notification.id)}
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
                    onClick={() => remove(notification.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-400 dark:hover:text-red-300"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </ComponentCard>
    </div>
  );
}
