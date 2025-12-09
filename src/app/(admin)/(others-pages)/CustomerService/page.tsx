"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  Clock9,
  Headset,
  Mail,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";

const ticketStats = [
  { label: "Total open tickets", value: "128", helper: "+14 vs yesterday" },
  { label: "Awaiting user reply", value: "32", helper: "Auto reminder in 12h" },
  { label: "High priority", value: "9", helper: "Escalated to compliance" },
];

const callbackSlots = [
  { slot: "09:00 AM - 11:00 AM", booked: 6, capacity: 10 },
  { slot: "11:00 AM - 01:00 PM", booked: 4, capacity: 10 },
  { slot: "02:00 PM - 05:00 PM", booked: 8, capacity: 10 },
];

const liveChatChannels = [
  { channel: "Quick jobs", agents: 5, waiting: 3, avgTime: "02:11" },
  { channel: "Marketplace", agents: 3, waiting: 1, avgTime: "03:02" },
  { channel: "Disputes", agents: 2, waiting: 0, avgTime: "01:15" },
];

const escalationReasons = [
  {
    title: "Compliance / KYC",
    detail:
      "Incomplete or suspicious documents, requests for manual verification, ABN/tax disputes.",
  },
  {
    title: "Dispute mediation",
    detail:
      "Tickets tied to SG Coin holds, marketplace disputes or quick-job cancellation fines.",
  },
  {
    title: "Platform bugs",
    detail:
      "Reported issues forwarded to engineering; track fix ETA and communicate to users.",
  },
];

const channelPolicies = [
  {
    title: "Chat transcripts",
    detail:
      "Stored for 12 months after the 30-day chat window closes, accessible only to support + disputes per doc.",
  },
  {
    title: "Callback SLA",
    detail: "User-selected slot must be acknowledged within 15 minutes.",
  },
  {
    title: "Ticket lifecycle",
    detail:
      "Open → Pending user → Resolved → Archived. Auto-close after 7 days of no response unless escalated.",
  },
];

const ticketFeed = [
  {
    id: "SUP-771",
    type: "Quick job",
    user: "TalentMatch HR",
    status: "Awaiting user",
    updated: "2h ago",
  },
  {
    id: "SUP-772",
    type: "Marketplace",
    user: "Mia Collins",
    status: "In progress",
    updated: "15m ago",
  },
  {
    id: "SUP-773",
    type: "Referral",
    user: "Ayesha Khan",
    status: "Resolved",
    updated: "Yesterday",
  },
];

const transcriptLog = [
  {
    id: "CHAT-9901",
    party: "Recruiter ↔ Rakesh",
    expires: "12 Mar, 2025",
    status: "Expiring soon",
  },
  {
    id: "CHAT-9902",
    party: "Mia ↔ Squad Courier",
    expires: "15 Apr, 2025",
    status: "Archived",
  },
];

export default function CustomerServicePage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Service
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Reference console for support agents handling live chat, tickets,
          callbacks and escalations per SquadGoo doc.
        </p>
      </div>

      <ComponentCard
        title="Ticket overview"
        desc="Stats mirror what the doc expects in Customer Service → tickets & support logs."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {ticketStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.helper}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Live chat status"
        desc="Each channel respects 30-day chat window and transcript retention rules."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {liveChatChannels.map((channel) => (
            <div
              key={channel.channel}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {channel.channel}
                </p>
              </div>
              <div className="mt-3 grid gap-1 text-sm text-gray-700 dark:text-gray-300">
                <p>Agents online: {channel.agents}</p>
                <p>Users waiting: {channel.waiting}</p>
                <p>Average wait: {channel.avgTime}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Callback scheduler"
        desc="Matches doc's 'Request a call back' with calendar slots and acknowledgements."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {callbackSlots.map((slot) => (
            <div
              key={slot.slot}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {slot.slot}
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Booked {slot.booked} / {slot.capacity}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SLA: confirm within 15 minutes of request.
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Ticket categories & escalations"
        desc="Documents how support routes tickets into compliance, disputes, or product."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Headset className="w-5 h-5 text-indigo-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Common categories
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
              <li>Quick job issues (clock, payment requests, cancellations).</li>
              <li>Manual offer disputes / acceptance rating appeals.</li>
              <li>Marketplace listings, courier delivery complaints.</li>
              <li>Badge applications and resume verification updates.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Escalation reasons
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {escalationReasons.map((reason) => (
                <li key={reason.title}>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {reason.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {reason.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Policies & retention"
        desc="Aligns with doc notes on transcripts, notification behaviour and account closures."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {channelPolicies.map((policy) => (
            <div
              key={policy.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {policy.title}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Policy
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {policy.detail}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Support logs & tooling"
        desc="Use these placeholders for future tables (tickets, callbacks, chat transcripts)."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Ticket feed
              </p>
            </div>
            <div className="mt-3 space-y-3">
              {ticketFeed.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-gray-900 dark:text-white">{ticket.id}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.updated}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ticket.type} · {ticket.user}
                  </p>
                  <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-300">
                    {ticket.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Transcript retention
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {transcriptLog.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.id}</p>
                    <span className="text-xs font-medium text-orange-500 dark:text-orange-300">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.party}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Expires {item.expires}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="SLA trackers"
        desc="Doc emphasizes timers: 15 min callback acknowledgement, 7 day ticket auto close, 30 day chat expiration."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SlaTile
            icon={<Clock9 className="w-5 h-5 text-emerald-500" />}
            label="Callback ACK"
            detail="Average acknowledgement time today: 07m 12s"
          />
          <SlaTile
            icon={<ShieldCheck className="w-5 h-5 text-sky-500" />}
            label="Ticket auto-close"
            detail="16 tickets auto-closed in last 24h (no user response)"
          />
          <SlaTile
            icon={<MessageCircle className="w-5 h-5 text-purple-500" />}
            label="Chat expiry watch"
            detail="42 chat threads hitting the 30-day limit today"
          />
        </div>
      </ComponentCard>
    </div>
  );
}

function SlaTile({
  icon,
  label,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{detail}</p>
    </div>
  );
}
