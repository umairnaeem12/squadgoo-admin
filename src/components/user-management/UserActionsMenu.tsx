"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Edit,
  MessageSquare,
  Ban,
  Trash2,
  Clock,
  Power,
  PowerOff,
} from "lucide-react";
import type { AnyUser, UserStatus } from "@/types/user-management";

interface UserActionsMenuProps {
  user: AnyUser;
  onEdit: () => void;
  onChat: () => void;
  onBlock: () => void;
  onSuspend: () => void;
  onDelete: () => void;
  onStatusToggle: () => void;
}

export default function UserActionsMenu({
  user,
  onEdit,
  onChat,
  onBlock,
  onSuspend,
  onDelete,
  onStatusToggle,
}: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-10 py-1">
          <button
            onClick={() => handleAction(onEdit)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Details</span>
          </button>

          <button
            onClick={() => handleAction(onChat)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat with User</span>
          </button>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          {user.status === "active" ? (
            <button
              onClick={() => handleAction(onStatusToggle)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition"
            >
              <PowerOff className="h-4 w-4" />
              <span>Deactivate</span>
            </button>
          ) : (
            <button
              onClick={() => handleAction(onStatusToggle)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition"
            >
              <Power className="h-4 w-4" />
              <span>Activate</span>
            </button>
          )}

          <button
            onClick={() => handleAction(onSuspend)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition"
          >
            <Clock className="h-4 w-4" />
            <span>Suspend User</span>
          </button>

          <button
            onClick={() => handleAction(onBlock)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <Ban className="h-4 w-4" />
            <span>Block User</span>
          </button>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          <button
            onClick={() => handleAction(onDelete)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Account</span>
          </button>
        </div>
      )}
    </div>
  );
}
