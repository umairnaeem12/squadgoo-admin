"use client";

import type { StaffNote } from "@/types/user-management";

export type AdminProfileSection = {
  key: string;
  title: string;
  verified: boolean;
  fields: { label: string; value: string | number; hint?: string }[];
};

export type AdminDocument = {
  name: string;
  status: "pending" | "submitted" | "verified";
  lastUpdated?: string;
};

export type AdminProfileRecord = {
  userId: string;
  userType: "jobseeker" | "recruiter" | "individual" | "squad";
  name: string;
  role: string;
  status: string;
  kycStatus?: string;
  location?: string;
  avatar?: string;
  badges: string[];
  sections: AdminProfileSection[];
  offers?: {
    active: string[];
    accepted: string[];
    expired: string[];
  };
  members?: { name: string; role: string; scope: string }[];
  activitySummary?: string;
  acceptanceRating?: number;
  autoSuspendedUntil?: string | null;
  documents?: AdminDocument[];
};

export type StaffActivity = StaffNote & {
  title: string;
  category:
    | "status"
    | "badge"
    | "verification"
    | "chat"
    | "ticket"
    | "kyc"
    | "callback"
    | "system";
  link?: string;
};

export type SupportSummary = {
  ticketsOpened: number;
  ticketsClosed: number;
  ticketsPending: number;
  activeChats: number;
  closedChats: number;
};

const baseNotes = (userId: string): StaffActivity[] => [
  {
    id: "note-001",
    action: "Account created",
    reason: "User self-registered via mobile app",
    staffId: "system",
    staffName: "System",
    timestamp: "2025-02-01T09:20:00Z",
    category: "system",
    title: "Account created",
    link: `/support-tickets?user=${userId}`,
  },
  {
    id: "note-002",
    action: "KYC verified",
    reason: "Document match + selfie verified",
    staffId: "kyc-14",
    staffName: "KYC Desk",
    timestamp: "2025-02-03T14:05:00Z",
    category: "kyc",
    title: "KYC verification",
  },
  {
    id: "note-003",
    action: "Badge assigned",
    reason: "High SLA over last 45 days",
    staffId: "staff-022",
    staffName: "Ops Admin",
    timestamp: "2025-02-12T08:10:00Z",
    category: "badge",
    title: "Badge: Consistent Performer",
  },
  {
    id: "note-004",
    action: "Chat initiated",
    reason: "Support follow-up on pending ticket 2391",
    staffId: "staff-031",
    staffName: "CS Supervisor",
    timestamp: "2025-02-18T18:36:00Z",
    category: "chat",
    title: "Live chat follow-up",
    link: `/AdminChat?ticket=2391&mode=history`,
  },
];

export const baseSupportSummary: SupportSummary = {
  ticketsOpened: 12,
  ticketsClosed: 9,
  ticketsPending: 3,
  activeChats: 2,
  closedChats: 11,
};

export const buildProfileSeed = (
  userType: AdminProfileRecord["userType"],
  userId: string
): AdminProfileRecord => {
  if (userType === "jobseeker") {
    return {
      userId,
      userType,
      name: "Ayesha Khan",
      role: "Frontend Developer",
      status: "active",
      kycStatus: "verified",
      location: "Karachi, Pakistan",
      avatar: "/images/user/owner.jpg",
      badges: ["Top Verified", "Labor Pool Lead"],
      acceptanceRating: 86,
      autoSuspendedUntil: null,
      documents: [
        { name: "Resume / CV", status: "submitted", lastUpdated: "2025-01-20T10:00:00Z" },
        { name: "National ID", status: "verified", lastUpdated: "2025-02-03T19:05:00Z" },
        { name: "Police check", status: "pending" },
      ],
      sections: [
        {
          key: "basic",
          title: "Basic details",
          verified: true,
          fields: [
            { label: "Email", value: "ayesha.khan@example.com" },
            { label: "Phone", value: "+92 300 1234567" },
            { label: "Current location", value: "Karachi, PK" },
          ],
        },
        {
          key: "experience",
          title: "Experience",
          verified: true,
          fields: [
            { label: "Role", value: "Frontend Developer" },
            { label: "Total experience", value: "4.5 years" },
            { label: "Skills", value: "React, Next.js, TypeScript, Tailwind" },
          ],
        },
        {
          key: "education",
          title: "Education",
          verified: false,
          fields: [
            { label: "Degree", value: "BS Computer Science" },
            { label: "Institute", value: "NED University" },
            { label: "Graduation", value: "2019" },
          ],
        },
        {
          key: "preferences",
          title: "Preferences",
          verified: false,
          fields: [
            { label: "Availability", value: "Immediate" },
            { label: "Work type", value: "Hybrid" },
            { label: "Salary range", value: "$70k - $85k" },
          ],
        },
        {
          key: "kyc",
          title: "KYC",
          verified: true,
          fields: [
            { label: "Status", value: "Verified" },
            { label: "Document", value: "National ID + selfie match" },
          ],
        },
        {
          key: "tax",
          title: "Tax info",
          verified: false,
          fields: [
            { label: "TFN", value: "Submitted" },
            { label: "ABN", value: "Pending" },
          ],
        },
      ],
      offers: {
        active: ["Offer #2319 (82% match)", "Offer #2320 (78% match)"],
        accepted: ["Offer #2204 (Quick hire)"],
        expired: ["Offer #2199", "Offer #2177"],
      },
    };
  }

  if (userType === "recruiter") {
    return {
      userId,
      userType,
      name: "Olivia Martin",
      role: "Recruiter - Shehroz Motors",
      status: "active",
      kycStatus: "verified",
      location: "Sydney, Australia",
      badges: ["Trusted Partner"],
      documents: [
        { name: "Company registration", status: "verified" },
        { name: "Business license", status: "submitted" },
        { name: "Director ID", status: "pending" },
      ],
      sections: [
        {
          key: "company",
          title: "Company",
          verified: true,
          fields: [
            { label: "Company", value: "Shehroz Motors" },
            { label: "Industry", value: "Automotive" },
            { label: "Company size", value: "201-500" },
          ],
        },
        {
          key: "offers",
          title: "Job offers",
          verified: true,
          fields: [
            { label: "Active offers", value: "14 live roles" },
            { label: "Closed offers", value: "32" },
            { label: "Expired offers", value: "4" },
          ],
        },
        {
          key: "jobs",
          title: "Job post details",
          verified: true,
          fields: [
            { label: "Latest job", value: "Senior Frontend Engineer" },
            { label: "Method", value: "Quick + Manual" },
            { label: "Budget", value: "SG 2,500" },
            { label: "Last updated", value: "Feb 10, 3:15 PM" },
          ],
        },
        {
          key: "hiring",
          title: "Hiring methods",
          verified: true,
          fields: [
            { label: "Quick", value: "Enabled" },
            { label: "Manual", value: "Enabled" },
            { label: "Budget", value: "SG 2,500" },
          ],
        },
        {
          key: "kyb",
          title: "KYB",
          verified: true,
          fields: [
            { label: "ABN", value: "82 345 908 122" },
            { label: "KYB status", value: "Verified" },
          ],
        },
      ],
    };
  }

  if (userType === "squad") {
    return {
      userId,
      userType,
      name: "Squad Courier #118",
      role: "Squad Leader",
      status: "active",
      kycStatus: "verified",
      location: "Melbourne, Australia",
      badges: ["Courier Prime"],
      documents: [
        { name: "Leader ID", status: "verified" },
        { name: "Insurance", status: "submitted" },
      ],
      sections: [
        {
          key: "squad",
          title: "Squad details",
          verified: true,
          fields: [
            { label: "Squad name", value: "Metro Express" },
            { label: "Category", value: "Courier / Delivery" },
            { label: "Jobs applied", value: 28 },
          ],
        },
        {
          key: "activity",
          title: "Activity summary",
          verified: true,
          fields: [
            { label: "Completed jobs", value: 122 },
            { label: "Disputes", value: "1 (resolved)" },
            { label: "Last active", value: "2h ago" },
          ],
        },
      ],
      members: [
        { name: "Hina Noor", role: "Lead courier", scope: "Can accept jobs" },
        { name: "Ravi Kumar", role: "Support", scope: "Documents only" },
        { name: "Marcus Lee", role: "Backup", scope: "View access" },
      ],
    };
  }

  return {
    userId,
    userType: "individual",
    name: "Mia Collins",
    role: "Individual customer",
    status: "active",
    kycStatus: "pending",
    location: "Perth, Australia",
    badges: [],
    documents: [
      { name: "Identity document", status: "pending" },
      { name: "Address proof", status: "pending" },
    ],
    sections: [
      {
        key: "profile",
        title: "Profile",
        verified: false,
        fields: [
          { label: "Email", value: "mia.collins@example.com" },
          { label: "Phone", value: "+61 412 398 204" },
          { label: "Location", value: "Perth, WA" },
        ],
      },
      {
        key: "services",
        title: "Services",
        verified: false,
        fields: [
          { label: "Preferred services", value: "Courier, cleaning" },
          { label: "Budget", value: "SG 600 / month" },
          { label: "Engagement", value: "5 active gigs" },
        ],
      },
    ],
  };
};

export const buildNotes = (userId: string) => baseNotes(userId);
