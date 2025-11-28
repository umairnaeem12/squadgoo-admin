"use client";

import ComponentCard from "@/components/common/ComponentCard";

const coreItems = [
  "Dashboard",
  "Jobseekers",
  "Recruiters",
  "Individuals",
  "Squad Accounts",
  "Reports & Reviews",
  "Customer Service",
  "Account Upgrades & Extras",
  "Dispute Resolution Centre",
  "Job Posts",
];

const superAdminItems = [
  "Admin Panel Control",
  "Platform Controls",
  "ATO Reports",
  "CRM",
];

export default function AdminPanelControlPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Panel Control
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        High-level overview of the internal SquadGoo admin panel structure and
        the key levers available to super admins.
      </p>

      <ComponentCard
        title="Menu structure"
        desc="Matches the ADMIN PANNEL section of the SquadGoo product document."
      >
        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Core navigation
            </p>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              {coreItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Super admin access
            </p>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              {superAdminItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="What lives in this section"
        desc="Use this area later to wire real toggles and access control for staff roles."
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
          <li>
            Decide which left-hand menu items are visible to different internal
            roles (super admin, support, finance, dispute team).
          </li>
          <li>
            Control access to sensitive exports like ATO / taxation reports and
            CRM snapshots.
          </li>
          <li>
            Manage links between the web admin panel and any separate back
            office tools.
          </li>
        </ul>
      </ComponentCard>
    </div>
  );
}
