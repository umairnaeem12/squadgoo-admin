"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Edit2, Save, MessageSquare, BadgeCheck } from "lucide-react";
import type { Recruiter } from "@/types/user-management";

interface RecruiterDetailModalProps {
  user: Recruiter;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Recruiter>) => void;
}

export default function RecruiterDetailModal({
  user,
  isOpen,
  onClose,
  onUpdate,
}: RecruiterDetailModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(user);

  if (!isOpen) return null;

  const handleChat = () => {
    router.push(`/chat?userId=${user.id}&userName=${user.firstName}%20${user.lastName}`);
  };

  const tabs = [
    { key: "basic", label: "Basic Details" },
    { key: "company", label: "Company" },
    { key: "tax", label: "Tax Info" },
    { key: "social", label: "Social Media" },
    { key: "kyc", label: "KYC & KYB" },
    { key: "documents", label: "Documents" },
  ];

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                {user.verified && (
                  <BadgeCheck className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{user.companyName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleChat}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">First Name</label>
                  <input
                    type="text"
                    value={editedData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Last Name</label>
                  <input
                    type="text"
                    value={editedData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Location</label>
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Verified Status</label>
                  <select
                    value={editedData.verified ? "yes" : "no"}
                    onChange={(e) => handleChange("verified", e.target.value === "yes")}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="no">Not Verified</option>
                    <option value="yes">Verified</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Company Name</label>
                  <input
                    type="text"
                    value={editedData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Industry</label>
                  <input
                    type="text"
                    value={editedData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Company Size</label>
                  <input
                    type="text"
                    value={editedData.companySize || "Not specified"}
                    onChange={(e) => handleChange("companySize", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</label>
                  <input
                    type="number"
                    value={editedData.jobsPosted}
                    onChange={(e) => handleChange("jobsPosted", parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Company Description</label>
                  <textarea
                    value={editedData.companyDescription || ""}
                    onChange={(e) => handleChange("companyDescription", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Website</label>
                  <input
                    type="url"
                    value={editedData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Founded Year</label>
                  <input
                    type="text"
                    value={editedData.foundedYear || ""}
                    onChange={(e) => handleChange("foundedYear", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "tax" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tax Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">ABN</label>
                  <input
                    type="text"
                    value={editedData.abn || "Not provided"}
                    onChange={(e) => handleChange("abn", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">ACN</label>
                  <input
                    type="text"
                    value={editedData.acn || "Not provided"}
                    onChange={(e) => handleChange("acn", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">GST Registered</label>
                  <select
                    value={editedData.gstRegistered ? "yes" : "no"}
                    onChange={(e) => handleChange("gstRegistered", e.target.value === "yes")}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Tax Status</label>
                  <input
                    type="text"
                    value={editedData.taxStatus || "Active"}
                    onChange={(e) => handleChange("taxStatus", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</label>
                  <input
                    type="url"
                    value={editedData.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/company/..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Twitter/X</label>
                  <input
                    type="url"
                    value={editedData.twitter || ""}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Facebook</label>
                  <input
                    type="url"
                    value={editedData.facebook || ""}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Instagram</label>
                  <input
                    type="url"
                    value={editedData.instagram || ""}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "kyc" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                KYC & KYB Verification
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">KYC Status</label>
                  <select
                    value={editedData.kycStatus}
                    onChange={(e) => handleChange("kycStatus", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">KYB Status</label>
                  <select
                    value={editedData.kybStatus || editedData.kycStatus || "pending"}
                    onChange={(e) => handleChange("kybStatus", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Company Registration</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.companyRegistration ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                  {user.companyRegistration && (
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Business License</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.businessLicense ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                  {user.businessLicense && (
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Director ID</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Status: {user.kycStatus}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded ${
                    user.kycStatus === "verified"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : user.kycStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {user.kycStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
