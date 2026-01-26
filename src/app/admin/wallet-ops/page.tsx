"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { WalletCase } from "@/types/admin-system";

export default function WalletOperationsPage() {
  const router = useRouter();
  const { isAuthenticated, hasMenuPermission, hasActionPermission, currentAdmin } = useAdminAuth();
  const [cases, setCases] = useState<WalletCase[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!hasMenuPermission("wallet")) {
      // Redirect to appropriate dashboard based on role
      const role = currentAdmin?.role;
      if (role === "super_admin") {
        router.push("/super-admin");
      } else {
        router.push("/admin");
      }
      return;
    }

    loadCases();
  }, [isAuthenticated, router]);

  const loadCases = () => {
    const casesData = localStorage.getItem("walletCases");
    if (casesData) {
      setCases(JSON.parse(casesData));
    }
  };

  const assignToMe = (caseId: string) => {
    if (!hasActionPermission("can_assign_task")) return;

    const updated = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            assignedTo: currentAdmin?.name || "",
            status: "in_review" as const,
            activityLog: [
              ...c.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Assigned",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: `Case assigned to ${currentAdmin?.name}`,
              },
            ],
          }
        : c
    );
    setCases(updated);
    localStorage.setItem("walletCases", JSON.stringify(updated));
  };

  const resolveCase = (caseId: string) => {
    const updated = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            status: "resolved" as const,
            activityLog: [
              ...c.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Resolved",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: "Case marked as resolved",
              },
            ],
          }
        : c
    );
    setCases(updated);
    localStorage.setItem("walletCases", JSON.stringify(updated));
  };

  const filteredCases = cases.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.userName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!isAuthenticated || !hasMenuPermission("wallet")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Wallet Operations
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage wallet transactions, bank verifications, and holds
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Cases</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Issue Type
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assigned To
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCases.map((walletCase) => (
                <tr key={walletCase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {walletCase.userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {walletCase.userRole}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {walletCase.issueType.replace(/_/g, " ")}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${walletCase.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        walletCase.priority === "urgent"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : walletCase.priority === "high"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {walletCase.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        walletCase.status === "resolved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : walletCase.status === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {walletCase.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {walletCase.assignedTo || "Unassigned"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!walletCase.assignedTo && hasActionPermission("can_assign_task") && (
                        <button
                          onClick={() => assignToMe(walletCase.id)}
                          className="rounded bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
                        >
                          Take
                        </button>
                      )}
                      {walletCase.status !== "resolved" && walletCase.assignedTo === currentAdmin?.name && (
                        <button
                          onClick={() => resolveCase(walletCase.id)}
                          className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
