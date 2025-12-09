"use client";

import ComponentCard from "@/components/common/ComponentCard";

type MenuItem = {
  label: string;
  detail: string;
};

const coreItems: MenuItem[] = [
  {
    label: "Dashboard",
    detail: "Macro KPIs, SG Coin trends and alerting for internal teams.",
  },
  {
    label: "Jobseekers",
    detail: "Full directory with KYC/KYB, acceptance rating, squads and documents.",
  },
  {
    label: "Recruiters",
    detail: "Business side profiles, KYB, sub-account controls and offer history.",
  },
  {
    label: "Individuals",
    detail: "Domestic hirers and marketplace buyers requesting contractors.",
  },
  {
    label: "Squad Accounts",
    detail: "Paired jobseeker groups, membership management and squad wallets.",
  },
];

const operationsItems: MenuItem[] = [
  {
    label: "Reports & Reviews",
    detail: "Manual approvals, complaints, acceptance ratings and feedback.",
  },
  {
    label: "Customer Service",
    detail: "Tickets, callbacks, live chat logs and compliance escalations.",
  },
  {
    label: "Account Upgrades & Extras",
    detail: "Bronze/Platinum/Gold badge purchases plus resume verification add-ons.",
  },
  {
    label: "Dispute Resolution Centre",
    detail: "Handles SG Coin holds, mediation logs and settlement timers.",
  },
  {
    label: "Job Posts",
    detail: "Manual/quick job offers, expiry logic and reuse of saved templates.",
  },
];

const superAdminItems: MenuItem[] = [
  {
    label: "Admin Panel Control",
    detail: "Role visibility matrix for every menu group and feature flag.",
  },
  {
    label: "Platform Controls",
    detail: "Global toggles for Quick Search, Manual Search, marketplace and courier.",
  },
  {
    label: "ATO Reports",
    detail: "GST packs, SG Coin transaction exports and withdrawal summaries.",
  },
  {
    label: "CRM",
    detail: "Snapshots of verified users, high-risk watchlists and referrals.",
  },
];

const headerQuickActions = [
  {
    label: "Menu Bar",
    detail:
      "Left-hand collapsible navigation that mirrors the SquadGoo spec, grouped by role.",
  },
  {
    label: "Internal Chat",
    detail:
      "Top-bar shortcut into the staff chat view so operations, disputes and product can coordinate.",
  },
  {
    label: "Wallet",
    detail:
      "Links to the SG COIN platform wallet view for credits, holds, withdrawals and refunds.",
  },
  {
    label: "Staff Profile",
    detail:
      "Shows logged-in staff member, role switching and access to personal security settings.",
  },
];

const roleResponsibilities = [
  {
    role: "Support",
    focus:
      "Access to Jobseekers, Recruiters, Individuals and Customer Service with read/write ticket tools.",
  },
  {
    role: "Finance",
    focus:
      "Wallet, Account Upgrades & Extras, SG COIN refunds and ATO/CRM exports when approved.",
  },
  {
    role: "Dispute team",
    focus:
      "Dispute Resolution Centre controls, SG Coin holds, marketplace mediation and audit trails.",
  },
  {
    role: "Super admin",
    focus:
      "Full visibility across all menus, ability to toggle features (Quick vs Manual search, marketplace, courier) and assign roles.",
  },
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
        desc="Matches the ADMIN PANNEL section of the SquadGoo document and keeps copy localized inside the repo."
      >
        <div className="grid gap-6 text-sm md:grid-cols-3">
          <MenuColumn title="Core navigation" items={coreItems} />
          <MenuColumn title="Operations" items={operationsItems} />
          <MenuColumn title="Super admin access" items={superAdminItems} />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Header quick tools"
        desc="Doc calls out Menu bar + Internal Chat + Wallet + Staff Profile sitting across the header."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {headerQuickActions.map((action) => (
            <div
              key={action.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {action.label}
              </p>
              <p className="mt-2">{action.detail}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Role-driven visibility"
        desc="Use this for access-control notes before wiring to the auth backend."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {roleResponsibilities.map((role) => (
            <div
              key={role.role}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {role.role}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Primary responsibilities
              </p>
              <p className="mt-2">{role.focus}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="What lives in this section"
        desc="Keeps us honest about the work that still needs wiring without disturbing the UI."
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
          <li>
            Tie Platform Controls into real toggles for Quick vs Manual search,
            marketplace and Squad Courier once backend APIs exist.
          </li>
          <li>
            Mirror the document's Wallet and Internal Chat flows so staff can
            move between chats, SG Coin ledger, disputes and upgrades quickly.
          </li>
        </ul>
      </ComponentCard>
    </div>
  );
}

function MenuColumn({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {title}
      </p>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {items.map((item) => (
          <li key={item.label}>
            <p className="font-medium text-gray-900 dark:text-white">
              {item.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
