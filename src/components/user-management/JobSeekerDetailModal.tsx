"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Edit2, Save, MessageSquare, BadgeCheck } from "lucide-react";
import type { JobSeeker } from "@/types/user-management";

interface JobSeekerDetailModalProps {
  user: JobSeeker;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<JobSeeker>) => void;
}

export default function JobSeekerDetailModal({
  user,
  isOpen,
  onClose,
  onUpdate,
}: JobSeekerDetailModalProps) {
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
    { key: "experience", label: "Experience" },
    { key: "preferences", label: "Preferences" },
    { key: "education", label: "Education" },
    { key: "tax", label: "Tax Info" },
    { key: "social", label: "Social Links" },
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
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
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
                  <label className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</label>
                  <input
                    type="date"
                    value={editedData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Bio</label>
                  <textarea
                    value={editedData.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Work Experience
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Job Title</label>
                  <input
                    type="text"
                    value={editedData.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Experience (Years)</label>
                  <input
                    type="text"
                    value={editedData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Skills</label>
                  <input
                    type="text"
                    value={editedData.skills?.join(", ") || ""}
                    onChange={(e) => handleChange("skills", e.target.value.split(", "))}
                    disabled={!isEditing}
                    placeholder="Comma separated skills"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Job Preferences
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Preferred Location</label>
                  <input
                    type="text"
                    value={editedData.preferredLocation || editedData.location}
                    onChange={(e) => handleChange("preferredLocation", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Expected Salary</label>
                  <input
                    type="text"
                    value={editedData.expectedSalary || "Not specified"}
                    onChange={(e) => handleChange("expectedSalary", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Work Type</label>
                  <select
                    value={editedData.workType || "full-time"}
                    onChange={(e) => handleChange("workType", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Availability</label>
                  <select
                    value={editedData.availability || "immediate"}
                    onChange={(e) => handleChange("availability", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 Weeks</option>
                    <option value="1-month">1 Month</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Education Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Highest Degree</label>
                  <input
                    type="text"
                    value={editedData.education?.degree || "Not specified"}
                    onChange={(e) => handleChange("education", { ...editedData.education, degree: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Institution</label>
                  <input
                    type="text"
                    value={editedData.education?.institute || "Not specified"}
                    onChange={(e) => handleChange("education", { ...editedData.education, institute: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Field of Study</label>
                  <input
                    type="text"
                    value={editedData.fieldOfStudy || "Not specified"}
                    onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Graduation Year</label>
                  <input
                    type="text"
                    value={editedData.education?.year || "Not specified"}
                    onChange={(e) => handleChange("education", { ...editedData.education, year: e.target.value })}
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
                  <label className="text-sm text-gray-600 dark:text-gray-400">Tax File Number (TFN)</label>
                  <input
                    type="text"
                    value={editedData.tfn || "Not provided"}
                    onChange={(e) => handleChange("tfn", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
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
                  <label className="text-sm text-gray-600 dark:text-gray-400">Tax Residency</label>
                  <input
                    type="text"
                    value={editedData.taxResidency || "Australia"}
                    onChange={(e) => handleChange("taxResidency", e.target.value)}
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
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">GitHub</label>
                  <input
                    type="url"
                    value={editedData.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Portfolio/Website</label>
                  <input
                    type="url"
                    value={editedData.portfolio || ""}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
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
                    placeholder="https://twitter.com/username"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents & Verification
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Resume/CV</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.resume || user.resumeUrl ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                  {(user.resume || user.resumeUrl) && (
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ID Verification</p>
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
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Police Check</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.policeCheck ? "Verified" : "Not submitted"}
                    </p>
                  </div>
                  {user.policeCheck && (
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Work Rights</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.workRights || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
