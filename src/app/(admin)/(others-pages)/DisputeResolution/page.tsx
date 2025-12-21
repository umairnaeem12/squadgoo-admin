"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  FileText,
  Gavel,
  MessageCircle,
  Paperclip,
  RefreshCcw,
  Scale,
} from "lucide-react";

type DisputeStatus = "Open" | "In Review" | "Resolved";

type Dispute = {
  id: string;
  type: "Job" | "Marketplace";
  raisedBy: string;
  against: string;
  reason: string;
  status: DisputeStatus;
  amountHold: number;
  createdAt: string;
};

const DISPUTES: Dispute[] = [
  {
    id: "DSP-9001",
    type: "Job",
    raisedBy: "Rakesh Sharma (Jobseeker)",
    against: "TalentMatch HR (Recruiter)",
    reason: "Quick job ended early but full hours not paid",
    status: "In Review",
    amountHold: 180,
    createdAt: "10 Feb, 2025",
  },
  {
    id: "DSP-9002",
    type: "Marketplace",
    raisedBy: "Mia Collins (Buyer)",
    against: "Shehroz Motors (Seller)",
    reason: "Item not as described; motorbike mechanical issues",
    status: "Open",
    amountHold: 5000,
    createdAt: "18 Feb, 2025",
  },
  {
    id: "DSP-9003",
    type: "Job",
    raisedBy: "Squad Courier",
    against: "Rakesh Sharma (Buyer)",
    reason: "Courier completed delivery but buyer disputes distance",
    status: "Resolved",
    amountHold: 90,
    createdAt: "02 Feb, 2025",
  },
];

const HOLD_TIMELINE = [
  {
    stage: "Complaint submitted",
    detail:
      "Equivalent SG Coins placed on hold instantly. Neither party can withdraw or spend those coins.",
    timer: "Immediate",
  },
  {
    stage: "Mediator window",
    detail:
      "Mediator joins the thread, requests evidence, and sets deadlines. Hold persists while evidence is reviewed.",
    timer: "Mediator sets 24-48h response timer",
  },
  {
    stage: "Decision + appeal window",
    detail:
      "Once a verdict is issued, both sides have up to 7 days to appeal (max two appeals total). Hold remains in place.",
    timer: "7 days per appeal",
  },
  {
    stage: "Release / refund",
    detail:
      "SG Coins released to winning party or refunded to buyer. If decision favors the seller/recruiter, mediator may also levy fines.",
    timer: "Immediate after final appeal window",
  },
];

const MEDIATOR_CHATS = [
  {
    id: "DSP-9001",
    participants: "Rakesh Sharma ↔ TalentMatch HR",
    unread: 2,
    lastMessage: "Mediator requested QR code proof for stage 6 payment request.",
    holdNote: "Auto-release in 4 days unless appealed.",
  },
  {
    id: "DSP-9002",
    participants: "Mia Collins ↔ Shehroz Motors ↔ Squad Courier",
    unread: 0,
    lastMessage: "Seller uploaded inspection video and courier receipt.",
    holdNote: "Waiting on buyer response; hold stays active.",
  },
];

const EVIDENCE_QUEUE = [
  {
    id: "EV-501",
    party: "Recruiter",
    type: "Clock stop agreement (Quick job stage 7)",
    due: "12 Mar, 2025",
    status: "Pending upload",
  },
  {
    id: "EV-502",
    party: "Jobseeker",
    type: "Location screenshots (stage 3-5)",
    due: "11 Mar, 2025",
    status: "Received",
  },
  {
    id: "EV-503",
    party: "Seller",
    type: "Courier receipt / proof of delivery",
    due: "10 Mar, 2025",
    status: "Overdue",
  },
];

const APPEAL_RULES = [
  "Each side gets max two appeals, and every appeal must include new evidence.",
  "Appeal must be lodged within 7 days of the latest decision, otherwise SG Coins settle.",
  "Mediator can extend the timer if courier shipping exceeds 7 days (per doc).",
];

const APPEAL_QUEUE = [
  {
    id: "DSP-9003",
    stage: "Appeal 1",
    filedBy: "Buyer",
    detail: "Buyer claims courier marked delivered too early; requesting new GPS logs.",
    due: "11 Mar, 2025",
  },
];

export default function DisputeResolutionPage() {
  const searchParams = useSearchParams();
  const caseParam = searchParams.get("case");
  const caseId = caseParam ? caseParam.toUpperCase() : null;

  const disputeRows = useMemo(() => {
    if (!caseId) {
      return DISPUTES;
    }
    const existing = DISPUTES.find((item) => item.id === caseId);
    if (existing) {
      return [existing, ...DISPUTES.filter((item) => item.id !== caseId)];
    }
    const fallback: Dispute = {
      id: caseId,
      type: "Marketplace",
      raisedBy: "Auto-linked buyer",
      against: "Auto-linked seller",
      reason: "Auto-linked from wallet dispute. Update details as needed.",
      status: "Open",
      amountHold: 420,
      createdAt: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    return [fallback, ...DISPUTES];
  }, [caseId]);

  const openCount = disputeRows.filter((d) => d.status === "Open").length;
  const inReviewCount = disputeRows.filter((d) => d.status === "In Review").length;
  const resolvedCount = disputeRows.filter((d) => d.status === "Resolved").length;

  const totalOnHold = disputeRows.reduce((sum, d) => sum + d.amountHold, 0);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dispute Resolution Centre
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage disputes for jobs, marketplace trades and Squad Courier flows.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          label="Open disputes"
          value={openCount.toString()}
          helper="Require mediator assignment and first response."
        />
        <SummaryCard
          icon={<Scale className="w-5 h-5 text-amber-500" />}
          label="In review"
          value={inReviewCount.toString()}
          helper="Evidence being collected from both parties."
        />
        <SummaryCard
          icon={<BadgeCheck className="w-5 h-5 text-emerald-500" />}
          label="Resolved"
          value={resolvedCount.toString()}
          helper="Closed with refund, release or fine."
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-brand-500" />}
          label="SG Coins on hold"
          value={`${totalOnHold.toLocaleString()} SG`}
          helper="Held until case is closed or refunded."
        />
      </div>

      {/* Dispute table – aligned with document flow */}
      <ComponentCard
        title="Active disputes"
        desc="Each dispute is tied to a specific order or job and follows the evidence, mediation and re-appeal flow described in the SquadGoo specification."
      >
        {caseId && (
          <div className="mx-4 mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200">
            Showing linked dispute for case {caseId}. Update details if needed.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Raised by</th>
                <th className="px-6 py-3 font-medium">Against</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Amount on hold</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {disputeRows.map((d) => (
                <tr
                  key={d.id}
                  className={`transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                    caseId === d.id
                      ? "bg-brand-50/60 ring-1 ring-brand-200 dark:bg-brand-500/10 dark:ring-brand-500/40"
                      : ""
                  }`}
                >
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {d.id}
                  </td>
                  <td className="px-6 py-3 text-xs">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.raisedBy}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.against}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.reason}
                  </td>
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {d.amountHold.toLocaleString()} SG
                  </td>
                  <td className="px-6 py-3">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {d.createdAt}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/DisputeChat?case=${d.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Open mediator chat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Hold & release timeline"
        desc="Matches the document's stage 6/7 flow where SG Coins remain frozen until both parties or mediator finalize the job."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {HOLD_TIMELINE.map((stage) => (
            <div
              key={stage.stage}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stage.stage}
                </p>
                <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                  {stage.timer}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{stage.detail}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Mediator chat threads"
        desc="Internal view of live mediator conversations, unread counts and hold timers."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {MEDIATOR_CHATS.map((chat) => (
            <div
              key={chat.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{chat.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{chat.participants}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                    {chat.unread} unread
                  </span>
                )}
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <MessageCircle className="w-4 h-4 text-brand-500" />
                {chat.lastMessage}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{chat.holdNote}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Evidence requests & uploads"
        desc="Track outstanding attachments per the doc (screenshots, invoices, courier receipts)."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium">Request ID</th>
                <th className="px-4 py-3 font-medium">Party</th>
                <th className="px-4 py-3 font-medium">Evidence type</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {EVIDENCE_QUEUE.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.party}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.type}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.due}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Received"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : item.status === "Overdue"
                          ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                      }`}
                    >
                      {item.status === "Received" ? (
                        <FileText className="w-3 h-3" />
                      ) : item.status === "Overdue" ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Paperclip className="w-3 h-3" />
                      )}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Appeals & re-open workflow"
        desc="Doc allows up to two appeals per party with mandatory new evidence."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Policy reminders</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
              {APPEAL_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Active appeals</p>
            </div>
            <ul className="mt-3 space-y-3">
              {APPEAL_QUEUE.map((appeal) => (
                <li key={appeal.id} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {appeal.id} · {appeal.stage}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Filed by {appeal.filedBy}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-300">
                      Due {appeal.due}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{appeal.detail}</p>
                  <button className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                    <RefreshCcw className="w-3 h-3" />
                    Review appeal
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
      {helper && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: DisputeStatus }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium";

  if (status === "Open") {
    return (
      <span
        className={`${base} bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300`}
      >
        <AlertTriangle className="w-3 h-3" />
        {status}
      </span>
    );
  }

  if (status === "In Review") {
    return (
      <span
        className={`${base} bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300`}
      >
        <Scale className="w-3 h-3" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`${base} bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300`}
    >
      <BadgeCheck className="w-3 h-3" />
      {status}
    </span>
  );
}


