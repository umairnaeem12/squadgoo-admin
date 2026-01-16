"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import UserFiltersBar from "@/components/user-management/UserFiltersBar";
import UserActionsMenu from "@/components/user-management/UserActionsMenu";
import UserStatusBadge from "@/components/user-management/UserStatusBadge";
import SuspendUserModal from "@/components/user-management/SuspendUserModal";
import DeleteUserModal from "@/components/user-management/DeleteUserModal";
import Pagination from "@/components/tables/Pagination";
import Toast from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import { UserCircle, Mail, Phone, Calendar, MapPin, CheckCircle2, Clock, XCircle, Briefcase, Wallet, BadgeCheck } from "lucide-react";
import type { Individual, UserFilters, UserStatus } from "@/types/user-management";

export default function IndividualsPage() {
  const router = useRouter();
  const { toasts, showToast, hideToast } = useToast();
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [selectedUser, setSelectedUser] = useState<Individual | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "all",
    role: "individual",
    kycStatus: "all",
    dateFrom: "",
    dateTo: "",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  useEffect(() => {
    fetchIndividuals();
  }, [filters]);

  const fetchIndividuals = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        kycStatus: filters.kycStatus,
        sortField: filters.sortField,
        sortDirection: filters.sortDirection,
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const response = await fetch(`/api/users/individuals?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setIndividuals(data.data);
      }
    } catch (error) {
      console.error("Error fetching individuals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: Individual) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const response = await fetch("/api/users/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setIndividuals(prev => prev.map(ind => 
          ind.id === user.id ? { ...ind, status: newStatus } : ind
        ));
        showToast(`Individual ${newStatus === "active" ? "activated" : "deactivated"} successfully`, "success");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  const handleSuspend = (user: Individual) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = async (data: { reason: string; startDate: string; endDate: string }) => {
    try {
      const response = await fetch("/api/users/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser?.id,
          ...data,
          notifyUser: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIndividuals(prev => prev.map(ind => 
          ind.id === selectedUser?.id ? { ...ind, status: "suspended" } : ind
        ));
        setShowSuspendModal(false);
        showToast("Individual suspended successfully. User has been notified.", "success");
      }
    } catch (error) {
      console.error("Error suspending individual:", error);
      showToast("Failed to suspend individual", "error");
    }
  };

  const handleBlock = async (user: Individual) => {
    if (confirm(`Block ${user.firstName} ${user.lastName}? They will be notified to withdraw their coins.`)) {
      try {
        const response = await fetch("/api/users/block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (data.success) {
          setIndividuals(prev => prev.map(ind => 
            ind.id === user.id ? { ...ind, status: "inactive" } : ind
          ));
          showToast("Individual blocked successfully. Notification sent to withdraw coins.", "success");
        }
      } catch (error) {
        console.error("Error blocking individual:", error);
        showToast("Failed to block individual", "error");
      }
    }
  };

  const handleDelete = (user: Individual) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const navigateToProfile = (user: Individual) => {
    router.push(`/admin/profile/individual/${user.id}`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser?.id,
          notifyUser: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIndividuals(prev => prev.map(ind => 
          ind.id === selectedUser?.id ? { ...ind, status: "pending-deletion" } : ind
        ));
        setShowDeleteModal(false);
        showToast("Individual deletion scheduled for 30 days. User has been notified.", "warning");
      }
    } catch (error) {
      console.error("Error deleting individual:", error);
      showToast("Failed to schedule deletion", "error");
    }
  };

  const handleChat = (user: Individual) => {
    const name = `${user.firstName} ${user.lastName}`;
    router.push(`/chat?userId=${user.id}&userName=${encodeURIComponent(name)}`);
  };

  const handleUpdateUser = (updated: Individual) => {
    setIndividuals(prev => prev.map(ind => ind.id === updated.id ? updated : ind));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
        return <CheckCircle2 className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <XCircle className="w-3 h-3" />;
    }
  };

  // Filter and paginate individuals
  const filteredIndividuals = individuals.filter((ind) => {
    const matchesSearch =
      !filters.search ||
      `${ind.firstName} ${ind.lastName} ${ind.email}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === "all" || ind.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIndividuals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIndividuals.length / itemsPerPage);

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-green-600" />
            Individuals Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage individual users who use SquadGoo to find contractors
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {filteredIndividuals.length} individuals
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total Individuals</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{filteredIndividuals.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">KYC Verified</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {filteredIndividuals.filter(ind => ind.kycStatus === "verified").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Active Users</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {filteredIndividuals.filter(ind => ind.status === "active").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <UserFiltersBar filters={filters} onFiltersChange={setFilters} showVerifiedFilter />

      {/* Individuals Table */}
      <ComponentCard title="All Individuals" desc="Complete list of individual accounts">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Individual</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Total Gigs</th>
                <th className="px-6 py-4 font-semibold">Wallet (SG)</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">KYC Status</th>
                <th className="px-6 py-4 font-semibold">Verified</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Loading individuals...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No individuals found
                  </td>
                </tr>
              ) : (
                currentItems.map((ind) => (
                  <tr
                    key={ind.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => navigateToProfile(ind)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-50 dark:bg-green-500/10 p-2 rounded-lg">
                          <UserCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {ind.firstName} {ind.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{ind.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{ind.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{ind.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{ind.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Briefcase className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">{ind.totalGigs}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Wallet className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">${ind.walletBalance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{formatDate(ind.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          ind.kycStatus === "verified"
                            ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                            : ind.kycStatus === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {getStatusIcon(ind.kycStatus)}
                        {ind.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ind.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge status={ind.status} />
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <UserActionsMenu
                        user={ind}
                        onViewProfile={() => navigateToProfile(ind)}
                        onChat={() => handleChat(ind)}
                        onBlock={() => handleBlock(ind)}
                        onSuspend={() => handleSuspend(ind)}
                        onDelete={() => handleDelete(ind)}
                        onStatusToggle={() => handleToggleStatus(ind)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </ComponentCard>
      {/* Modals */}
      {showSuspendModal && selectedUser && (
        <SuspendUserModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={handleConfirmSuspend}
          userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
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
}
