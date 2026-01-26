"use client";
import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { AdminUser, AdminRole, Department, MenuPermission, ActionPermission, AuditLogEntry } from "@/types/admin-system";

export default function AdminManagementPage() {
  const { currentAdmin } = useAdminAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = () => {
    const users: AdminUser[] = JSON.parse(
      localStorage.getItem("adminUsers") || "[]"
    );
    setAdminUsers(users);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setShowCreateModal(true);
  };

  const handleToggleStatus = (userId: string) => {
    const users = [...adminUsers];
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isActive = !users[userIndex].isActive;
      setAdminUsers(users);
      localStorage.setItem("adminUsers", JSON.stringify(users));

      // Add audit log
      addAuditLog({
        action: `${users[userIndex].isActive ? "Enabled" : "Disabled"} user`,
        category: "user",
        performedBy: currentAdmin!.id,
        performedByName: currentAdmin!.name,
        details: `User ${users[userIndex].name} (${users[userIndex].email}) was ${users[userIndex].isActive ? "enabled" : "disabled"}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSave = (user: AdminUser) => {
    const users = [...adminUsers];
    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex !== -1) {
      // Update existing
      users[existingIndex] = user;
      addAuditLog({
        action: "Updated user",
        category: "user",
        performedBy: currentAdmin!.id,
        performedByName: currentAdmin!.name,
        details: `Updated user ${user.name} (${user.email})`,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Create new
      users.push(user);
      addAuditLog({
        action: "Created user",
        category: "user",
        performedBy: currentAdmin!.id,
        performedByName: currentAdmin!.name,
        details: `Created new ${user.role} user: ${user.name} (${user.email})`,
        timestamp: new Date().toISOString(),
      });
    }

    localStorage.setItem("adminUsers", JSON.stringify(users));
    setAdminUsers(users);
    setShowCreateModal(false);
  };

  const addAuditLog = (log: Omit<AuditLogEntry, "id">) => {
    const logs: AuditLogEntry[] = JSON.parse(
      localStorage.getItem("auditLogs") || "[]"
    );
    const newLog: AuditLogEntry = {
      ...log,
      id: `log-${Date.now()}`,
    };
    logs.unshift(newLog);
    localStorage.setItem("auditLogs", JSON.stringify(logs));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage admin users, roles, and permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600"
        >
          ➕ Create New User
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Departments
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {adminUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.departments.length} dept{user.departments.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="text-sm text-orange-600 hover:underline dark:text-orange-400"
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <UserFormModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setShowCreateModal(false)}
          currentAdminId={currentAdmin!.id}
        />
      )}
    </div>
  );
}

function UserFormModal({
  user,
  onSave,
  onClose,
  currentAdminId,
}: {
  user: AdminUser | null;
  onSave: (user: AdminUser) => void;
  onClose: () => void;
  currentAdminId: string;
}) {
  const [formData, setFormData] = useState<AdminUser>(
    user || {
      id: `admin-${Date.now()}`,
      name: "",
      email: "",
      password: "",
      role: "staff",
      departments: [],
      menuPermissions: [],
      actionPermissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: currentAdminId,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const allMenuPermissions: MenuPermission[] = [
    "dashboard",
    "wallet",
    "kyc",
    "jobseekers",
    "recruiters",
    "tickets",
    "reports",
    "chat_reports",
    "internal_chat",
    "profile_viewer",
  ];

  const allActionPermissions: ActionPermission[] = [
    "can_assign_task",
    "can_transfer_task",
    "can_resolve_ticket",
    "can_view_user_chats",
    "can_moderate_chat_reports",
    "can_approve_kyc",
    "can_reject_kyc",
    "can_verify_bank",
    "can_approve_wallet_transaction",
    "can_hold_wallet_transaction",
    "can_suspend_user",
    "can_add_internal_notes",
    "can_edit_profile_documents",
    "can_add_badge",
  ];

  const allDepartments: Department[] = [
    "wallet",
    "kyc",
    "customer_service",
    "reports_moderation",
    "verification",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {user ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {!user && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as AdminRole })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          {/* Departments */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Departments
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {allDepartments.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={formData.departments.includes(dept)}
                    onChange={(e) => {
                      const departments = e.target.checked
                        ? [...formData.departments, dept]
                        : formData.departments.filter((d) => d !== dept);
                      setFormData({ ...formData, departments });
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {dept.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Menu Permissions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Menu Permissions (Sidebar Visibility)
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {allMenuPermissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={formData.menuPermissions.includes(perm)}
                    onChange={(e) => {
                      const permissions = e.target.checked
                        ? [...formData.menuPermissions, perm]
                        : formData.menuPermissions.filter((p) => p !== perm);
                      setFormData({ ...formData, menuPermissions: permissions });
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {perm.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Permissions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action Permissions
            </label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {allActionPermissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={formData.actionPermissions.includes(perm)}
                    onChange={(e) => {
                      const permissions = e.target.checked
                        ? [...formData.actionPermissions, perm]
                        : formData.actionPermissions.filter((p) => p !== perm);
                      setFormData({
                        ...formData,
                        actionPermissions: permissions,
                      });
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {perm.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600"
            >
              {user ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
