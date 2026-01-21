"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import {
  AdminProfile,
  SectionKey,
  ProfileSection,
  DocumentType,
  StaffNote,
} from "@/types/admin-profile";
import ProfileHeader from "@/components/user-profile/ProfileHeader";
import ProfileMenu from "@/components/user-profile/ProfileMenu";
import SectionDetailView from "@/components/user-profile/SectionDetailView";
import DocumentManagement from "@/components/user-profile/DocumentManagement";
import KYCReviewWorkflow from "@/components/user-profile/KYCReviewWorkflow";
import AdminControlsOverlay from "@/components/user-profile/AdminControlsOverlay";
import { AssignmentPanel, AuditTrailPanel } from "@/components/user-profile/AssignmentAndAudit";
import ConversationsView from "@/components/user-profile/ConversationsView";
import Button from "@/components/ui/button/Button";

interface ComprehensiveProfilePageProps {
  profile: AdminProfile;
  currentStaffId: string;
  availableStaff?: Array<{ id: string; name: string; department: string }>;
  onProfileUpdate?: (updates: Partial<AdminProfile>) => void;
}

export default function ComprehensiveProfilePage({
  profile,
  currentStaffId,
  availableStaff = [],
  onProfileUpdate,
}: ComprehensiveProfilePageProps) {
  const router = useRouter();
  // null = show menu, string = show that section
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(true);

  // Get section statuses for menu
  const sectionStatuses = profile.sections.reduce(
    (acc, section) => {
      acc[section.key] = section.status;
      return acc;
    },
    {} as Record<string, any>
  );

  // Handler functions
  const handleBack = () => {
    router.back();
  };

  const handleStartChat = () => {
    // Navigate to chat page with this user
    router.push(`/admin/chat?userId=${profile.header.identity.id}&userName=${encodeURIComponent(profile.header.identity.name)}`);
  };

  const handleOpenNotes = () => {
    // Navigate to section detail view and scroll to notes
    if (activeSection === null) {
      // If on main menu, switch to any section to show admin panel
      setActiveSection('basic' as SectionKey);
    }
    setShowAdminPanel(true);
    // Scroll to notes section
    setTimeout(() => {
      const notesElement = document.querySelector('[data-notes-section]');
      if (notesElement) {
        notesElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the notes section briefly
        notesElement.classList.add('ring-4', 'ring-purple-500', 'ring-opacity-50');
        setTimeout(() => {
          notesElement.classList.remove('ring-4', 'ring-purple-500', 'ring-opacity-50');
        }, 2000);
      }
    }, 200);
  };

  const handleSectionClick = (key: SectionKey) => {
    setActiveSection(key);
  };

  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  const handleSectionSave = (sectionKey: string, updatedFields: Record<string, any>, reason: string) => {
    console.log("Saving section:", sectionKey, updatedFields, reason);
    // Implement API call to save section
    if (onProfileUpdate) {
      // Update profile state
    }
  };

  const handleSectionVerify = (sectionKey: string, action: "verify" | "reject", reason: string) => {
    console.log("Verifying section:", sectionKey, action, reason);
    // Implement API call to verify/reject section
  };

  // Document handlers
  const handleDocumentUpload = (type: DocumentType, file: File, notes?: string) => {
    console.log("Uploading document:", type, file.name, notes);
    // Implement document upload
  };

  const handleDocumentDelete = (documentId: string, reason: string) => {
    console.log("Deleting document:", documentId, reason);
    // Implement document delete
  };

  const handleDocumentVerify = (documentId: string, reason: string) => {
    console.log("Verifying document:", documentId, reason);
    // Implement document verification
  };

  const handleDocumentReject = (documentId: string, reason: string) => {
    console.log("Rejecting document:", documentId, reason);
    // Implement document rejection
  };

  const handleDocumentReupload = (documentId: string, reason: string) => {
    console.log("Requesting reupload:", documentId, reason);
    // Implement reupload request
  };

  const handleDocumentView = (documentId: string) => {
    console.log("Viewing document:", documentId);
    // Implement document viewer
  };

  const handleDocumentDownload = (documentId: string) => {
    console.log("Downloading document:", documentId);
    // Implement document download
  };

  // KYC handlers
  const handleKYCApprove = (reason: string) => {
    console.log("Approving KYC:", reason);
    // Implement KYC approval
  };

  const handleKYCReject = (reason: string, additionalDocs?: string[]) => {
    console.log("Rejecting KYC:", reason, additionalDocs);
    // Implement KYC rejection
  };

  const handleKYCNeedMoreInfo = (reason: string, requiredDocs: string[]) => {
    console.log("KYC needs more info:", reason, requiredDocs);
    // Implement KYC additional info request
  };

  // Admin controls handlers
  const handleAddNote = (content: string, category: StaffNote["category"], isPrivate: boolean) => {
    console.log("Adding note:", content, category, isPrivate);
    // Implement add note
  };

  const handleAddBadge = (label: string, reason: string) => {
    console.log("Adding badge:", label, reason);
    // Implement add badge
  };

  const handleRemoveBadge = (badgeId: string, reason: string) => {
    console.log("Removing badge:", badgeId, reason);
    // Implement remove badge
  };

  const handleStatusAction = (action: any, reason: string) => {
    console.log("Status action:", action, reason);
    // Implement status action
  };

  // Assignment handlers
  const handleAssignToMe = (reason: string) => {
    console.log("Assigning to me:", reason);
    // Implement assign to me
  };

  const handleAssignToStaff = (staffId: string, reason: string) => {
    console.log("Assigning to staff:", staffId, reason);
    // Implement assign to staff
  };

  const handleTransfer = (staffId: string, reason: string) => {
    console.log("Transferring case:", staffId, reason);
    // Implement transfer
  };

  // Render active section content
  const renderSectionContent = () => {
    if (!activeSection) {
      return (
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            Select a section from the menu to view details
          </p>
        </div>
      );
    }

    // Documents section
    if (activeSection === "documents") {
      return (
        <DocumentManagement
          documents={profile.documents}
          onUpload={handleDocumentUpload}
          onDelete={handleDocumentDelete}
          onVerify={handleDocumentVerify}
          onReject={handleDocumentReject}
          onRequestReupload={handleDocumentReupload}
          onView={handleDocumentView}
          onDownload={handleDocumentDownload}
          isAdminView={true}
        />
      );
    }

    // KYC section
    if (activeSection === "kyc" && profile.kyc) {
      return (
        <KYCReviewWorkflow
          submission={profile.kyc}
          onApprove={handleKYCApprove}
          onReject={handleKYCReject}
          onNeedMoreInfo={handleKYCNeedMoreInfo}
          onViewDocument={handleDocumentView}
          isAdminView={true}
        />
      );
    }

    // KYB section
    if (activeSection === "kyb" && profile.kyb) {
      return (
        <KYCReviewWorkflow
          submission={profile.kyb}
          onApprove={handleKYCApprove}
          onReject={handleKYCReject}
          onNeedMoreInfo={handleKYCNeedMoreInfo}
          onViewDocument={handleDocumentView}
          isAdminView={true}
        />
      );
    }

    // Job history section
    if (activeSection === "history") {
      return (
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            {profile.header.identity.userType === "jobseeker" ? "Job History" : "Job Postings"}
          </h2>
          {profile.jobHistory && profile.jobHistory.length > 0 ? (
            <div className="space-y-4">
              {profile.jobHistory.map((job, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow dark:border-gray-700">
                  {/* Job Title & Company */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">{job.company}</p>
                    </div>
                    {job.status && (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        job.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {job.status}
                      </span>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {job.location && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{job.location}</p>
                      </div>
                    )}
                    {job.duration && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{job.duration}</p>
                      </div>
                    )}
                    {job.salary && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{job.salary}</p>
                      </div>
                    )}
                    {job.employmentType && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{job.employmentType}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {job.description && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills Required</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, skillIdx) => (
                          <span key={skillIdx} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date Posted */}
                  {job.postedDate && (
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      Posted on {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No history available</p>
            </div>
          )}
        </div>
      );
    }

    // Conversations section
    if (activeSection === "chats") {
      return (
        <ConversationsView
          conversations={profile.chatConversations || []}
          currentUserId={profile.header.identity.id}
          isAdminView={true}
        />
      );
    }

    // Regular section
    const section = profile.sections.find((s) => s.key === activeSection);
    if (!section) {
      return (
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">Section not found</p>
        </div>
      );
    }

    return (
      <SectionDetailView
        section={section}
        isEditable={true}
        onSave={handleSectionSave}
        onVerify={handleSectionVerify}
        isAdminView={true}
      />
    );
  };

  // Render main view (header + menu) or section detail view
  if (activeSection === null) {
    // MAIN VIEW: Header + Menu (like mobile app)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <ProfileHeader
            header={profile.header}
            onBack={handleBack}
            onStartChat={handleStartChat}
            onOpenNotes={handleOpenNotes}
            isAdminView={true}
          />

          {/* Menu List (below header, like mobile) */}
          <div className="p-6">
            <ProfileMenu
              userType={profile.header.identity.userType}
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
              sectionStatuses={sectionStatuses}
            />
          </div>
        </div>
      </div>
    );
  }

  // SECTION DETAIL VIEW: Show selected section with admin controls
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl p-6">
        {/* Action buttons row */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={handleBackToMenu}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleOpenNotes}
              variant="outline"
              className="border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
            >
              <FileText className="mr-2 h-4 w-4" />
              Internal Notes
            </Button>
            <Button
              onClick={handleStartChat}
              className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </div>
        </div>

        {/* Two-column layout: Section content + Admin controls */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left/Center: Section Content (2 columns width) */}
          <div className="lg:col-span-2">
            {renderSectionContent()}
          </div>

          {/* Right: Admin Controls (1 column width) */}
          {showAdminPanel && (
            <div className="space-y-6">
              <AdminControlsOverlay
                currentStatus={profile.header.accountStatus}
                badges={profile.badges}
                staffNotes={profile.staffNotes}
                onAddNote={handleAddNote}
                onAddBadge={handleAddBadge}
                onRemoveBadge={handleRemoveBadge}
                onStatusAction={handleStatusAction}
              />

              <AssignmentPanel
                assignment={profile.assignment}
                availableStaff={availableStaff}
                currentStaffId={currentStaffId}
                onAssignToMe={handleAssignToMe}
                onAssignToStaff={handleAssignToStaff}
                onTransfer={handleTransfer}
              />

              <AuditTrailPanel auditEntries={profile.auditTrail} />
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
