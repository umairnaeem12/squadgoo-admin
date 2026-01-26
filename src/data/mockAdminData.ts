import type {
  AdminUser,
  UserProfile,
  WalletCase,
  KYCCase,
  Ticket,
  DashboardStats,
  ChatConversation,
  DepartmentConfig,
  Department,
} from "@/types/admin-system";

// Department Configurations
export const DEPARTMENTS: DepartmentConfig[] = [
  {
    id: "wallet",
    name: "Wallet Department",
    description: "Handles all wallet, payment, and transaction operations",
    defaultMenus: ["dashboard", "wallet", "profile_viewer"],
    defaultActions: [
      "can_assign_task",
      "can_transfer_task",
      "can_verify_bank",
      "can_approve_wallet_transaction",
      "can_hold_wallet_transaction",
      "can_add_internal_notes",
    ],
  },
  {
    id: "kyc",
    name: "KYC Department",
    description: "Handles identity verification and KYC reviews",
    defaultMenus: ["dashboard", "kyc", "profile_viewer"],
    defaultActions: [
      "can_assign_task",
      "can_transfer_task",
      "can_approve_kyc",
      "can_reject_kyc",
      "can_add_internal_notes",
    ],
  },
  {
    id: "customer_service",
    name: "Customer Service",
    description: "Handles tickets, support, and general inquiries",
    defaultMenus: ["dashboard", "tickets", "jobseekers", "recruiters", "profile_viewer"],
    defaultActions: [
      "can_assign_task",
      "can_transfer_task",
      "can_resolve_ticket",
      "can_view_user_chats",
      "can_add_internal_notes",
    ],
  },
  {
    id: "reports_moderation",
    name: "Reports & Moderation",
    description: "Handles content reports and moderation",
    defaultMenus: ["dashboard", "reports", "chat_reports", "tickets", "profile_viewer"],
    defaultActions: [
      "can_assign_task",
      "can_transfer_task",
      "can_moderate_chat_reports",
      "can_suspend_user",
      "can_add_internal_notes",
    ],
  },
  {
    id: "verification",
    name: "Verification Department",
    description: "Handles account verification and badges",
    defaultMenus: ["dashboard", "jobseekers", "recruiters", "profile_viewer"],
    defaultActions: ["can_add_badge", "can_add_internal_notes"],
  },
];

// Seed initial admin users
export const seedAdminUsers = (): AdminUser[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "admin-1",
      name: "Super Admin",
      email: "super@admin.com",
      password: "super123",
      role: "super_admin",
      departments: ["wallet", "kyc", "customer_service", "reports_moderation", "verification"],
      menuPermissions: [
        "dashboard",
        "wallet",
        "kyc",
        "jobseekers",
        "recruiters",
        "tickets",
        "reports",
        "chat_reports",
        "internal_chat",
        "profile_viewer",
      ],
      actionPermissions: [
        "can_assign_task",
        "can_transfer_task",
        "can_resolve_ticket",
        "can_view_user_chats",
        "can_moderate_chat_reports",
        "can_approve_kyc",
        "can_reject_kyc",
        "can_verify_bank",
        "can_approve_wallet_transaction",
        "can_hold_wallet_transaction",
        "can_suspend_user",
        "can_add_internal_notes",
        "can_edit_profile_documents",
        "can_add_badge",
      ],
      isActive: true,
      createdAt: now,
      createdBy: "system",
    },
    {
      id: "admin-2",
      name: "John Admin",
      email: "john@admin.com",
      password: "admin123",
      role: "admin",
      departments: ["wallet", "kyc"],
      menuPermissions: ["dashboard", "wallet", "kyc", "profile_viewer"],
      actionPermissions: [
        "can_assign_task",
        "can_transfer_task",
        "can_approve_kyc",
        "can_reject_kyc",
        "can_verify_bank",
        "can_approve_wallet_transaction",
        "can_hold_wallet_transaction",
        "can_add_internal_notes",
      ],
      isActive: true,
      createdAt: now,
      createdBy: "admin-1",
    },
    {
      id: "admin-3",
      name: "Manager Account",
      email: "manager@admin.com",
      password: "manager123",
      role: "manager",
      departments: ["customer_service"],
      menuPermissions: ["dashboard", "tickets", "jobseekers", "recruiters", "profile_viewer"],
      actionPermissions: [
        "can_assign_task",
        "can_transfer_task",
        "can_resolve_ticket",
        "can_view_user_chats",
        "can_add_internal_notes",
      ],
      isActive: true,
      createdAt: now,
      createdBy: "admin-1",
    },
    {
      id: "admin-4",
      name: "Staff Account",
      email: "staff@admin.com",
      password: "staff123",
      role: "staff",
      departments: ["customer_service"],
      menuPermissions: ["dashboard", "tickets", "profile_viewer"],
      actionPermissions: ["can_add_internal_notes"],
      isActive: true,
      createdAt: now,
      createdBy: "admin-3",
    },
  ];
};

// Seed user profiles
export const seedUserProfiles = (): UserProfile[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "user-1",
      role: "jobseeker",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1234567890",
      status: "active",
      kycStatus: "verified",
      walletBalance: 5000,
      hasIssues: false,
      issueTypes: [],
      documents: [
        {
          id: "doc-1",
          type: "id_card",
          url: "/uploads/id-alice.jpg",
          uploadedAt: now,
          status: "approved",
        },
      ],
      badges: [
        {
          id: "badge-1",
          type: "verified",
          label: "Verified",
          addedBy: "admin-1",
          addedAt: now,
        },
      ],
      internalNotes: [],
      createdAt: now,
      lastActivity: now,
    },
    {
      id: "user-2",
      role: "recruiter",
      name: "Bob Smith",
      email: "bob@company.com",
      phone: "+1234567891",
      status: "active",
      kycStatus: "pending_review",
      walletBalance: 15000,
      hasIssues: true,
      issueTypes: ["KYC Review", "Bank Verification"],
      documents: [
        {
          id: "doc-2",
          type: "business_license",
          url: "/uploads/license-bob.pdf",
          uploadedAt: now,
          status: "pending",
        },
      ],
      badges: [],
      internalNotes: [
        {
          id: "note-1",
          content: "Need to verify business registration",
          addedBy: "admin-2",
          addedAt: now,
          isImportant: true,
        },
      ],
      createdAt: now,
      lastActivity: now,
    },
    {
      id: "user-3",
      role: "jobseeker",
      name: "Carol White",
      email: "carol@example.com",
      phone: "+1234567892",
      status: "active",
      kycStatus: "rejected",
      walletBalance: 0,
      hasIssues: true,
      issueTypes: ["KYC Rejected"],
      documents: [
        {
          id: "doc-3",
          type: "passport",
          url: "/uploads/passport-carol.jpg",
          uploadedAt: now,
          status: "rejected",
        },
      ],
      badges: [],
      internalNotes: [
        {
          id: "note-2",
          content: "Document image too blurry, requested resubmission",
          addedBy: "admin-2",
          addedAt: now,
          isImportant: false,
        },
      ],
      createdAt: now,
      lastActivity: now,
    },
    {
      id: "user-4",
      role: "recruiter",
      name: "David Brown",
      email: "david@tech.com",
      phone: "+1234567893",
      status: "suspended",
      kycStatus: "verified",
      walletBalance: 25000,
      hasIssues: true,
      issueTypes: ["Account Suspended", "Pending Transaction"],
      documents: [
        {
          id: "doc-4",
          type: "business_license",
          url: "/uploads/license-david.pdf",
          uploadedAt: now,
          status: "approved",
        },
      ],
      badges: [
        {
          id: "badge-2",
          type: "flagged",
          label: "Flagged for Review",
          addedBy: "admin-1",
          addedAt: now,
        },
      ],
      internalNotes: [
        {
          id: "note-3",
          content: "Multiple reports received. Investigating suspicious activity.",
          addedBy: "admin-1",
          addedAt: now,
          isImportant: true,
        },
      ],
      createdAt: now,
      lastActivity: now,
    },
    {
      id: "user-5",
      role: "jobseeker",
      name: "Eva Green",
      email: "eva@example.com",
      phone: "+1234567894",
      status: "pending_verification",
      kycStatus: "pending_review",
      walletBalance: 1200,
      hasIssues: true,
      issueTypes: ["KYC Review"],
      documents: [
        {
          id: "doc-5",
          type: "id_card",
          url: "/uploads/id-eva.jpg",
          uploadedAt: now,
          status: "pending",
        },
      ],
      badges: [],
      internalNotes: [],
      createdAt: now,
      lastActivity: now,
    },
  ];
};

// Seed wallet cases
export const seedWalletCases = (): WalletCase[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "wallet-1",
      userId: "user-2",
      userRole: "recruiter",
      userName: "Bob Smith",
      issueType: "bank_verification",
      amount: 5000,
      status: "pending",
      priority: "high",
      assignedTo: null,
      description: "First-time withdrawal requires bank account verification",
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-1",
          action: "Case Created",
          performedBy: "system",
          performedAt: now,
          details: "Automatic bank verification required for first withdrawal",
        },
      ],
    },
    {
      id: "wallet-2",
      userId: "user-4",
      userRole: "recruiter",
      userName: "David Brown",
      issueType: "wallet_hold",
      amount: 10000,
      status: "in_review",
      priority: "urgent",
      assignedTo: "admin-2",
      description: "Wallet placed on hold due to suspicious activity reports",
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-2",
          action: "Case Created",
          performedBy: "system",
          performedAt: now,
          details: "Automatic hold placed due to reports",
        },
        {
          id: "log-3",
          action: "Assigned",
          performedBy: "admin-1",
          performedAt: now,
          details: "Assigned to John Admin for review",
        },
      ],
    },
    {
      id: "wallet-3",
      userId: "user-5",
      userRole: "jobseeker",
      userName: "Eva Green",
      issueType: "pending_transaction",
      amount: 500,
      status: "pending",
      priority: "medium",
      assignedTo: null,
      description: "Transaction pending verification",
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-4",
          action: "Case Created",
          performedBy: "system",
          performedAt: now,
          details: "Transaction requires manual verification",
        },
      ],
    },
  ];
};

// Seed KYC cases
export const seedKYCCases = (): KYCCase[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "kyc-1",
      userId: "user-2",
      userRole: "recruiter",
      userName: "Bob Smith",
      status: "pending_review",
      issueType: "missing_information",
      documents: [
        {
          id: "doc-2",
          type: "business_license",
          url: "/uploads/license-bob.pdf",
          uploadedAt: now,
          status: "pending",
        },
      ],
      assignedTo: null,
      submittedAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-5",
          action: "KYC Submitted",
          performedBy: "user-2",
          performedAt: now,
          details: "Business license uploaded for review",
        },
      ],
    },
    {
      id: "kyc-2",
      userId: "user-3",
      userRole: "jobseeker",
      userName: "Carol White",
      status: "rejected",
      issueType: "document_unclear",
      documents: [
        {
          id: "doc-3",
          type: "passport",
          url: "/uploads/passport-carol.jpg",
          uploadedAt: now,
          status: "rejected",
        },
      ],
      assignedTo: "admin-2",
      submittedAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-6",
          action: "KYC Submitted",
          performedBy: "user-3",
          performedAt: now,
          details: "Passport uploaded for review",
        },
        {
          id: "log-7",
          action: "Rejected",
          performedBy: "admin-2",
          performedAt: now,
          details: "Document image too blurry. Requested resubmission.",
        },
      ],
    },
    {
      id: "kyc-3",
      userId: "user-5",
      userRole: "jobseeker",
      userName: "Eva Green",
      status: "pending_review",
      issueType: null,
      documents: [
        {
          id: "doc-5",
          type: "id_card",
          url: "/uploads/id-eva.jpg",
          uploadedAt: now,
          status: "pending",
        },
      ],
      assignedTo: null,
      submittedAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-8",
          action: "KYC Submitted",
          performedBy: "user-5",
          performedAt: now,
          details: "ID card uploaded for verification",
        },
      ],
    },
  ];
};

// Seed tickets
export const seedTickets = (): Ticket[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "ticket-1",
      type: "chat_report",
      reporterId: "user-1",
      reporterName: "Alice Johnson",
      reportedUserId: "user-4",
      reportedUserName: "David Brown",
      subject: "Inappropriate messages in chat",
      description: "User sent harassing messages during job discussion",
      status: "open",
      priority: "high",
      assignedTo: null,
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-9",
          action: "Ticket Created",
          performedBy: "user-1",
          performedAt: now,
          details: "Chat reported for inappropriate content",
        },
      ],
      relatedContent: {
        type: "chat",
        id: "chat-1",
      },
    },
    {
      id: "ticket-2",
      type: "general_support",
      reporterId: "user-2",
      reporterName: "Bob Smith",
      reportedUserId: null,
      reportedUserName: null,
      subject: "Cannot withdraw funds",
      description: "Withdrawal button is not working for the past 2 days",
      status: "assigned",
      priority: "medium",
      assignedTo: "admin-3",
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-10",
          action: "Ticket Created",
          performedBy: "user-2",
          performedAt: now,
          details: "Support ticket for withdrawal issue",
        },
        {
          id: "log-11",
          action: "Assigned",
          performedBy: "admin-3",
          performedAt: now,
          details: "Assigned to Sarah Manager",
        },
      ],
    },
    {
      id: "ticket-3",
      type: "account_report",
      reporterId: "user-3",
      reporterName: "Carol White",
      reportedUserId: "user-4",
      reportedUserName: "David Brown",
      subject: "Fake job posting",
      description: "This recruiter posted a fake job and is asking for money",
      status: "in_progress",
      priority: "urgent",
      assignedTo: "admin-1",
      createdAt: now,
      updatedAt: now,
      activityLog: [
        {
          id: "log-12",
          action: "Ticket Created",
          performedBy: "user-3",
          performedAt: now,
          details: "Account reported for fraudulent activity",
        },
        {
          id: "log-13",
          action: "Assigned",
          performedBy: "admin-1",
          performedAt: now,
          details: "Super Admin taking ownership",
        },
        {
          id: "log-14",
          action: "Status Updated",
          performedBy: "admin-1",
          performedAt: now,
          details: "Investigating reported account",
        },
      ],
    },
  ];
};

// Seed chat conversations
export const seedChatConversations = (): ChatConversation[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "chat-1",
      participants: [
        { id: "user-1", name: "Alice Johnson", role: "jobseeker" },
        { id: "user-4", name: "David Brown", role: "recruiter" },
      ],
      lastMessage: "This is inappropriate behavior",
      lastMessageAt: now,
      isReported: true,
      messages: [
        {
          id: "msg-1",
          senderId: "user-4",
          senderName: "David Brown",
          content: "Hello, are you interested in the job?",
          timestamp: now,
          isReported: false,
        },
        {
          id: "msg-2",
          senderId: "user-1",
          senderName: "Alice Johnson",
          content: "Yes, can you share more details?",
          timestamp: now,
          isReported: false,
        },
        {
          id: "msg-3",
          senderId: "user-4",
          senderName: "David Brown",
          content: "This is inappropriate behavior",
          timestamp: now,
          isReported: true,
        },
      ],
    },
  ];
};

// Initialize all data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem("dataInitialized")) {
    localStorage.setItem("adminUsers", JSON.stringify(seedAdminUsers()));
    localStorage.setItem("userProfiles", JSON.stringify(seedUserProfiles()));
    localStorage.setItem("walletCases", JSON.stringify(seedWalletCases()));
    localStorage.setItem("kycCases", JSON.stringify(seedKYCCases()));
    localStorage.setItem("tickets", JSON.stringify(seedTickets()));
    localStorage.setItem("chatConversations", JSON.stringify(seedChatConversations()));
    localStorage.setItem("tasks", JSON.stringify([])); // Start with empty tasks
    localStorage.setItem("auditLogs", JSON.stringify([])); // Start with empty audit logs
    localStorage.setItem("dataInitialized", "true");
    console.log("✅ Mock data initialized successfully");
  }
};

// Get dashboard stats
export const getDashboardStats = (adminId: string): DashboardStats => {
  const walletCases: WalletCase[] = JSON.parse(localStorage.getItem("walletCases") || "[]");
  const kycCases: KYCCase[] = JSON.parse(localStorage.getItem("kycCases") || "[]");
  const tickets: Ticket[] = JSON.parse(localStorage.getItem("tickets") || "[]");
  const userProfiles: UserProfile[] = JSON.parse(localStorage.getItem("userProfiles") || "[]");

  return {
    pendingWalletCases: walletCases.filter((c) => c.status === "pending").length,
    pendingKYCCases: kycCases.filter((c) => c.status === "pending_review").length,
    openTickets: tickets.filter((t) => t.status === "open" || t.status === "assigned").length,
    assignedToMe: [
      ...walletCases.filter((c) => c.assignedTo === adminId),
      ...kycCases.filter((c) => c.assignedTo === adminId),
      ...tickets.filter((t) => t.assignedTo === adminId),
    ].length,
    urgentItems: [
      ...walletCases.filter((c) => c.priority === "urgent"),
      ...tickets.filter((t) => t.priority === "urgent"),
    ].length,
    totalUsers: userProfiles.length,
  };
};
