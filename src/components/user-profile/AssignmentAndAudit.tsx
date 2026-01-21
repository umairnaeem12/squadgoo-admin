"use client";

import React, { useState } from "react";
import { UserCheck, Users, ArrowRight, Clock, History, User as UserIcon } from "lucide-react";
import { Assignment, AssignmentHistory, AuditEntry } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface AssignmentPanelProps {
  assignment?: Assignment;
  availableStaff?: Array<{ id: string; name: string; department: string }>;
  currentStaffId: string;
  onAssignToMe?: (reason: string) => void;
  onAssignToStaff?: (staffId: string, reason: string) => void;
  onTransfer?: (staffId: string, reason: string) => void;
}

interface AuditTrailPanelProps {
  auditEntries: AuditEntry[];
  filters?: {
    module?: string[];
    action?: string[];
  };
  onFilterChange?: (filters: { module?: string[]; action?: string[] }) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Assignment Panel Component
export function AssignmentPanel({
  assignment,
  availableStaff = [],
  currentStaffId,
  onAssignToMe,
  onAssignToStaff,
  onTransfer,
}: AssignmentPanelProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [reason, setReason] = useState("");

  const handleAssignToMe = () => {
    if (reason.trim() && onAssignToMe) {
      onAssignToMe(reason);
      setReason("");
      setShowAssignModal(false);
    }
  };

  const handleAssignToStaff = () => {
    if (selectedStaffId && reason.trim() && onAssignToStaff) {
      onAssignToStaff(selectedStaffId, reason);
      setSelectedStaffId("");
      setReason("");
      setShowAssignModal(false);
    }
  };

  const handleTransfer = () => {
    if (selectedStaffId && reason.trim() && onTransfer) {
      onTransfer(selectedStaffId, reason);
      setSelectedStaffId("");
      setReason("");
      setShowTransferModal(false);
    }
  };

  const isAssignedToMe = assignment?.ownerId === currentStaffId;

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
        <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Case Ownership</h3>
      </div>

      {/* Current assignment */}
      {assignment ? (
        <div className="mb-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="mb-2 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {isAssignedToMe ? "You" : assignment.owner}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                assignment.status === "open"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : assignment.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : assignment.status === "resolved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {assignment.status}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Department: {assignment.department}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Assigned: {formatDate(assignment.assignedAt)}
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">No assignment yet</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {!assignment && (
          <Button
            onClick={() => setShowAssignModal(true)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Assign to Me
          </Button>
        )}

        {assignment && !isAssignedToMe && (
          <Button
            onClick={() => setShowTransferModal(true)}
            variant="outline"
            className="w-full"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Request Transfer
          </Button>
        )}

        {assignment && isAssignedToMe && (
          <Button
            onClick={() => setShowTransferModal(true)}
            variant="outline"
            className="w-full"
          >
            <Users className="mr-2 h-4 w-4" />
            Transfer to Staff
          </Button>
        )}
      </div>

      {/* Assignment history */}
      {assignment && assignment.history.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <History className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Transfer History</h4>
          </div>
          <div className="space-y-2">
            {assignment.history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{entry.from}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{entry.to}</span>
                </div>
                <p className="mt-1 text-xs italic text-gray-600 dark:text-gray-400">
                  "{entry.reason}"
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {formatDate(entry.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign to Me Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Assign Case</h3>

            <div className="mb-4">
              <Label className="mb-2">Reason for assignment (required)</Label>
              <TextArea
                value={reason}
                onChange={(value) => setReason(value)}
                placeholder="Enter reason for taking this case..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAssignToMe}
                disabled={!reason.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Assign to Me
              </Button>
              <Button onClick={() => setShowAssignModal(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Transfer Case</h3>

            <div className="mb-4">
              <Label className="mb-2">Select Staff Member</Label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">-- Select Staff --</option>
                {availableStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <Label className="mb-2">Reason for transfer (required)</Label>
              <TextArea
                value={reason}
                onChange={(value) => setReason(value)}
                placeholder="Enter reason for transferring this case..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTransfer}
                disabled={!selectedStaffId || !reason.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Transfer Case
              </Button>
              <Button onClick={() => setShowTransferModal(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Audit Trail Panel Component
export function AuditTrailPanel({ auditEntries, filters, onFilterChange }: AuditTrailPanelProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const modules = Array.from(new Set(auditEntries.map((e) => e.module)));
  const actions = Array.from(new Set(auditEntries.map((e) => e.action)));

  const getActionColor = (action: string) => {
    if (action.includes("verify") || action.includes("approve")) {
      return "text-green-600 dark:text-green-400";
    }
    if (action.includes("reject") || action.includes("delete") || action.includes("block")) {
      return "text-red-600 dark:text-red-400";
    }
    if (action.includes("edit") || action.includes("update")) {
      return "text-blue-600 dark:text-blue-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Audit Trail</h3>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{auditEntries.length} entries</span>
      </div>

      {/* Filters */}
      {onFilterChange && (
        <div className="mb-4 flex gap-2">
          <select
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({ ...filters, module: value ? [value] : undefined });
            }}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({ ...filters, action: value ? [value] : undefined });
            }}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Entries */}
      {auditEntries.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-600 dark:text-gray-400">No audit entries</p>
      ) : (
        <div className="space-y-2">
          {auditEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      {entry.module}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{entry.actor}</span> ({entry.actorRole})
                  </p>

                  {entry.reason && (
                    <p className="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
                      "{entry.reason}"
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>

                  {/* Before/After details */}
                  {(entry.before || entry.after) && (
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="mt-2 text-xs text-purple-600 hover:underline dark:text-purple-400"
                    >
                      {expandedEntry === entry.id ? "Hide" : "Show"} details
                    </button>
                  )}

                  {expandedEntry === entry.id && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                      {entry.before && (
                        <div className="mb-2">
                          <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Before:
                          </p>
                          <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
                            {JSON.stringify(entry.before, null, 2)}
                          </pre>
                        </div>
                      )}
                      {entry.after && (
                        <div>
                          <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            After:
                          </p>
                          <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
                            {JSON.stringify(entry.after, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
