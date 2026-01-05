// User Management Types

export type UserStatus = "active" | "inactive" | "suspended" | "pending-deletion";
export type UserRole = "jobseeker" | "recruiter" | "individual" | "squad-member";
export type SortDirection = "asc" | "desc";
export type SortField = "name" | "email" | "createdAt" | "status" | "role";

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  avatar?: string;
  location?: string;
  kycStatus: "verified" | "pending" | "rejected";
  verified?: boolean;
  badges?: string[];
}

export interface JobSeeker extends BaseUser {
  role: "jobseeker";
  jobTitle: string;
  experience: string;
  skills: string[];
  resume?: string;
  dateOfBirth?: string;
  bio?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  workType?: string;
  availability?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  tfn?: string;
  abn?: string;
  gstRegistered?: boolean;
  taxResidency?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  resumeUrl?: string;
  policeCheck?: boolean;
  workRights?: string;
  preferences: {
    role: string;
    type: string;
    salary: string;
    availability: string;
    locationPreference: string;
  };
  education: {
    degree: string;
    institute: string;
    year: string;
  };
}

export interface Recruiter extends BaseUser {
  role: "recruiter";
  companyName: string;
  industry: string;
  companySize: string;
  jobsPosted: number;
  verified: boolean;
  description: string;
  companyDescription?: string;
  website?: string;
  foundedYear?: string;
  abn?: string;
  acn?: string;
  gstRegistered?: boolean;
  taxStatus?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  kybStatus?: "verified" | "pending" | "rejected";
  companyRegistration?: string;
  businessLicense?: string;
  companyDetails: {
    businessName: string;
    acn: string;
    businessAddress: string;
    directorName: string;
  };
}

export interface Individual extends BaseUser {
  role: "individual";
  totalGigs: number;
  walletBalance: number;
}

export interface SquadMember extends BaseUser {
  role: "squad-member";
  squadId: string;
  squadName: string;
  squadRole: string;
  expertise: string;
}

export type AnyUser = JobSeeker | Recruiter | Individual | SquadMember;

export interface UserFilters {
  search: string;
  status: UserStatus | "all";
  role: UserRole | "all";
  kycStatus: "verified" | "pending" | "rejected" | "all";
  dateFrom?: string;
  dateTo?: string;
  sortField: SortField;
  sortDirection: SortDirection;
  verified?: boolean;
}

export interface SuspendUserData {
  userId: string;
  reason: string;
  startDate: string;
  endDate: string;
  notifyUser: boolean;
}

export interface DeleteUserData {
  userId: string;
  deletionDate: string; // 30 days from now
  notifyUser: boolean;
}

export interface UserActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "online" | "offline" | "away";
}
