"use client";
import React, { useState, useEffect } from "react";
import type { AdminUser, DepartmentConfig } from "@/types/admin-system";
import { DEPARTMENTS } from "@/data/mockAdminData";

export default function PermissionsPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = () => {
    const users: AdminUser[] = JSON.parse(
      localStorage.getItem("adminUsers") || "[]"
    );
    setAdminUsers(users.filter((u) => u.role !== "super_admin"));
  };

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
  };

  const handleSavePermissions = (updatedUser: AdminUser) => {
    const users = adminUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setAdminUsers(users);
    
    // Also update in full list
    const allUsers: AdminUser[] = JSON.parse(
      localStorage.getItem("adminUsers") || "[]"
    );
    const updatedAll = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("adminUsers", JSON.stringify(updatedAll));
    setSelectedUser(updatedUser);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Permissions & Departments
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Configure granular permissions for each user
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User List */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Select User
          </h2>
          <div className="space-y-2">
            {adminUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selectedUser?.id === user.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user.role} • {user.departments.length} dept{user.departments.length > 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Editor */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <PermissionEditor
              user={selectedUser}
              onSave={handleSavePermissions}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-950">
              <div className="text-center text-gray-500 dark:text-gray-400">
                Select a user to edit their permissions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Department Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Department Information
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {dept.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionEditor({
  user,
  onSave,
}: {
  user: AdminUser;
  onSave: (user: AdminUser) => void;
}) {
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email} • {user.role}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Menu Permissions */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Menu Permissions (Sidebar)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
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
            ].map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
              >
                <input
                  type="checkbox"
                  checked={editedUser.menuPermissions.includes(perm as any)}
                  onChange={(e) => {
                    const permissions = e.target.checked
                      ? [...editedUser.menuPermissions, perm as any]
                      : editedUser.menuPermissions.filter((p) => p !== perm);
                    setEditedUser({ ...editedUser, menuPermissions: permissions });
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
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Action Permissions
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {[
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
            ].map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
              >
                <input
                  type="checkbox"
                  checked={editedUser.actionPermissions.includes(perm as any)}
                  onChange={(e) => {
                    const permissions = e.target.checked
                      ? [...editedUser.actionPermissions, perm as any]
                      : editedUser.actionPermissions.filter((p) => p !== perm);
                    setEditedUser({
                      ...editedUser,
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
      </div>
    </div>
  );
}
