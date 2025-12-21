"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

export type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: string;
  icon: "clock" | "alert" | "coins" | "chat" | "bell";
  href: string;
  read: boolean;
};

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  toggleRead: (id: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
  setAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const seedNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Quick job timer low",
    desc: "Job #QJ-938 will exhaust recruiter wallet in < 1h.",
    time: "Just now",
    icon: "clock",
    type: "Quick job",
    href: "/support-tickets",
    read: false,
  },
  {
    id: "notif-2",
    title: "Marketplace hold > 7 days",
    desc: "LIST-5001 still on hold; mediator reminder issued.",
    time: "5 min ago",
    icon: "alert",
    type: "Marketplace",
    href: "/DisputeChat?case=LIST-5001",
    read: false,
  },
  {
    id: "notif-3",
    title: "Referral payout ready",
    desc: "Jobseeker badge referral payout 20 SG coins.",
    time: "20 min ago",
    icon: "coins",
    type: "Referral",
    href: "/AdminWallet",
    read: true,
  },
  {
    id: "notif-4",
    title: "Chat assigned to you",
    desc: "Ticket #323538 needs your response.",
    time: "35 min ago",
    icon: "chat",
    type: "Chat",
    href: "/AdminChat?ticket=323538&mode=live",
    read: false,
  },
  {
    id: "notif-5",
    title: "Support ticket auto-close",
    desc: "Ticket #SUP-771 inactive 6 days; auto-close soon.",
    time: "1 hr ago",
    icon: "bell",
    type: "Support",
    href: "/support-tickets",
    read: true,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(seedNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item
      )
    );
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const setAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markRead,
        toggleRead,
        remove,
        clearAll,
        setAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
