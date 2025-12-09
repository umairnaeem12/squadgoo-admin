"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  Calendar,
  MessageCircle,
  Shield,
  Timer,
} from "lucide-react";

const internalChannels = [
  {
    name: "Support & disputes",
    description: "Live coordination between support agents, mediators and compliance.",
    retention: "30-day chat window per match; transcripts stored 12 months.",
    unread: 3,
  },
  {
    name: "Engineering handoff",
    description: "Escalate bugs discovered in user chats or notifications.",
    retention: "Permanent internal channel (not tied to user chats).",
    unread: 0,
  },
];

const transcriptPolicies = [
  "User chats expire 30 days after a match. Transcripts remain for 12 months for compliance reviews.",
  "Internal staff channels (support, disputes, engineering) never expire but exports must be tagged with case IDs.",
  "Any transcript shared with disputes must respect privacy rules and be deleted after 12 months.",
];

const chatReminders = [
  "Send reminders 3 days before chat expiry so both parties can re-offer if needed.",
  "Disable the send box automatically when the 30-day window closes.",
  "Allow staff to re-open chat by issuing a fresh offer, per the document.",
];

const notificationRules = [
  "Notify disputes when a wallet hold exceeds 7 days.",
  "Alert jobseekers when quick job timers reach 1 hour remaining.",
  "Ping compliance when watchlist users create new offers.",
];

export default function AdminChatPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Internal Chat & Notifications Hub
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Mirror of the doc’s chat + notification requirements: 30-day expiry, transcript retention, internal channels.
      </p>

      <ComponentCard
        title="Internal channels"
        desc="Support, disputes and engineering chat rooms (staff-only)."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          {internalChannels.map((channel) => (
            <div
              key={channel.name}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-brand-500" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {channel.name}
                  </p>
                </div>
                {channel.unread > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                    {channel.unread} unread
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm">{channel.description}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {channel.retention}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chat expiry & transcript policies"
        desc="User chats expire at 30 days; transcripts remain for 12 months."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
          {transcriptPolicies.map((policy) => (
            <li key={policy}>{policy}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Expiring chats
              </p>
            </div>
            <p className="mt-2 text-sm">42 chats hit the 30-day limit in the next 24 hours.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-500 dark:text-gray-400">
              {chatReminders.map((reminder) => (
                <li key={reminder}>{reminder}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Transcript retention
              </p>
            </div>
            <p className="mt-2 text-sm">
              Transcripts must be tagged with dispute/ticket IDs before export, and auto-delete after 12 months.
            </p>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Notifications & escalations"
        desc="System notification rules tied to disputes, wallet holds, referrals."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-purple-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Timed alerts</p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {notificationRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Escalation inboxes
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Dispute team gets wallet hold / cancellation alerts.</li>
              <li>{`Finance sees holds > 7 days (ties to Admin Wallet).`}</li>
              <li>Compliance alerted when watchlist users get offers.</li>
            </ul>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
