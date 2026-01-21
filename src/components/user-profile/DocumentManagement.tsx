"use client";

import React, { useState } from "react";
import {
  File,
  Download,
  Eye,
  Trash2,
  Upload,
  Check,
  X,
  AlertCircle,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react";
import { DocumentItem, DocumentType, DocumentStatus } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";

interface DocumentManagementProps {
  documents: DocumentItem[];
  onUpload?: (type: DocumentType, file: File, notes?: string) => void;
  onDelete?: (documentId: string, reason: string) => void;
  onVerify?: (documentId: string, reason: string) => void;
  onReject?: (documentId: string, reason: string) => void;
  onRequestReupload?: (documentId: string, reason: string) => void;
  onView?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  isAdminView?: boolean;
}

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const documentTypes: DocumentType[] = [
  "National ID",
  "Passport",
  "Driver License",
  "Certificate",
  "Selfie",
  "Bank Statement",
  "Tax Document",
  "Other",
];

export default function DocumentManagement({
  documents,
  onUpload,
  onDelete,
  onVerify,
  onReject,
  onRequestReupload,
  onView,
  onDownload,
  isAdminView = false,
}: DocumentManagementProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<DocumentType>("National ID");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [actionModal, setActionModal] = useState<{
    type: "delete" | "verify" | "reject" | "reupload";
    documentId: string;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");

  const handleUpload = () => {
    if (uploadFile && onUpload) {
      onUpload(uploadType, uploadFile, uploadNotes);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadNotes("");
    }
  };

  const handleAction = () => {
    if (!actionModal || !actionReason.trim()) return;

    switch (actionModal.type) {
      case "delete":
        onDelete?.(actionModal.documentId, actionReason);
        break;
      case "verify":
        onVerify?.(actionModal.documentId, actionReason);
        break;
      case "reject":
        onReject?.(actionModal.documentId, actionReason);
        break;
      case "reupload":
        onRequestReupload?.(actionModal.documentId, actionReason);
        break;
    }

    setActionModal(null);
    setActionReason("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Documents</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{documents.length} document(s) uploaded</p>
        </div>

        {isAdminView && onUpload && (
          <Button onClick={() => setShowUploadModal(true)} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="py-12 text-center">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <File className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{doc.type}</h3>
                      <StatusBadge status={doc.status} />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">{doc.fileName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{formatFileSize(doc.fileSize)}</p>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                      </div>

                      {doc.verifiedAt && (
                        <div className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-600" />
                          <span>Verified: {formatDate(doc.verifiedAt)}</span>
                        </div>
                      )}

                      {doc.verifiedBy && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>By: {doc.verifiedBy}</span>
                        </div>
                      )}
                    </div>

                    {doc.rejectionReason && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs text-red-700 dark:text-red-400">
                          Rejected: {doc.rejectionReason}
                        </p>
                      </div>
                    )}

                    {doc.notes && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-blue-700 dark:text-blue-400">Note: {doc.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {onView && (
                    <Button 
                      onClick={() => {
                        if (doc.fileUrl) {
                          window.open(doc.fileUrl, '_blank');
                        } else {
                          onView(doc.id);
                        }
                      }} 
                      variant="outline" 
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  {onDownload && (
                    <Button 
                      onClick={() => {
                        if (doc.fileUrl) {
                          const link = document.createElement('a');
                          link.href = doc.fileUrl;
                          link.download = doc.fileName;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          onDownload(doc.id);
                        }
                      }} 
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}

                  {isAdminView && (
                    <>
                      {doc.status === "pending" && onVerify && (
                        <Button
                          onClick={() => setActionModal({ type: "verify", documentId: doc.id })}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      {doc.status === "pending" && onReject && (
                        <Button
                          onClick={() => setActionModal({ type: "reject", documentId: doc.id })}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      {onRequestReupload && (
                        <Button
                          onClick={() => setActionModal({ type: "reupload", documentId: doc.id })}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          onClick={() => setActionModal({ type: "delete", documentId: doc.id })}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Upload Document</h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">Document Type</Label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as DocumentType)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="mb-2">File</Label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div>
                <Label className="mb-2">Notes (optional)</Label>
                <TextArea
                  value={uploadNotes}
                  onChange={(value) => setUploadNotes(value)}
                  placeholder="Add any notes about this document..."
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={handleUpload} disabled={!uploadFile} className="bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button onClick={() => setShowUploadModal(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action confirmation modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {actionModal.type === "delete" && "Delete Document"}
              {actionModal.type === "verify" && "Verify Document"}
              {actionModal.type === "reject" && "Reject Document"}
              {actionModal.type === "reupload" && "Request Re-upload"}
            </h3>

            <div className="mb-4">
              <Label className="mb-2">Reason (required)</Label>
              <TextArea
                value={actionReason}
                onChange={(value) => setActionReason(value)}
                placeholder={`Enter reason for ${actionModal.type}...`}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAction}
                disabled={!actionReason.trim()}
                className={
                  actionModal.type === "delete" || actionModal.type === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }
              >
                Confirm
              </Button>
              <Button onClick={() => setActionModal(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
