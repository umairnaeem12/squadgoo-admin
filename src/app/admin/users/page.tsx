"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { UserProfile } from "@/types/admin-system";

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, hasMenuPermission } = useAdminAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"jobseekers" | "recruiters">("jobseekers");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    loadUsers();
  }, [isAuthenticated, router]);

  const loadUsers = () => {
    const usersData = localStorage.getItem("userProfiles");
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  };

  const filteredUsers = users.filter((u) => {
    if (u.role !== activeTab.slice(0, -1)) return false; // Remove 's' from tab name
    if (issueFilter === "issues_only" && !u.hasIssues) return false;
    if (issueFilter === "no_issues" && u.hasIssues) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.id.includes(search)) return false;
    return true;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          View and manage jobseekers and recruiters
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("jobseekers")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "jobseekers"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Jobseekers
        </button>
        <button
          onClick={() => setActiveTab("recruiters")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "recruiters"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Recruiters
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
          className="h-11 rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Users</option>
          <option value="issues_only">With Issues Only</option>
          <option value="no_issues">No Issues</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Problem / Issue
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  KYC Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Account Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Wallet Balance
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                    {user.id}
                  </td>
                  <td className="p-4">
                    {user.hasIssues ? (
                      <div className="flex flex-wrap gap-1">
                        {user.issueTypes.map((issue, idx) => (
                          <span
                            key={idx}
                            className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No issues
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.kycStatus === "verified"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : user.kycStatus === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {user.kycStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : user.status === "suspended"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${user.walletBalance.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => router.push(`/admin/profile/${user.id}`)}
                      className="rounded bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total {activeTab}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter((u) => u.role === activeTab.slice(0, -1)).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">With Issues</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {users.filter((u) => u.role === activeTab.slice(0, -1) && u.hasIssues).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter((u) => u.role === activeTab.slice(0, -1) && u.kycStatus === "verified").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {users.filter((u) => u.role === activeTab.slice(0, -1) && u.status === "suspended").length}
          </p>
        </div>
      </div>
    </div>
  );
}
