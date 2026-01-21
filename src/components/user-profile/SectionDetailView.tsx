"use client";

import React, { useState } from "react";
import { Edit, Check, X, Save, Shield, AlertCircle } from "lucide-react";
import { ProfileSection, FieldValue, VerificationStatus } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

interface SectionDetailViewProps {
  section: ProfileSection;
  isEditable?: boolean;
  onSave?: (sectionKey: string, updatedFields: Record<string, any>, reason: string) => void;
  onVerify?: (sectionKey: string, action: "verify" | "reject", reason: string) => void;
  isAdminView?: boolean;
}

const StatusBadge = ({ status }: { status: VerificationStatus }) => {
  const colors = {
    verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    incomplete: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}>
      <Shield className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function SectionDetailView({
  section,
  isEditable = true,
  onSave,
  onVerify,
  isAdminView = false,
}: SectionDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [reason, setReason] = useState("");
  const [verifyAction, setVerifyAction] = useState<"verify" | "reject" | null>(null);
  const [verifyReason, setVerifyReason] = useState("");

  const handleFieldChange = (label: string, value: any) => {
    setEditedFields((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSave = () => {
    if (onSave && reason.trim()) {
      const fieldsToSave = Object.keys(editedFields).length > 0 ? editedFields : {};
      onSave(section.key, fieldsToSave, reason);
      setIsEditing(false);
      setEditedFields({});
      setReason("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({});
    setReason("");
  };

  const handleVerify = (action: "verify" | "reject") => {
    setVerifyAction(action);
  };

  const confirmVerify = () => {
    if (onVerify && verifyAction && verifyReason.trim()) {
      onVerify(section.key, verifyAction, verifyReason);
      setVerifyAction(null);
      setVerifyReason("");
    }
  };

  const renderFieldValue = (field: FieldValue) => {
    if (isEditing && field.editable !== false) {
      const currentValue = editedFields[field.label] ?? field.value;

      if (field.type === "multiline") {
        return (
          <TextArea
            value={currentValue as string}
            onChange={(value) => handleFieldChange(field.label, value)}
            rows={3}
            className="w-full"
          />
        );
      }

      if (field.type === "select" && Array.isArray(field.value)) {
        return (
          <select
            value={currentValue as string}
            onChange={(e) => handleFieldChange(field.label, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            {(field.value as string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }

      return (
        <Input
          type={field.type || "text"}
          value={currentValue as string}
          onChange={(e) => handleFieldChange(field.label, e.target.value)}
          className="w-full"
        />
      );
    }

    // Display mode
    if (field.sensitive && !isAdminView) {
      return <span className="text-gray-900 dark:text-gray-100">••••••••</span>;
    }

    if (Array.isArray(field.value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {field.value.map((item, idx) => (
            <span
              key={idx}
              className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    return <span className="text-gray-900 dark:text-gray-100">{field.value}</span>;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
          <StatusBadge status={section.status} />
        </div>

        <div className="flex items-center gap-2">
          {isAdminView && onVerify && section.status !== "verified" && !isEditing && (
            <>
              <Button
                onClick={() => handleVerify("verify")}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-1 h-4 w-4" />
                Verify
              </Button>
              <Button
                onClick={() => handleVerify("reject")}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </>
          )}

          {isEditable && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Updated info */}
      {section.updatedAt && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <AlertCircle className="h-4 w-4" />
          <span>
            Last updated: {new Date(section.updatedAt).toLocaleDateString()}
            {section.updatedBy && ` by ${section.updatedBy}`}
          </span>
        </div>
      )}

      {/* Fields */}
      <div className="space-y-4">
        {section.fields.map((field, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Label className="font-medium text-gray-700 dark:text-gray-300">{field.label}</Label>
            <div className="md:col-span-2">{renderFieldValue(field)}</div>
          </div>
        ))}
      </div>

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-4">
          {section.subsections.map((subsection, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">{subsection.title}</h3>
              <div className="space-y-3">
                {subsection.fields.map((field, fieldIdx) => (
                  <div key={fieldIdx} className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</Label>
                    <div className="md:col-span-2">{renderFieldValue(field)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit actions */}
      {isEditing && (
        <div className="mt-6 space-y-4 rounded-lg border-t border-gray-200 pt-4 dark:border-gray-700">
          <div>
            <Label className="mb-2">Reason for edit (required)</Label>
            <TextArea
              value={reason}
              onChange={(value) => setReason(value)}
              placeholder="Enter the reason for this edit..."
              rows={2}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!reason.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Verify action modal */}
      {verifyAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {verifyAction === "verify" ? "Verify Section" : "Reject Section"}
            </h3>
            <div className="mb-4">
              <Label className="mb-2">Reason (required)</Label>
              <TextArea
                value={verifyReason}
                onChange={(value) => setVerifyReason(value)}
                placeholder={`Enter reason for ${verifyAction}...`}
                rows={3}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={confirmVerify}
                disabled={!verifyReason.trim()}
                className={verifyAction === "verify" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                Confirm {verifyAction === "verify" ? "Verify" : "Reject"}
              </Button>
              <Button onClick={() => setVerifyAction(null)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
