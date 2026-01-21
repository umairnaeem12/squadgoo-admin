"use client";

import React, { useState } from "react";
import { Shield, Check, X, AlertCircle, Eye, History, FileText, Calendar, User } from "lucide-react";
import { KYCSubmission, KYCAttempt, DocumentItem } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface KYCReviewWorkflowProps {
  submission: KYCSubmission;
  onApprove?: (reason: string) => void;
  onReject?: (reason: string, additionalDocs?: string[]) => void;
  onNeedMoreInfo?: (reason: string, requiredDocs: string[]) => void;
  onViewDocument?: (documentId: string) => void;
  isAdminView?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      <Shield className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function KYCReviewWorkflow({
  submission,
  onApprove,
  onReject,
  onNeedMoreInfo,
  onViewDocument,
  isAdminView = false,
}: KYCReviewWorkflowProps) {
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "need-more-info" | null>(null);
  const [reason, setReason] = useState("");
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([]);
  const [newDocType, setNewDocType] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleConfirmAction = () => {
    if (!reason.trim()) return;

    switch (reviewAction) {
      case "approve":
        onApprove?.(reason);
        break;
      case "reject":
        onReject?.(reason, additionalDocs);
        break;
      case "need-more-info":
        onNeedMoreInfo?.(reason, additionalDocs);
        break;
    }

    setReviewAction(null);
    setReason("");
    setAdditionalDocs([]);
  };

  const addAdditionalDoc = () => {
    if (newDocType.trim() && !additionalDocs.includes(newDocType)) {
      setAdditionalDocs([...additionalDocs, newDocType]);
      setNewDocType("");
    }
  };

  const removeAdditionalDoc = (doc: string) => {
    setAdditionalDocs(additionalDocs.filter((d) => d !== doc));
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

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">KYC Verification</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submission ID: {submission.id} • Attempt #{submission.attempts.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} />
          {submission.attempts.length > 1 && (
            <Button onClick={() => setShowHistory(!showHistory)} variant="outline" size="sm">
              <History className="mr-1 h-4 w-4" />
              History
            </Button>
          )}
        </div>
      </div>

      {/* Submission details */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <Label className="mb-2 text-xs text-gray-600 dark:text-gray-400">Submitted</Label>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <Calendar className="h-4 w-4" />
            {formatDate(submission.submittedAt)}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <Label className="mb-2 text-xs text-gray-600 dark:text-gray-400">ID Type</Label>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <FileText className="h-4 w-4" />
            {submission.idType}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <Label className="mb-2 text-xs text-gray-600 dark:text-gray-400">ID Number</Label>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{submission.idNumber}</div>
        </div>

        {submission.reviewedBy && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <Label className="mb-2 text-xs text-gray-600 dark:text-gray-400">Reviewed By</Label>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <User className="h-4 w-4" />
              {submission.reviewedBy}
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Submitted Documents</h3>
        <div className="space-y-2">
          {submission.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{doc.type}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{doc.fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                {onViewDocument && (
                  <Button onClick={() => onViewDocument(doc.id)} variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous rejection/request */}
      {submission.rejectionReason && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-400">Previous Rejection Reason</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{submission.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {submission.additionalDocsRequested && submission.additionalDocsRequested.length > 0 && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-400">Additional Documents Requested</p>
              <ul className="mt-2 list-inside list-disc text-sm text-yellow-700 dark:text-yellow-400">
                {submission.additionalDocsRequested.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Admin actions */}
      {isAdminView && submission.status === "pending" && (
        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            onClick={() => setReviewAction("approve")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve / Verify
          </Button>
          <Button
            onClick={() => setReviewAction("reject")}
            className="bg-red-600 hover:bg-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => setReviewAction("need-more-info")}
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Need More Info
          </Button>
        </div>
      )}

      {/* Review history */}
      {showHistory && (
        <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Review History</h3>
          <div className="space-y-3">
            {submission.attempts.map((attempt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  {attempt.attemptNumber}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={attempt.status} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(attempt.submittedAt)}
                    </span>
                  </div>
                  {attempt.reviewedBy && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Reviewed by {attempt.reviewedBy}
                      {attempt.reviewedAt && ` on ${formatDate(attempt.reviewedAt)}`}
                    </p>
                  )}
                  {attempt.reason && (
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{attempt.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review action modal */}
      {reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {reviewAction === "approve" && "Approve KYC Verification"}
              {reviewAction === "reject" && "Reject KYC Submission"}
              {reviewAction === "need-more-info" && "Request Additional Information"}
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">
                  Reason {reviewAction === "approve" ? "(optional)" : "(required)"}
                </Label>
                <TextArea
                  value={reason}
                  onChange={(value) => setReason(value)}
                  placeholder={`Enter reason for ${reviewAction}...`}
                  rows={3}
                />
              </div>

              {(reviewAction === "reject" || reviewAction === "need-more-info") && (
                <div>
                  <Label className="mb-2">Additional Documents Required (optional)</Label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addAdditionalDoc()}
                      placeholder="e.g., Bank Statement, Utility Bill"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <Button onClick={addAdditionalDoc} variant="outline">
                      Add
                    </Button>
                  </div>
                  {additionalDocs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {additionalDocs.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        >
                          {doc}
                          <button onClick={() => removeAdditionalDoc(doc)} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleConfirmAction}
                disabled={reviewAction !== "approve" && !reason.trim()}
                className={
                  reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : reviewAction === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                }
              >
                Confirm
              </Button>
              <Button onClick={() => setReviewAction(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
