"use client";
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { AdminUser, Task, Ticket, WalletCase, KYCCase } from "@/types/admin-system";
import Link from "next/link";

export default function SuperAdminOverview() {
  const { currentAdmin } = useAdminAuth();
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalAdmins: 0,
    totalManagers: 0,
    openTickets: 0,
    openChatReports: 0,
    pendingKYC: 0,
    pendingWallet: 0,
    unassignedTasks: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const adminUsers: AdminUser[] = JSON.parse(
      localStorage.getItem("adminUsers") || "[]"
    );
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const tickets: Ticket[] = JSON.parse(
      localStorage.getItem("tickets") || "[]"
    );
    const kycCases: KYCCase[] = JSON.parse(
      localStorage.getItem("kycCases") || "[]"
    );
    const walletCases: WalletCase[] = JSON.parse(
      localStorage.getItem("walletCases") || "[]"
    );

    setStats({
      totalStaff: adminUsers.filter((u) => u.role === "staff").length,
      totalAdmins: adminUsers.filter((u) => u.role === "admin").length,
      totalManagers: adminUsers.filter((u) => u.role === "manager").length,
      openTickets: tickets.filter((t) => t.status === "open" || t.status === "assigned").length,
      openChatReports: tasks.filter((t) => t.type === "chat_report" && t.status === "open").length,
      pendingKYC: kycCases.filter((k) => k.status === "pending_review").length,
      pendingWallet: walletCases.filter((w) => w.status === "pending").length,
      unassignedTasks: tasks.filter((t) => !t.assignedTo).length,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Control Center
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {currentAdmin?.name}. Here's your operational snapshot.
        </p>
      </div>

      {/* Team Stats */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Team Overview
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            title="Admins"
            value={stats.totalAdmins}
            icon="👨‍💼"
            color="blue"
          />
          <StatCard
            title="Managers"
            value={stats.totalManagers}
            icon="👔"
            color="purple"
          />
          <StatCard
            title="Staff"
            value={stats.totalStaff}
            icon="👤"
            color="green"
          />
        </div>
      </div>

      {/* Operational Stats */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Operational Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Open Tickets"
            value={stats.openTickets}
            icon="🎫"
            color="orange"
            link="/super-admin/queues?tab=tickets"
          />
          <StatCard
            title="Chat Reports"
            value={stats.openChatReports}
            icon="💬"
            color="red"
            link="/super-admin/queues?tab=chat-reports"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKYC}
            icon="🆔"
            color="yellow"
            link="/super-admin/queues?tab=kyc"
          />
          <StatCard
            title="Pending Wallet"
            value={stats.pendingWallet}
            icon="💰"
            color="green"
            link="/super-admin/queues?tab=wallet"
          />
        </div>
      </div>

      {/* Unassigned Tasks Widget */}
      {stats.unassignedTasks > 0 && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                ⚠️ Unassigned Tasks
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {stats.unassignedTasks} task{stats.unassignedTasks > 1 ? "s" : ""} waiting for assignment
              </p>
            </div>
            <Link
              href="/super-admin/task-assignment"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Assign Now
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/super-admin/admin-management"
            title="Create New User"
            description="Add admin, manager, or staff"
            icon="➕"
          />
          <QuickLink
            href="/super-admin/task-assignment"
            title="Assign Tasks"
            description="Distribute work to your team"
            icon="📋"
          />
          <QuickLink
            href="/super-admin/permissions"
            title="Manage Permissions"
            description="Configure access control"
            icon="🔐"
          />
          <QuickLink
            href="/super-admin/queues"
            title="View All Queues"
            description="Monitor operational queues"
            icon="📦"
          />
          <QuickLink
            href="/super-admin/audit-logs"
            title="Audit Logs"
            description="Review system activity"
            icon="📜"
          />
          <QuickLink
            href="/super-admin/settings"
            title="Settings"
            description="System configuration"
            icon="⚙️"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  link,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  link?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  }[color];

  const content = (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-400"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
