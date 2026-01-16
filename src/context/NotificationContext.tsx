"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type NotificationItem = {
  id: string;
  title: string;
  preview: string;
  fullText: string;
  createdAt: string; // ISO string for ordering and display
  type: string; // category label (Marketplace, Wallet, Quiz, etc.)
  source: string; // module/source name
  icon: "clock" | "alert" | "coins" | "chat" | "bell";
  href: string; // exact redirect target with context
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
  replaceAll: (items: NotificationItem[]) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const seedNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Marketplace dispute needs evidence",
    preview: "LIST-5001 is waiting on your mediator review.",
    fullText:
      "Marketplace dispute LIST-5001 is waiting on your mediator review. Evidence window closes in 2 hours; open the dispute thread to proceed.",
    createdAt: "2027-04-01T08:45:00Z",
    icon: "alert",
    type: "Marketplace",
    source: "Marketplace disputes",
    href: "/DisputeChat?case=LIST-5001&step=mediator-review",
    read: false,
  },
  {
    id: "notif-2",
    title: "SSG Coin access request decision",
    preview: "Ravi Kumar — pending review for SSG Coin access.",
    fullText:
      "Ravi Kumar (Finance Analyst) submitted an SSG Coin access request for withdrawal reconciliation. Open access control to approve, limit, or deny with reason.",
    createdAt: "2027-04-01T08:20:00Z",
    icon: "coins",
    type: "Wallet / SSG Coin",
    source: "Wallet",
    href: "/AdminWallet/access-control?req=REQ-9301",
    read: false,
  },
  {
    id: "notif-3",
    title: "Quiz timer warning",
    preview: "Quiz QZ-221 will expire in 10 minutes.",
    fullText:
      "Quiz QZ-221 will expire in 10 minutes. Open the quiz detail to submit remaining answers before the timer ends.",
    createdAt: "2027-04-01T08:05:00Z",
    icon: "clock",
    type: "Quiz",
    source: "Learning",
    href: "/MyTask?quiz=QZ-221&state=timer-warning",
    read: false,
  },
  {
    id: "notif-4",
    title: "Chat assigned: Ticket #323538",
    preview: "Live chat ticket #323538 assigned to you. Customer waiting.",
    fullText:
      "Live chat ticket #323538 has been assigned to you. The customer is waiting for a response in the live thread.",
    createdAt: "2027-04-01T07:55:00Z",
    icon: "chat",
    type: "Chat",
    source: "Support Chat",
    href: "/AdminChat?ticket=323538&mode=live",
    read: false,
  },
  {
    id: "notif-5",
    title: "Ticket #SUP-771 auto-close soon",
    preview: "Ticket #SUP-771 inactive 6 days; auto-close in 4 hours.",
    fullText:
      "Support ticket #SUP-771 has been inactive for 6 days and will auto-close in 4 hours. Open the ticket to respond or delay closure.",
    createdAt: "2027-04-01T07:35:00Z",
    icon: "bell",
    type: "Ticket",
    source: "Support Desk",
    href: "/support-tickets?ticket=SUP-771",
    read: true,
  },
  {
    id: "notif-6",
    title: "Dashboard alert: SLA spike",
    preview: "Ops SLA breached for Recruiter callbacks in the last hour.",
    fullText:
      "Operational SLA breached for Recruiter callbacks in the last hour. Review dashboard metrics and assign mitigation tasks.",
    createdAt: "2027-04-01T07:10:00Z",
    icon: "alert",
    type: "Dashboard",
    source: "Ops Dashboard",
    href: "/super-admin-dashboard?sla=callbacks",
    read: true,
  },
  {
    id: "notif-7",
    title: "Wallet hold released",
    preview: "Hold on TX-9058 was released; verify payout.",
    fullText:
      "Hold on transaction TX-9058 was released. Verify payout and reconcile the wallet movement in SG Coins.",
    createdAt: "2027-04-01T06:50:00Z",
    icon: "coins",
    type: "Wallet",
    source: "Wallet",
    href: "/AdminWallet?tx=TX-9058&tab=marketplace",
    read: true,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load from localStorage once on mount; fall back to seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sg_admin_notifications");
      if (stored) {
        const parsed = JSON.parse(stored) as NotificationItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch (error) {
      console.warn("Failed to parse notifications from storage", error);
    }
    setNotifications(seedNotifications);
  }, []);

  // Persist to localStorage when notifications change
  useEffect(() => {
    try {
      localStorage.setItem(
        "sg_admin_notifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.warn("Failed to persist notifications", error);
    }
  }, [notifications]);

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

  const replaceAll = (items: NotificationItem[]) => {
    setNotifications(items);
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
        replaceAll,
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
