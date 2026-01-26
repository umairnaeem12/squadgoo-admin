"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getDashboardStats } from "@/data/mockAdminData";
import type { DashboardStats, WalletCase, KYCCase, Ticket } from "@/types/admin-system";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { currentAdmin, isAuthenticated, logout } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<{
    walletCases: WalletCase[];
    kycCases: KYCCase[];
    tickets: Ticket[];
  }>({ walletCases: [], kycCases: [], tickets: [] });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // SUPER ADMIN ONLY - Redirect others to existing dashboard
    if (currentAdmin?.role !== "super_admin") {
      router.push("/admin");
      return;
    }

    if (currentAdmin) {
      const dashboardStats = getDashboardStats(currentAdmin.id);
      setStats(dashboardStats);

      // Load recent items
      const walletCases: WalletCase[] = JSON.parse(
        localStorage.getItem("walletCases") || "[]"
      );
      const kycCases: KYCCase[] = JSON.parse(
        localStorage.getItem("kycCases") || "[]"
      );
      const tickets: Ticket[] = JSON.parse(
        localStorage.getItem("tickets") || "[]"
      );

      setRecentItems({
        walletCases: walletCases.slice(0, 5),
        kycCases: kycCases.slice(0, 5),
        tickets: tickets.slice(0, 5),
      });
    }
  }, [currentAdmin, isAuthenticated, router]);

  if (!isAuthenticated || !currentAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
            Operations Control Center
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {currentAdmin.name} ({currentAdmin.role})
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Pending Wallet"
            value={stats.pendingWalletCases}
            icon="💰"
            color="blue"
            link="/admin/wallet-ops"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKYCCases}
            icon="📄"
            color="purple"
            link="/admin/kyc-ops"
          />
          <StatCard
            title="Open Tickets"
            value={stats.openTickets}
            icon="🎫"
            color="green"
            link="/admin/tickets"
          />
          <StatCard
            title="Assigned to Me"
            value={stats.assignedToMe}
            icon="👤"
            color="orange"
          />
          <StatCard
            title="Urgent Items"
            value={stats.urgentItems}
            icon="🚨"
            color="red"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="indigo"
            link="/admin/users"
          />
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          title="Admin Management"
          description="Manage admin users, roles & permissions"
          icon="👥"
          link="/admin/admin-management"
          color="purple"
        />
        <QuickLinkCard
          title="Wallet Operations"
          description="Manage transactions & bank verifications"
          icon="💳"
          link="/admin/wallet-ops"
          color="blue"
        />
        <QuickLinkCard
          title="KYC Operations"
          description="Review identity documents"
          icon="🔍"
          link="/admin/kyc-ops"
          color="purple"
        />
        <QuickLinkCard
          title="Tickets & Support"
          description="Handle user tickets & reports"
          icon="🎫"
          link="/admin/tickets"
          color="green"
        />
        <QuickLinkCard
          title="User Management"
          description="View jobseekers & recruiters"
          icon="👥"
          link="/admin/users"
          color="indigo"
        />
      </div>

      {/* Recent Activity Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Wallet Cases */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Wallet Cases
            </h2>
            <Link
              href="/admin/wallet-ops"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentItems.walletCases.length > 0 ? (
              recentItems.walletCases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.userName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.issueType.replace(/_/g, " ")} - ${item.amount}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.priority === "urgent"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : item.priority === "high"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                No recent wallet cases
              </p>
            )}
          </div>
        </div>

        {/* Recent KYC Cases */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent KYC Cases
            </h2>
            <Link
              href="/admin/kyc-ops"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentItems.kycCases.length > 0 ? (
              recentItems.kycCases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.userName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.status.replace(/_/g, " ")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "pending_review"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                No recent KYC cases
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Tickets
          </h2>
          <Link
            href="/admin/tickets"
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr className="text-left">
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ticket #
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reporter
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentItems.tickets.length > 0 ? (
                recentItems.tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {ticket.id}
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                      {ticket.reporterName}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {ticket.subject}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          ticket.priority === "urgent"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : ticket.priority === "high"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No recent tickets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
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
  const content = (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${
        link ? "cursor-pointer transition-all hover:shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

// Quick Link Card Component
function QuickLinkCard({
  title,
  description,
  icon,
  link,
  color,
}: {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}) {
  return (
    <Link href={link}>
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-4 text-sm font-medium text-brand-500 group-hover:text-brand-600">
          Open →
        </div>
      </div>
    </Link>
  );
}
