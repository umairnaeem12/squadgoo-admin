// ==================== Core Profile Types ====================

export type ProfileType = "jobseeker" | "recruiter" | "staff";
export type AccountStatus = "active" | "inactive" | "suspended" | "blocked";
export type VerificationStatus = "submitted" | "pending" | "verified" | "rejected" | "incomplete";
export type DocumentStatus = "pending" | "verified" | "rejected";

// ==================== User Identity ====================

export interface UserIdentity {
  id: string;
  uniqueId: string; // e.g., JS-1035, REC-5678, STAFF-999
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  role: string; // Job Seeker, Recruiter, Staff, etc.
  userType: ProfileType;
}

// ==================== Profile Header ====================

export interface ProfileHeader {
  identity: UserIdentity;
  location: string;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  rating?: number;
  reviewCount?: number;
  profileCompleteness: number; // 0-100
  badges: BadgeEntry[];
  memberSince: string;
}

// ==================== Profile Sections ====================

export type SectionKey =
  | "basic"
  | "address"
  | "contact"
  | "experience"
  | "education"
  | "preferences"
  | "tax"
  | "visa"
  | "kyc"
  | "kyb"
  | "qualifications"
  | "company"
  | "social"
  | "password"
  | "documents"
  | "history"
  | "offers"
  | "chats";

export interface FieldValue {
  label: string;
  value: string | number | boolean | string[];
  type?: "text" | "email" | "phone" | "url" | "date" | "multiline" | "select" | "multiselect";
  editable?: boolean;
  sensitive?: boolean; // mask by default
}

export interface ProfileSection {
  key: SectionKey;
  title: string;
  icon?: string;
  status: VerificationStatus;
  updatedAt?: string;
  updatedBy?: string;
  fields: FieldValue[];
  subsections?: ProfileSection[];
}

// ==================== Documents ====================

export type DocumentType =
  | "National ID"
  | "Passport"
  | "Driver License"
  | "Certificate"
  | "Selfie"
  | "Bank Statement"
  | "Tax Document"
  | "Other";

export interface DocumentItem {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string; // user or staff
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
  notes?: string;
}

export interface DocumentUploadRequest {
  type: DocumentType;
  file: File;
  notes?: string;
  expiryDate?: string;
}

// ==================== KYC/KYB ====================

export interface KYCSubmission {
  id: string;
  submittedAt: string;
  status: DocumentStatus;
  idType: string;
  idNumber: string; // masked
  documents: DocumentItem[];
  attempts: KYCAttempt[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  additionalDocsRequested?: string[];
}

export interface KYCAttempt {
  attemptNumber: number;
  submittedAt: string;
  status: DocumentStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

export interface KYBSubmission extends KYCSubmission {
  companyName: string;
  companyRegistration: string;
  companyType: string;
  businessAddress: string;
}

// ==================== Experience & Education ====================

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string; // null if current
  isCurrent: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  field: string;
  description?: string;
}

export interface Qualification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

// ==================== Job History & Offers ====================

export interface JobHistory {
  id: string;
  title: string;
  company: string;
  location?: string;
  duration?: string;
  employmentType?: string;
  salary?: string;
  description?: string;
  skills?: string[];
  startDate: string;
  endDate: string;
  postedDate?: string;
  status: "completed" | "ongoing" | "cancelled" | "active";
  rating?: number;
  feedback?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  offeredAt: string;
  expiresAt?: string;
  status: "current" | "expired" | "accepted" | "rejected" | "completed";
  amount?: number;
  currency?: string;
}

// ==================== Issues & Problems ====================

export interface IssuesSummary {
  wallet: {
    pendingTransactions: number;
    bankVerificationPending: boolean;
    holdAmount?: number;
  };
  kyc: {
    status: VerificationStatus;
    pendingReview: boolean;
    rejectionCount: number;
  };
  tickets: {
    open: number;
    pending: number;
    total: number;
  };
  chatReports: {
    count: number;
    unresolved: number;
  };
  flags: {
    suspicious: boolean;
    repeatedDeclines: number;
    other?: string[];
  };
}

// ==================== Chat ====================

export interface ChatConversation {
  id: string;
  participants: string[]; // user IDs
  participantNames: string[];
  participantIds: string[];
  lastMessage: string;
  lastMessageAt?: string; // keep for backward compatibility
  lastMessageTime: string;
  unreadCount?: number;
  isReported?: boolean;
  reportReason?: string;
  reportedMessageId?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  message?: string; // keep for backward compatibility
  content: string;
  timestamp: string;
  isReported?: boolean;
  reportReason?: string;
  isCurrentUser: boolean;
}

export interface LiveChatSession {
  id: string;
  userId: string;
  staffId: string;
  startedAt: string;
  endedAt?: string;
  messages: ChatMessage[];
  status: "active" | "closed";
}

// ==================== Admin Controls ====================

export interface BadgeEntry {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  addedBy: string;
  addedAt: string;
  reason: string;
}

export interface StaffNote {
  id: string;
  content: string;
  category: "wallet" | "kyc" | "behavior" | "technical" | "other";
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  isPrivate: boolean; // visible only to specific roles
}

export interface StatusAction {
  action: "suspend" | "unsuspend" | "block" | "unblock" | "delete" | "activate" | "deactivate";
  reason: string;
  performedBy: string;
  performedAt: string;
}

export interface Assignment {
  caseId: string;
  owner: string;
  ownerId: string;
  assignedAt: string;
  department: string;
  status: "open" | "in-progress" | "resolved" | "transferred";
  history: AssignmentHistory[];
}

export interface AssignmentHistory {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  reason: string;
  timestamp: string;
  action: "assigned" | "transferred" | "claimed";
}

// ==================== Audit Trail ====================

export interface AuditEntry {
  id: string;
  actor: string;
  actorId: string;
  actorRole: string;
  targetEntity: string; // user/staff
  targetId: string;
  action: string; // verify, reject, edit, suspend, delete, assign, transfer
  module: "profile" | "kyc" | "wallet" | "document" | "status" | "assignment" | "badge";
  before?: Record<string, any>;
  after?: Record<string, any>;
  reason: string;
  timestamp: string;
  ipAddress?: string;
}

// ==================== Staff Hierarchy ====================

export type StaffRole = "super-admin" | "admin" | "manager" | "staff" | "customer-service";

export interface StaffHierarchy {
  currentRole: StaffRole;
  assignedBy: string;
  assignedAt: string;
  roleHistory: RoleChange[];
}

export interface RoleChange {
  id: string;
  from: StaffRole;
  to: StaffRole;
  changedBy: string;
  changedAt: string;
  reason: string;
}

export interface Department {
  id: string;
  name: string;
  accessLevel: "view" | "action" | "manager";
  canTakeOwnership: boolean;
  canTransferCases: boolean;
}

export interface StaffPermissions {
  departments: Department[];
  menuAccess: MenuPermission[];
  workload: {
    walletPending: number;
    kycPending: number;
    ticketsPending: number;
    disputesPending: number;
  };
}

export interface MenuPermission {
  module: string;
  canView: boolean;
  actions: {
    verifyKYC: boolean;
    approveBankVerification: boolean;
    approveWithdrawals: boolean;
    rejectWithdrawals: boolean;
    suspendUsers: boolean;
    blockUsers: boolean;
    deleteAccounts: boolean;
    viewUserChats: boolean;
    respondInLiveChat: boolean;
    editProfiles: boolean;
    manageBadges: boolean;
    viewAuditLogs: boolean;
  };
}

// ==================== Complete Profile ====================

export interface AdminProfile {
  // Core identity
  header: ProfileHeader;

  // Profile sections (what user sees)
  sections: ProfileSection[];
  experience: Experience[];
  education: Education[];
  qualifications: Qualification[];

  // Documents
  documents: DocumentItem[];

  // KYC/KYB
  kyc?: KYCSubmission;
  kyb?: KYBSubmission;

  // Job-related
  jobHistory?: JobHistory[];
  offers?: JobOffer[];

  // Issues & flags
  issues: IssuesSummary;

  // Chat
  chatConversations?: ChatConversation[];
  liveChatHistory?: LiveChatSession[];

  // Admin controls
  badges: BadgeEntry[];
  staffNotes: StaffNote[];
  assignment?: Assignment;
  auditTrail: AuditEntry[];

  // Staff-specific (only for staff profiles)
  staffHierarchy?: StaffHierarchy;
  staffPermissions?: StaffPermissions;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

// ==================== API Request/Response Types ====================

export interface ProfileUpdateRequest {
  sectionKey: SectionKey;
  fields: Record<string, any>;
  reason: string;
}

export interface DocumentActionRequest {
  documentId: string;
  action: "verify" | "reject" | "delete" | "request-reupload";
  reason: string;
  additionalDocs?: string[];
}

export interface KYCReviewRequest {
  submissionId: string;
  action: "approve" | "reject" | "need-more-info";
  reason: string;
  requiredDocs?: string[];
}

export interface BadgeActionRequest {
  action: "add" | "remove";
  badgeLabel?: string;
  badgeId?: string;
  reason: string;
}

export interface StatusActionRequest {
  action: StatusAction["action"];
  reason: string;
}

export interface AssignmentActionRequest {
  action: "assign-to-me" | "assign-to-staff" | "transfer";
  targetStaffId?: string;
  reason: string;
}

export interface StaffNoteRequest {
  content: string;
  category: StaffNote["category"];
  isPrivate: boolean;
}

// ==================== UI State ====================

export interface ProfileUIState {
  activeSection: SectionKey | null;
  isEditing: boolean;
  editingSectionKey: SectionKey | null;
  showAdminControls: boolean;
  showNotesPanel: boolean;
  showBadgesPanel: boolean;
  showAuditTrail: boolean;
  showAssignmentPanel: boolean;
  selectedDocument: DocumentItem | null;
  confirmAction: {
    type: string;
    title: string;
    message: string;
    requireReason: boolean;
    onConfirm: (reason?: string) => void;
  } | null;
}
