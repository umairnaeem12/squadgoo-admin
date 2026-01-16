"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import type { StaffRoleKey } from "@/types/staff-dashboard";

type StaffRoleConfig = {
  label: string;
  description: string;
  allowedPaths: string[];
  departments: string[];
  duties: string[];
};

type StaffRoleContextValue = {
  role: StaffRoleKey;
  setRole: (role: StaffRoleKey) => void;
  config: StaffRoleConfig;
  allowedPaths: string[];
  canAccessPath: (path: string) => boolean;
  roleOptions: Array<{ value: StaffRoleKey; label: string; description: string }>;
};

const normalizePath = (path: string) => {
  const clean = path.split("?")[0]?.split("#")[0] ?? path;
  if (!clean.startsWith("/")) {
    return `/${clean}`;
  }
  return clean;
};

const roleConfigs: Record<StaffRoleKey, StaffRoleConfig> = {
  "customer-support": {
    label: "Customer support",
    description: "Handles live chat, tickets, and quick recoveries.",
    allowedPaths: [
      "/",
      "/MyTask",
      "/support-tickets",
      "/AdminChat",
      "/InternalChat",
      "/Notifications",
      "/CustomerService",
      "/JobseekerDirectory",
      "/RecruiterDirectory",
      "/DisputeResolution",
      "/DisputeChat",
    ],
    departments: ["Customer Ops", "Frontline Support"],
    duties: ["Live chat queue", "Ticket triage", "Recovery follow-ups"],
  },
  "recruiter-support": {
    label: "Recruiter support",
    description: "Keeps recruiter side unblocked and manages job health.",
    allowedPaths: [
      "/",
      "/MyTask",
      "/ApplicationsReview",
      "/support-tickets",
      "/AdminChat",
      "/InternalChat",
      "/Notifications",
      "/RecruiterDirectory",
      "/JobseekerDirectory",
      "/JobPostManagement",
      "/MatchingEngines",
      "/TalentPools",
      "/MarketplaceControl",
      "/CustomerService",
      "/PlansAndPayments",
    ],
    departments: ["Recruiter Success", "Job Health"],
    duties: ["Job activation checks", "Recruiter onboarding", "Callback commitments"],
  },
  "dispute-desk": {
    label: "Dispute resolution",
    description: "Owns mediation, evidence, and SG coin holds.",
    allowedPaths: [
      "/",
      "/MyTask",
      "/support-tickets",
      "/DisputeResolution",
      "/DisputeChat",
      "/AdminWallet",
      "/MarketplaceControl",
      "/AdminChat",
      "/InternalChat",
      "/Notifications",
      "/CustomerService",
    ],
    departments: ["Dispute Desk", "Risk & Wallet"],
    duties: ["Evidence review", "Settlement timers", "Hold/Release decisions"],
  },
  manager: {
    label: "Manager",
    description: "Sets duties, monitors queues, and handles escalations.",
    allowedPaths: [
      "/",
      "/MyTask",
      "/support-tickets",
      "/ApplicationsReview",
      "/DisputeResolution",
      "/DisputeChat",
      "/AdminWallet",
      "/InternalChat",
      "/Notifications",
      "/JobseekerDirectory",
      "/RecruiterDirectory",
      "/JobPostManagement",
      "/MatchingEngines",
      "/TalentPools",
      "/MarketplaceControl",
      "/PlansAndPayments",
      "/PlatformControls",
      "/CRM",
      "/SecuritySettings",
    ],
    departments: ["Support", "Disputes", "Recruiter Ops"],
    duties: ["Shift assignments", "Escalation routing", "Quality reviews"],
  },
  "super-admin": {
    label: "Super admin",
    description: "Full visibility plus platform-level controls.",
    allowedPaths: [
      "/",
      "/super-admin-dashboard",
      "/MyTask",
      "/support-tickets",
      "/ApplicationsReview",
      "/DisputeResolution",
      "/DisputeChat",
      "/AdminWallet",
      "/InternalChat",
      "/Notifications",
      "/JobseekerDirectory",
      "/RecruiterDirectory",
      "/JobPostManagement",
      "/MatchingEngines",
      "/TalentPools",
      "/MarketplaceControl",
      "/PlansAndPayments",
      "/PlatformControls",
      "/CRM",
      "/SecuritySettings",
      "/AdminPanelControl",
      "/ATOReports",
      "/CustomerService",
      "/GroupManagement",
      "/blank",
    ],
    departments: ["All departments"],
    duties: ["Feature toggles", "Role visibility", "Exports and compliance"],
  },
};

const StaffRoleContext = createContext<StaffRoleContextValue | undefined>(
  undefined
);

export const StaffRoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<StaffRoleKey>("customer-support");

  const config = roleConfigs[role];
  const allowedPaths = useMemo(
    () => config.allowedPaths.map(normalizePath),
    [config.allowedPaths]
  );
  const allowedSet = useMemo(
    () => new Set(allowedPaths),
    [allowedPaths]
  );

  const canAccessPath = useCallback(
    (path: string) => allowedSet.has(normalizePath(path)),
    [allowedSet]
  );

  const roleOptions = useMemo(
    () =>
      (Object.keys(roleConfigs) as StaffRoleKey[]).map((value) => ({
        value,
        label: roleConfigs[value].label,
        description: roleConfigs[value].description,
      })),
    []
  );

  return (
    <StaffRoleContext.Provider
      value={{
        role,
        setRole,
        config,
        allowedPaths,
        canAccessPath,
        roleOptions,
      }}
    >
      {children}
    </StaffRoleContext.Provider>
  );
};

export const useStaffRole = () => {
  const context = useContext(StaffRoleContext);
  if (!context) {
    throw new Error("useStaffRole must be used within a StaffRoleProvider");
  }
  return context;
};
