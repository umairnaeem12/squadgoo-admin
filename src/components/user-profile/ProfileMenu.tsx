"use client";

import React from "react";
import { 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Globe, 
  Shield, 
  Award, 
  Building, 
  Share2, 
  Lock,
  File,
  Briefcase,
  Calendar,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { SectionKey, VerificationStatus } from "@/types/admin-profile";

interface MenuItem {
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
  status?: VerificationStatus;
  isEnabled: boolean;
}

interface ProfileMenuProps {
  userType: "jobseeker" | "recruiter" | "staff";
  activeSection: SectionKey | null;
  onSectionClick: (key: SectionKey) => void;
  sectionStatuses?: Record<string, VerificationStatus>;
}

const StatusIndicator = ({ status }: { status?: VerificationStatus }) => {
  if (!status) return null;

  const colors = {
    verified: "bg-green-500",
    pending: "bg-yellow-500",
    submitted: "bg-blue-500",
    rejected: "bg-red-500",
    incomplete: "bg-gray-400",
  };

  return (
    <div className={`h-2 w-2 rounded-full ${colors[status]}`} title={status} />
  );
};

export default function ProfileMenu({
  userType,
  activeSection,
  onSectionClick,
  sectionStatuses = {},
}: ProfileMenuProps) {
  // Define menu items based on user type
  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      {
        key: "basic",
        label: "Basic details",
        icon: <User className="h-5 w-5" />,
        status: sectionStatuses.basic,
        isEnabled: true,
      },
      {
        key: "address",
        label: "Address",
        icon: <MapPin className="h-5 w-5" />,
        status: sectionStatuses.address,
        isEnabled: true,
      },
      {
        key: "contact",
        label: "Contact details",
        icon: <Phone className="h-5 w-5" />,
        status: sectionStatuses.contact,
        isEnabled: true,
      },
    ];

    if (userType === "jobseeker") {
      return [
        ...commonItems,
        {
          key: "experience",
          label: "Experience",
          icon: <Briefcase className="h-5 w-5" />,
          status: sectionStatuses.experience,
          isEnabled: true,
        },
        {
          key: "education",
          label: "Education",
          icon: <Award className="h-5 w-5" />,
          status: sectionStatuses.education,
          isEnabled: true,
        },
        {
          key: "preferences",
          label: "Preferences",
          icon: <FileText className="h-5 w-5" />,
          status: sectionStatuses.preferences,
          isEnabled: true,
        },
        {
          key: "tax",
          label: "Tax information",
          icon: <FileText className="h-5 w-5" />,
          status: sectionStatuses.tax,
          isEnabled: true,
        },
        {
          key: "visa",
          label: "Visa details",
          icon: <Globe className="h-5 w-5" />,
          status: sectionStatuses.visa,
          isEnabled: true,
        },
        {
          key: "kyc",
          label: "KYC & KYB verifications",
          icon: <Shield className="h-5 w-5" />,
          status: sectionStatuses.kyc,
          isEnabled: true,
        },
        {
          key: "qualifications",
          label: "Extra job qualifications",
          icon: <Award className="h-5 w-5" />,
          status: sectionStatuses.qualifications,
          isEnabled: true,
        },
        {
          key: "documents",
          label: "Documents",
          icon: <File className="h-5 w-5" />,
          status: sectionStatuses.documents,
          isEnabled: true,
        },
        {
          key: "history",
          label: "Job history",
          icon: <Calendar className="h-5 w-5" />,
          isEnabled: true,
        },
        {
          key: "chats",
          label: "Conversations",
          icon: <MessageSquare className="h-5 w-5" />,
          isEnabled: true,
        },
        {
          key: "social",
          label: "Social media",
          icon: <Share2 className="h-5 w-5" />,
          status: sectionStatuses.social,
          isEnabled: true,
        },
        {
          key: "password",
          label: "Password",
          icon: <Lock className="h-5 w-5" />,
          isEnabled: true,
        },
      ];
    }

    if (userType === "recruiter") {
      return [
        ...commonItems,
        {
          key: "company",
          label: "Company details",
          icon: <Building className="h-5 w-5" />,
          status: sectionStatuses.company,
          isEnabled: true,
        },
        {
          key: "tax",
          label: "Tax information",
          icon: <FileText className="h-5 w-5" />,
          status: sectionStatuses.tax,
          isEnabled: true,
        },
        {
          key: "kyb",
          label: "KYC & KYB verifications",
          icon: <Shield className="h-5 w-5" />,
          status: sectionStatuses.kyb,
          isEnabled: true,
        },
        {
          key: "documents",
          label: "Documents",
          icon: <File className="h-5 w-5" />,
          status: sectionStatuses.documents,
          isEnabled: true,
        },
        {
          key: "history",
          label: "Job postings",
          icon: <Calendar className="h-5 w-5" />,
          isEnabled: true,
        },
        {
          key: "chats",
          label: "Conversations",
          icon: <MessageSquare className="h-5 w-5" />,
          isEnabled: true,
        },
        {
          key: "social",
          label: "Social media",
          icon: <Share2 className="h-5 w-5" />,
          status: sectionStatuses.social,
          isEnabled: true,
        },
        {
          key: "password",
          label: "Password",
          icon: <Lock className="h-5 w-5" />,
          isEnabled: true,
        },
      ];
    }

    // Staff profile menu
    return [
      ...commonItems,
      {
        key: "documents",
        label: "Documents",
        icon: <File className="h-5 w-5" />,
        status: sectionStatuses.documents,
        isEnabled: true,
      },
      {
        key: "password",
        label: "Password",
        icon: <Lock className="h-5 w-5" />,
        isEnabled: true,
      },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="rounded-xl bg-white shadow dark:bg-gray-800">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => item.isEnabled && onSectionClick(item.key)}
            disabled={!item.isEnabled}
            className={`
              flex w-full items-center justify-between px-6 py-4 text-left transition-colors
              ${item.isEnabled ? "hover:bg-gray-50 dark:hover:bg-gray-700/50" : "cursor-not-allowed opacity-50"}
              ${activeSection === item.key ? "bg-purple-50 dark:bg-purple-900/20" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`text-gray-600 dark:text-gray-400 ${activeSection === item.key ? "text-purple-600 dark:text-purple-400" : ""}`}>
                {item.icon}
              </div>
              <span className={`font-medium ${activeSection === item.key ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"}`}>
                {item.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusIndicator status={item.status} />
              <ChevronRight className={`h-5 w-5 text-gray-400 ${activeSection === item.key ? "text-purple-600 dark:text-purple-400" : ""}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
