// Admin System Types

export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'audit';

export type Department = 
  | 'wallet'
  | 'kyc'
  | 'customer_service'
  | 'reports_moderation'
  | 'verification';

export type MenuPermission =
  | 'dashboard'
  | 'wallet'
  | 'kyc'
  | 'jobseekers'
  | 'recruiters'
  | 'tickets'
  | 'reports'
  | 'chat_reports'
  | 'internal_chat'
  | 'profile_viewer';

export type ActionPermission =
  | 'can_assign_task'
  | 'can_transfer_task'
  | 'can_resolve_ticket'
  | 'can_view_user_chats'
  | 'can_moderate_chat_reports'
  | 'can_approve_kyc'
  | 'can_reject_kyc'
  | 'can_verify_bank'
  | 'can_approve_wallet_transaction'
  | 'can_hold_wallet_transaction'
  | 'can_suspend_user'
  | 'can_add_internal_notes'
  | 'can_edit_profile_documents'
  | 'can_add_badge';

// Task System Types
export type TaskType = 'ticket' | 'chat_report' | 'kyc' | 'wallet';

export type TaskStatus = 'open' | 'in_progress' | 'resolved';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  summary: string;
  relatedUserId: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
  history: TaskHistoryEntry[];
}

export interface TaskHistoryEntry {
  id: string;
  action: 'created' | 'assigned' | 'transferred' | 'status_changed' | 'note_added';
  performedBy: string;
  performedByName: string;
  details: string;
  timestamp: string;
}

// Audit Log Type
export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'user' | 'permission' | 'task' | 'system';
  performedBy: string;
  performedByName: string;
  details: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // Mock password
  role: AdminRole;
  departments: Department[];
  menuPermissions: MenuPermission[];
  actionPermissions: ActionPermission[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface DepartmentConfig {
  id: Department;
  name: string;
  description: string;
  defaultMenus: MenuPermission[];
  defaultActions: ActionPermission[];
}

// Wallet Operations Types
export type WalletIssueType = 
  | 'pending_transaction'
  | 'bank_verification'
  | 'wallet_hold'
  | 'withdrawal_review'
  | 'deposit_issue';

export interface WalletCase {
  id: string;
  userId: string;
  userRole: 'jobseeker' | 'recruiter';
  userName: string;
  issueType: WalletIssueType;
  amount: number;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLog[];
}

// KYC Operations Types
export type KYCStatus = 
  | 'pending_review'
  | 'rejected'
  | 'resubmitted'
  | 'verified'
  | 'extra_docs_requested';

export type KYCIssueType =
  | 'document_unclear'
  | 'identity_mismatch'
  | 'expired_document'
  | 'missing_information'
  | 'suspicious_activity';

export interface KYCCase {
  id: string;
  userId: string;
  userRole: 'jobseeker' | 'recruiter';
  userName: string;
  status: KYCStatus;
  issueType: KYCIssueType | null;
  documents: KYCDocument[];
  assignedTo: string | null;
  submittedAt: string;
  updatedAt: string;
  activityLog: ActivityLog[];
}

export interface KYCDocument {
  id: string;
  type: 'id_card' | 'passport' | 'drivers_license' | 'utility_bill' | 'business_license';
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// User Profile Types
export interface UserProfile {
  id: string;
  role: 'jobseeker' | 'recruiter';
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending_verification';
  kycStatus: KYCStatus;
  walletBalance: number;
  hasIssues: boolean;
  issueTypes: string[];
  documents: KYCDocument[];
  badges: Badge[];
  internalNotes: InternalNote[];
  createdAt: string;
  lastActivity: string;
}

export interface Badge {
  id: string;
  type: 'verified' | 'premium' | 'warning' | 'vip' | 'flagged';
  label: string;
  addedBy: string;
  addedAt: string;
}

export interface InternalNote {
  id: string;
  content: string;
  addedBy: string;
  addedAt: string;
  isImportant: boolean;
}

// Tickets/Reports Types
export type TicketType = 
  | 'chat_report'
  | 'review_report'
  | 'account_report'
  | 'general_support';

export type TicketStatus = 
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface Ticket {
  id: string;
  type: TicketType;
  reporterId: string;
  reporterName: string;
  reportedUserId: string | null;
  reportedUserName: string | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLog[];
  relatedContent?: {
    type: 'chat' | 'review' | 'profile';
    id: string;
  };
}

// Chat System Types
export interface ChatConversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'jobseeker' | 'recruiter';
  }[];
  lastMessage: string;
  lastMessageAt: string;
  isReported: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isReported: boolean;
}

// Activity Log
export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: string;
}

// Dashboard Stats
export interface DashboardStats {
  pendingWalletCases: number;
  pendingKYCCases: number;
  openTickets: number;
  assignedToMe: number;
  urgentItems: number;
  totalUsers: number;
}
