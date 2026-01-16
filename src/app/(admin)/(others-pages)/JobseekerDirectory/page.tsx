"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import UserFiltersBar from "@/components/user-management/UserFiltersBar";
import UserActionsMenu from "@/components/user-management/UserActionsMenu";
import UserStatusBadge from "@/components/user-management/UserStatusBadge";
import StatusReasonModal from "@/components/user-management/StatusReasonModal";
import DeleteUserModal from "@/components/user-management/DeleteUserModal";
import Pagination from "@/components/tables/Pagination";
import Toast from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import { User, Mail, Briefcase, Calendar, MapPin, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { JobSeeker, UserFilters, UserStatus } from "@/types/user-management";

export default function JobseekerDirectory() {
  const router = useRouter();
  const { toasts, showToast, hideToast } = useToast();
  const [jobseekers, setJobseekers] = useState<JobSeeker[]>([]);
  const [selectedUser, setSelectedUser] = useState<JobSeeker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 10-14 users per page
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    user: JobSeeker | null;
    action: "activate" | "deactivate" | "unsuspend" | "suspend";
  } | null>(null);

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "all",
    role: "jobseeker",
    kycStatus: "all",
    dateFrom: "",
    dateTo: "",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  useEffect(() => {
    fetchJobseekers();
  }, [filters]);

  const fetchJobseekers = async () => {
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

      const response = await fetch(`/api/users/jobseekers?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const withNotes = (data.data as JobSeeker[]).map((js) => ({
          ...js,
          staffNotes: js.staffNotes ?? [],
        }));
        setJobseekers(withNotes);
      }
    } catch (error) {
      console.error("Error fetching jobseekers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (user: JobSeeker) => {
    const action =
      user.status === "active"
        ? "deactivate"
        : user.status === "suspended"
        ? "unsuspend"
        : "activate";
    setSelectedUser(user);
    setStatusModal({ user, action });
  };

  const handleSuspend = (user: JobSeeker) => {
    setSelectedUser(user);
    setStatusModal({ user, action: "suspend" });
  };

  const handleBlock = async (user: JobSeeker) => {
    if (confirm(`Block ${user.firstName} ${user.lastName}? They will be notified to withdraw their coins.`)) {
      try {
        const response = await fetch("/api/users/block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (data.success) {
          // Update local state to reflect the new status
          setJobseekers(prev => prev.map(js => 
            js.id === user.id ? { ...js, status: "inactive" } : js
          ));
          showToast("User blocked successfully. Notification sent to withdraw coins.", "success");
        }
      } catch (error) {
        console.error("Error blocking user:", error);
        showToast("Failed to block user", "error");
      }
    }
  };

  const handleDelete = (user: JobSeeker) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const navigateToProfile = (user: JobSeeker) => {
    router.push(`/admin/profile/jobseeker/${user.id}`);
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
        // Update local state to reflect the new status
        setJobseekers(prev => prev.map(js => 
          js.id === selectedUser?.id ? { ...js, status: "pending-deletion" } : js
        ));
        setShowDeleteModal(false);
        showToast("User deletion scheduled for 30 days. User has been notified.", "warning");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Failed to schedule deletion", "error");
    }
  };

  const handleChat = (user: JobSeeker) => {
    // Redirect to chat section instead of opening modal
    router.push(`/chat?userId=${user.id}&userName=${user.firstName}%20${user.lastName}`);
  };

  const applyStatusChange = (reason: string) => {
    if (!statusModal?.user) return;
    const user = statusModal.user;
    const action = statusModal.action;
    const nextStatus: UserStatus =
      action === "deactivate"
        ? "inactive"
        : action === "suspend"
        ? "suspended"
        : "active";
    const note = {
      id: `note-${Date.now()}`,
      action: `${action} user`,
      reason,
      staffId: "staff-admin",
      staffName: "Super Admin",
      timestamp: new Date().toISOString(),
    };
    setJobseekers((prev) =>
      prev.map((js) =>
        js.id === user.id
          ? {
              ...js,
              status: nextStatus,
              staffNotes: [note, ...(js.staffNotes ?? [])],
            }
          : js
      )
    );
    showToast(
      `User ${
        action === "deactivate"
          ? "deactivated"
          : action === "suspend"
          ? "suspended"
          : "activated"
      } successfully`,
      action === "deactivate" || action === "suspend" ? "warning" : "success"
    );
    setStatusModal(null);
    setSelectedUser(null);
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

  const tabs = [
    { key: "basic", label: "Basic Details" },
    { key: "experience", label: "Experience" },
    { key: "preferences", label: "Preferences" },
    { key: "education", label: "Education" },
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobseekers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobseekers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Job Seekers Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all job seeker accounts
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {jobseekers.length} job seekers | Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Filters */}
      <UserFiltersBar filters={filters} onFiltersChange={setFilters} />

      {/* Job Seekers Table */}
      <ComponentCard title="All Job Seekers" desc="Complete list of registered job seekers">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Job Seeker</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role & Experience</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">KYC</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Loading job seekers...
                  </td>
                </tr>
              ) : jobseekers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No job seekers found
                  </td>
                </tr>
              ) : (
                currentItems.map((js) => (
                  <tr
                    key={js.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => navigateToProfile(js)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {js.firstName} {js.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{js.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{js.email}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{js.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{js.jobTitle}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3" />
                          {js.experience}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{js.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{formatDate(js.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge status={js.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          js.kycStatus === "verified"
                            ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                            : js.kycStatus === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {getStatusIcon(js.kycStatus)}
                        {js.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <UserActionsMenu
                        user={js}
                        onViewProfile={() => navigateToProfile(js)}
                        onChat={() => handleChat(js)}
                        onBlock={() => handleBlock(js)}
                        onSuspend={() => handleSuspend(js)}
                        onDelete={() => handleDelete(js)}
                        onStatusToggle={() => handleToggleStatus(js)}
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
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ComponentCard>

      {/* Modals */}
      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
        />
      )}

      <StatusReasonModal
        isOpen={!!statusModal}
        title={
          statusModal?.action === "deactivate"
            ? "Deactivate user"
            : statusModal?.action === "suspend"
            ? "Suspend user"
            : "Activate user"
        }
        actionLabel={
          statusModal?.action === "deactivate"
            ? "Deactivate"
            : statusModal?.action === "suspend"
            ? "Suspend"
            : "Activate"
        }
        onConfirm={applyStatusChange}
        onClose={() => setStatusModal(null)}
      />

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
