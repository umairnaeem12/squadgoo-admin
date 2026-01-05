"use client";

import { useState } from "react";
import { Search, Filter, X, Calendar, SlidersHorizontal } from "lucide-react";
import type { UserFilters, UserStatus, SortDirection, SortField } from "@/types/user-management";

interface UserFiltersBarProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  showRoleFilter?: boolean;
  showVerifiedFilter?: boolean;
}

export default function UserFiltersBar({
  filters,
  onFiltersChange,
  showRoleFilter = false,
  showVerifiedFilter = false,
}: UserFiltersBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      role: "all",
      kycStatus: "all",
      dateFrom: "",
      dateTo: "",
      sortField: "createdAt",
      sortDirection: "desc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.role !== "all" ||
    filters.kycStatus !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            showAdvanced || hasActiveFilters
              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value as UserStatus | "all")}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending-deletion">Pending Deletion</option>
              </select>
            </div>

            {/* KYC Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                KYC Status
              </label>
              <select
                value={filters.kycStatus}
                onChange={(e) => handleFilterChange("kycStatus", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All KYC</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                From Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                To Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sort Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sortField}
                onChange={(e) => handleFilterChange("sortField", e.target.value as SortField)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="createdAt">Join Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Sort Direction */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Order
              </label>
              <select
                value={filters.sortDirection}
                onChange={(e) => handleFilterChange("sortDirection", e.target.value as SortDirection)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
