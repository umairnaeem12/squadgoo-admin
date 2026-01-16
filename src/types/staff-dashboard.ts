export type StaffRoleKey =
  | "customer-support"
  | "recruiter-support"
  | "dispute-desk"
  | "manager"
  | "super-admin";

export type StaffPriority = "high" | "medium" | "low";

export interface StaffOverviewItem {
  id: string;
  label: string;
  count: number;
  href: string;
  priority: StaffPriority;
  desc?: string;
}

export interface StaffTransferItem {
  id: string;
  title: string;
  from: string;
  transferredAt: string;
  lastResponseMinutes: number;
  href: string;
  type: "ticket" | "chat" | "dispute";
  priority: StaffPriority;
  note?: string;
}

export interface StaffChatQueueItem {
  id: string;
  customer: string;
  status: "open" | "pending" | "transferred";
  waitMinutes: number;
  href: string;
  priority: StaffPriority;
  channel: "live-chat" | "call";
}

export interface StaffChatSummary {
  open: number;
  pending: number;
  transferred: number;
  items: StaffChatQueueItem[];
}

export interface StaffDepartmentStat {
  id: string;
  name: string;
  newToday: number;
  unresolved: number;
  href?: string;
  info?: string;
}

export interface StaffNotificationItem {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  href: string;
  priority: StaffPriority;
  type: string;
}

export interface StaffDuty {
  id: string;
  label: string;
  detail: string;
  href: string;
  priority?: StaffPriority;
}

export interface StaffFollowUp {
  id: string;
  title: string;
  dueAt: string;
  context: string;
  href: string;
  priority: StaffPriority;
}

export interface StaffAccess {
  menus: string[];
  features: string[];
  departments: string[];
}

export interface StaffDashboardPayload {
  role: StaffRoleKey;
  roleLabel: string;
  shift: string;
  overview: StaffOverviewItem[];
  transfers: StaffTransferItem[];
  liveChats: StaffChatSummary;
  departments: StaffDepartmentStat[];
  notifications: StaffNotificationItem[];
  duties: StaffDuty[];
  followUps: StaffFollowUp[];
  access: StaffAccess;
  updatedAt: string;
  dateLabel: string;
  todayHeadline: string;
}

export type StaffDashboardResponse = StaffDashboardPayload;
