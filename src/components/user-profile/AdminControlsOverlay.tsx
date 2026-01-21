"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  X,
  Tag,
  AlertCircle,
  Clock,
  User,
  Lock,
  Unlock,
  Ban,
  Trash2,
  Power,
} from "lucide-react";
import { StaffNote, BadgeEntry, StatusAction, AccountStatus } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Input from "@/components/form/input/InputField";

interface AdminControlsOverlayProps {
  currentStatus: AccountStatus;
  badges: BadgeEntry[];
  staffNotes: StaffNote[];
  onAddNote?: (content: string, category: StaffNote["category"], isPrivate: boolean) => void;
  onAddBadge?: (label: string, reason: string) => void;
  onRemoveBadge?: (badgeId: string, reason: string) => void;
  onStatusAction?: (action: StatusAction["action"], reason: string) => void;
}

const noteCategories: Array<{ value: StaffNote["category"]; label: string }> = [
  { value: "wallet", label: "Wallet" },
  { value: "kyc", label: "KYC" },
  { value: "behavior", label: "Behavior" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
];

const CategoryBadge = ({ category }: { category: StaffNote["category"] }) => {
  const colors = {
    wallet: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    kyc: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    behavior: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    technical: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[category]}`}>
      {category}
    </span>
  );
};

export default function AdminControlsOverlay({
  currentStatus,
  badges,
  staffNotes,
  onAddNote,
  onAddBadge,
  onRemoveBadge,
  onStatusAction,
}: AdminControlsOverlayProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<StaffNote["category"]>("other");
  const [noteIsPrivate, setNoteIsPrivate] = useState(false);

  const [showAddBadge, setShowAddBadge] = useState(false);
  const [badgeLabel, setBadgeLabel] = useState("");
  const [badgeReason, setBadgeReason] = useState("");

  const [showRemoveBadge, setShowRemoveBadge] = useState<string | null>(null);
  const [removeBadgeReason, setRemoveBadgeReason] = useState("");

  const [showStatusAction, setShowStatusAction] = useState<StatusAction["action"] | null>(null);
  const [statusReason, setStatusReason] = useState("");

  const handleAddNote = () => {
    if (noteContent.trim() && onAddNote) {
      onAddNote(noteContent, noteCategory, noteIsPrivate);
      setNoteContent("");
      setNoteCategory("other");
      setNoteIsPrivate(false);
      setShowAddNote(false);
    }
  };

  const handleAddBadge = () => {
    if (badgeLabel.trim() && badgeReason.trim() && onAddBadge) {
      onAddBadge(badgeLabel, badgeReason);
      setBadgeLabel("");
      setBadgeReason("");
      setShowAddBadge(false);
    }
  };

  const handleRemoveBadge = (badgeId: string) => {
    if (removeBadgeReason.trim() && onRemoveBadge) {
      onRemoveBadge(badgeId, removeBadgeReason);
      setShowRemoveBadge(null);
      setRemoveBadgeReason("");
    }
  };

  const handleStatusAction = () => {
    if (showStatusAction && statusReason.trim() && onStatusAction) {
      onStatusAction(showStatusAction, statusReason);
      setShowStatusAction(null);
      setStatusReason("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusActions = (): Array<{ action: StatusAction["action"]; label: string; icon: React.ReactNode; color: string }> => {
    const actions = [];

    if (currentStatus === "active") {
      actions.push(
        { action: "suspend" as const, label: "Suspend User", icon: <AlertCircle className="h-4 w-4" />, color: "bg-orange-600 hover:bg-orange-700" },
        { action: "block" as const, label: "Block User", icon: <Ban className="h-4 w-4" />, color: "bg-red-600 hover:bg-red-700" }
      );
    }

    if (currentStatus === "suspended") {
      actions.push({ action: "unsuspend" as const, label: "Unsuspend User", icon: <Unlock className="h-4 w-4" />, color: "bg-green-600 hover:bg-green-700" });
    }

    if (currentStatus === "blocked") {
      actions.push({ action: "unblock" as const, label: "Unblock User", icon: <Unlock className="h-4 w-4" />, color: "bg-green-600 hover:bg-green-700" });
    }

    if (currentStatus === "inactive") {
      actions.push({ action: "activate" as const, label: "Activate User", icon: <Power className="h-4 w-4" />, color: "bg-green-600 hover:bg-green-700" });
    }

    actions.push({ action: "delete" as const, label: "Delete Account", icon: <Trash2 className="h-4 w-4" />, color: "bg-red-600 hover:bg-red-700" });

    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Staff Notes Section */}
      <div className="rounded-xl bg-white p-6 shadow transition-all duration-300 dark:bg-gray-800" data-notes-section>
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Internal Staff Notes</h3>
          </div>
          <Button onClick={() => setShowAddNote(true)} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-1 h-4 w-4" />
            Add Note
          </Button>
        </div>

        {staffNotes.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">No internal notes yet</p>
        ) : (
          <div className="space-y-3">
            {staffNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={note.category} />
                    {note.isPrivate && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <Lock className="h-3 w-3" />
                        Private
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(note.createdAt)}</span>
                </div>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <User className="h-3 w-3" />
                  <span>{note.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Badges</h3>
          </div>
          <Button onClick={() => setShowAddBadge(true)} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-1 h-4 w-4" />
            Add Badge
          </Button>
        </div>

        {badges.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">No badges assigned</p>
        ) : (
          <div className="space-y-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-purple-600 dark:text-purple-400">{badge.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Added by {badge.addedBy} on {formatDate(badge.addedAt)}
                  </p>
                  <p className="mt-1 text-xs italic text-gray-600 dark:text-gray-400">"{badge.reason}"</p>
                </div>
                <Button
                  onClick={() => setShowRemoveBadge(badge.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Actions Section */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 border-b border-gray-200 pb-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Status Actions</h3>
          </div>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Current status: <span className="font-medium">{currentStatus}</span>
          </p>
        </div>

        <div className="space-y-3">
          {getStatusActions().map((action) => (
            <Button
              key={action.action}
              onClick={() => setShowStatusAction(action.action)}
              className={`w-full justify-start ${action.color}`}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Add Internal Note</h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">Category</Label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as StaffNote["category"])}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  {noteCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="mb-2">Note Content (required)</Label>
                <TextArea
                  value={noteContent}
                  onChange={(value) => setNoteContent(value)}
                  placeholder="Enter internal note..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notePrivate"
                  checked={noteIsPrivate}
                  onChange={(e) => setNoteIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600"
                />
                <Label htmlFor="notePrivate" className="cursor-pointer">
                  Mark as private (restricted access)
                </Label>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={handleAddNote} disabled={!noteContent.trim()} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
              <Button onClick={() => setShowAddNote(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Badge Modal */}
      {showAddBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Add Badge</h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">Badge Label (required)</Label>
                <Input
                  value={badgeLabel}
                  onChange={(e) => setBadgeLabel(e.target.value)}
                  placeholder="e.g., Top Performer, Verified Expert"
                />
              </div>

              <div>
                <Label className="mb-2">Reason (required)</Label>
                <TextArea
                  value={badgeReason}
                  onChange={(value) => setBadgeReason(value)}
                  placeholder="Enter reason for adding this badge..."
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleAddBadge}
                disabled={!badgeLabel.trim() || !badgeReason.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Badge
              </Button>
              <Button onClick={() => setShowAddBadge(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Badge Modal */}
      {showRemoveBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Remove Badge</h3>

            <div className="mb-4">
              <Label className="mb-2">Reason for removal (required)</Label>
              <TextArea
                value={removeBadgeReason}
                onChange={(value) => setRemoveBadgeReason(value)}
                placeholder="Enter reason for removing this badge..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleRemoveBadge(showRemoveBadge)}
                disabled={!removeBadgeReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove Badge
              </Button>
              <Button onClick={() => setShowRemoveBadge(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Action Modal */}
      {showStatusAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {showStatusAction.charAt(0).toUpperCase() + showStatusAction.slice(1).replace("-", " ")}
            </h3>

            <div className="mb-4">
              <Label className="mb-2">Reason (required)</Label>
              <TextArea
                value={statusReason}
                onChange={(value) => setStatusReason(value)}
                placeholder={`Enter reason for ${showStatusAction}...`}
                rows={3}
              />
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  This action will be logged and may affect the user's account immediately.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleStatusAction}
                disabled={!statusReason.trim()}
                className={showStatusAction === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}
              >
                Confirm {showStatusAction.charAt(0).toUpperCase() + showStatusAction.slice(1)}
              </Button>
              <Button onClick={() => setShowStatusAction(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
