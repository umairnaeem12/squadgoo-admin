"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import UserFiltersBar from "@/components/user-management/UserFiltersBar";
import UserActionsMenu from "@/components/user-management/UserActionsMenu";
import UserStatusBadge from "@/components/user-management/UserStatusBadge";
import SuspendUserModal from "@/components/user-management/SuspendUserModal";
import DeleteUserModal from "@/components/user-management/DeleteUserModal";
import Pagination from "@/components/tables/Pagination";
import Toast from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import type { UserFilters } from "@/types/user-management";

interface SquadGroup {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  leaderId: string;
  membersCount: number;
  status: "active" | "inactive" | "suspended" | "pending-deletion";
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  category: string;
  appliedJobs: number;
}

const SquadAccountsPage = () => {
  const router = useRouter();
  const [squads, setSquads] = useState<SquadGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "all",
    role: "all",
    kycStatus: "all",
    dateFrom: "",
    dateTo: "",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  const [selectedSquad, setSelectedSquad] = useState<SquadGroup | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { toasts, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchSquads();
  }, [filters]);

  const fetchSquads = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`/api/users/squads?${params}`);
    const data = await response.json();
    if (data.success) {
      setSquads(data.data);
    }
    setLoading(false);
  };

  const handleStatusToggle = async (squad: SquadGroup) => {
    const newStatus = squad.status === "active" ? "inactive" : "active";
    
    try {
      const response = await fetch("/api/users/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: squad.id, status: newStatus }),
      });

      if (response.ok) {
        setSquads((prev) =>
          prev.map((s) =>
            s.id === squad.id ? { ...s, status: newStatus } : s
          )
        );
        showToast(`Squad ${newStatus === "active" ? "activated" : "deactivated"} successfully`, "success");
      }
    } catch (error) {
      showToast("Failed to update squad status", "error");
    }
  };

  const handleSuspend = (squad: SquadGroup) => {
    setSelectedSquad(squad);
    setIsSuspendModalOpen(true);
  };

  const handleDelete = (squad: SquadGroup) => {
    setSelectedSquad(squad);
    setIsDeleteModalOpen(true);
  };

  const navigateToProfile = (squad: SquadGroup) => {
    router.push(`/admin/profile/squad/${squad.id}`);
  };

  const handleBlock = async (squad: SquadGroup) => {
    try {
      const response = await fetch("/api/users/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: squad.id,
          reason: "Admin blocked this squad",
        }),
      });

      if (response.ok) {
        setSquads((prev) =>
          prev.map((s) =>
            s.id === squad.id ? { ...s, status: "inactive" } : s
          )
        );
        showToast("Squad blocked successfully. Leader notified to withdraw coins.", "warning");
      }
    } catch (error) {
      showToast("Failed to block squad", "error");
    }
  };

  const handleChat = (squad: SquadGroup) => {
    router.push(`/chat?userId=${squad.id}&userName=${encodeURIComponent(squad.name)}`);
  };

  const handleConfirmSuspend = async (data: {
    reason: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      const response = await fetch("/api/users/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedSquad?.id, ...data }),
      });

      if (response.ok) {
        setSquads((prev) =>
          prev.map((s) =>
            s.id === selectedSquad?.id ? { ...s, status: "suspended" } : s
          )
        );
        showToast(`Squad suspended from ${data.startDate} to ${data.endDate}`, "warning");
        setIsSuspendModalOpen(false);
      }
    } catch (error) {
      showToast("Failed to suspend squad", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedSquad?.id }),
      });

      if (response.ok) {
        setSquads((prev) =>
          prev.map((s) =>
            s.id === selectedSquad?.id ? { ...s, status: "pending-deletion" } : s
          )
        );
        showToast("Squad deletion scheduled. Will be deleted in 30 days.", "warning");
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      showToast("Failed to schedule deletion", "error");
    }
  };

  const stats = [
    {
      title: "Total Squads",
      value: squads.length.toString(),
      color: "text-purple-600",
    },
    {
      title: "Active Squads",
      value: squads.filter((s) => s.status === "active").length.toString(),
      color: "text-green-600",
    },
    {
      title: "Total Members",
      value: squads.reduce((acc, s) => acc + s.membersCount, 0).toString(),
      color: "text-blue-600",
    },
    {
      title: "Applications",
      value: squads.reduce((acc, s) => acc + s.appliedJobs, 0).toString(),
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Squad Accounts Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all squad groups and team accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.title}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <ComponentCard
        title="Squad Accounts"
        desc="View and manage all squad groups"
      >
        <UserFiltersBar filters={filters} onFiltersChange={setFilters} />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Squad Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Applied Jobs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {squads.map((squad) => (
                  <tr
                    key={squad.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => navigateToProfile(squad)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {squad.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {squad.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {squad.leaderName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {squad.leaderEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {squad.membersCount}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {squad.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {squad.appliedJobs}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(squad.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <UserStatusBadge status={squad.status} />
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <UserActionsMenu
                        user={squad as any}
                        onViewProfile={() => navigateToProfile(squad)}
                        onChat={() => handleChat(squad)}
                        onStatusToggle={() => handleStatusToggle(squad)}
                        onSuspend={() => handleSuspend(squad)}
                        onBlock={() => handleBlock(squad)}
                        onDelete={() => handleDelete(squad)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>

      {/* Suspend Modal */}
      {isSuspendModalOpen && selectedSquad && (
        <SuspendUserModal
          userName={selectedSquad.name}
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={handleConfirmSuspend}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedSquad && (
        <DeleteUserModal
          userName={selectedSquad.name}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default SquadAccountsPage;
