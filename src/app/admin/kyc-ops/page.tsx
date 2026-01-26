"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { KYCCase } from "@/types/admin-system";

export default function KYCOperationsPage() {
  const router = useRouter();
  const { isAuthenticated, hasMenuPermission, hasActionPermission, currentAdmin } = useAdminAuth();
  const [cases, setCases] = useState<KYCCase[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!hasMenuPermission("kyc")) {
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
    const casesData = localStorage.getItem("kycCases");
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
    localStorage.setItem("kycCases", JSON.stringify(updated));
  };

  const approveKYC = (caseId: string) => {
    if (!hasActionPermission("can_approve_kyc")) return;

    const updated = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            status: "verified" as const,
            activityLog: [
              ...c.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Approved",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: "KYC verification approved",
              },
            ],
          }
        : c
    );
    setCases(updated);
    localStorage.setItem("kycCases", JSON.stringify(updated));
  };

  const rejectKYC = (caseId: string) => {
    if (!hasActionPermission("can_reject_kyc")) return;

    const updated = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            status: "rejected" as const,
            activityLog: [
              ...c.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Rejected",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: "KYC verification rejected",
              },
            ],
          }
        : c
    );
    setCases(updated);
    localStorage.setItem("kycCases", JSON.stringify(updated));
  };

  const filteredCases = cases.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.userName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!isAuthenticated || !hasMenuPermission("kyc")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          KYC Operations
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Review and verify user identity documents
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
          <option value="pending_review">Pending Review</option>
          <option value="resubmitted">Resubmitted</option>
          <option value="rejected">Rejected</option>
          <option value="verified">Verified</option>
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
                  Documents
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
              {filteredCases.map((kycCase) => (
                <tr key={kycCase.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {kycCase.userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {kycCase.userRole}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {kycCase.issueType ? kycCase.issueType.replace(/_/g, " ") : "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {kycCase.documents.length} doc(s)
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        kycCase.status === "verified"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : kycCase.status === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {kycCase.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {kycCase.assignedTo || "Unassigned"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!kycCase.assignedTo && hasActionPermission("can_assign_task") && (
                        <button
                          onClick={() => assignToMe(kycCase.id)}
                          className="rounded bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
                        >
                          Take
                        </button>
                      )}
                      {kycCase.status === "pending_review" && kycCase.assignedTo === currentAdmin?.name && (
                        <>
                          {hasActionPermission("can_approve_kyc") && (
                            <button
                              onClick={() => approveKYC(kycCase.id)}
                              className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                            >
                              Approve
                            </button>
                          )}
                          {hasActionPermission("can_reject_kyc") && (
                            <button
                              onClick={() => rejectKYC(kycCase.id)}
                              className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                            >
                              Reject
                            </button>
                          )}
                        </>
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
