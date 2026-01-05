"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: DeleteUserModalProps) {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === "DELETE") {
      onConfirm();
      setConfirmText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete User Account
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You are about to delete the account of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {userName}
            </span>
          </p>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium mb-2">
              ⏱️ 30-Day Deletion Period
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400/80">
              The user will receive a notification that their account will be deleted in 30 days. They can cancel this action during the grace period.
            </p>
          </div>

          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-400 font-medium mb-1">
              ⚠️ Warning
            </p>
            <ul className="text-xs text-red-700 dark:text-red-400/80 space-y-1 list-disc list-inside">
              <li>All user data will be permanently deleted</li>
              <li>User will be notified to withdraw remaining coins</li>
              <li>This action can be cancelled within 30 days</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmText !== "DELETE"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Deletion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
