"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  Fingerprint,
  Globe,
  Lock,
  Mail,
  Shield,
  Smartphone,
} from "lucide-react";

const securityStats = [
  { label: "2FA enabled accounts", value: "3,240", helper: "62% of active users" },
  { label: "Pending password resets", value: "24", helper: "Require admin approval" },
  { label: "Restricted locations alerts", value: "7", helper: "Manual review required" },
];

const policies = [
  "Password resets require verification via email + phone (ROOT user only for main accounts).",
  "Transaction passwords mandatory for wallet withdrawals above 500 SG.",
  "Location-based security alerts owners if representative logs in from untrusted country.",
];

const pendingRequests = [
  {
    id: "SEC-4001",
    user: "TalentMatch HR (Owner)",
    type: "Password reset",
    reason: "Lost device",
    status: "Awaiting verification",
  },
  {
    id: "SEC-4002",
    user: "Squad Courier #118",
    type: "Transaction password reset",
    reason: "Forgot code",
    status: "Ready to approve",
  },
];

const trustedDevices = [
  { id: "DEV-101", user: "John Doe", device: "MacOS - Chrome", location: "San Francisco, USA" },
  { id: "DEV-102", user: "Samantha Lee", device: "Windows - Edge", location: "Melbourne, AU" },
];

const alerts = [
  "Representative login from new country (auto-email to owner + admin).",
  "Multiple failed transaction password attempts triggers account lock.",
  "Wallet withdrawals flagged if IP mismatch from last verified login.",
];

export default function SecuritySettingsPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Account Controls</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Reflects doc items: password reset approval, 2FA adoption, location-based security and transaction passwords.
        </p>
      </div>

      <ComponentCard title="Security overview" desc="High-level KPIs">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          {securityStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.helper}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Policies" desc="As detailed in doc security section">
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
          {policies.map((policy) => (
            <li key={policy}>{policy}</li>
          ))}
        </ul>
      </ComponentCard>

      <ComponentCard title="Pending security requests" desc="Password & transaction password resets">
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {request.user} · {request.type}
                  </p>
                </div>
                <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                  {request.status}
                </span>
              </div>
              <p className="mt-2 text-sm">{request.reason}</p>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  <Shield className="w-3 h-3" />
                  Approve
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  <AlertTriangle className="w-3 h-3" />
                  Escalate
                </button>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Trusted devices & location alerts"
        desc="Doc mentions location-based security for owner/representative accounts."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Trusted devices</p>
            <ul className="mt-3 space-y-2">
              {trustedDevices.map((device) => (
                <li
                  key={device.id}
                  className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{device.user}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{device.device}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{device.location}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Location-based alerts
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {alerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="2FA & notification settings" desc="Admin controls for security comms.">
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">2FA enrollment</p>
            </div>
            <p className="mt-2 text-sm">
              Owners must enroll in 2FA before approving new representatives. Representatives prompted
              but optional per doc.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Security notifications
              </p>
            </div>
            <p className="mt-2 text-sm">
              Email + push alerts for password resets, transaction password changes and location
              alerts. Logs retained 12 months.
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
