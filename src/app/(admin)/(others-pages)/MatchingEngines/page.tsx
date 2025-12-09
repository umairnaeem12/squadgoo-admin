"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  Activity,
  AlertTriangle,
  Clock8,
  Compass,
  Link2,
  MapPin,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  Users,
} from "lucide-react";

const quickStages = [
  "Offer accepted",
  "Prep & ready window (e.g. 30 mins)",
  "Location sharing kicks in from 5 km out",
  "Arrival notification at workplace",
  "Arrived / start work confirmation",
  "Request in-platform payment (QR / codes)",
  "Timer + SG Coin hold until job complete",
];

const quickSettings = [
  {
    title: "Only funded quick jobs",
    detail:
      "Jobseekers can opt-in to only receive offers when recruiter wallets hold enough SG Coins for estimated hours.",
  },
  {
    title: "Mandatory platform payments",
    detail:
      "Force SG Coin timers + QR code confirmation, skipping the manual stage-6 request.",
  },
  {
    title: "Badge filters",
    detail:
      "Restrict quick offers to Bronze / Platinum / Gold recruiters or PRO jobseekers as required.",
  },
  {
    title: "Auto matching",
    detail:
      "System sends offers on behalf of hirers; admins can pause/resume from here.",
  },
];

const manualFlow = [
  {
    title: "Surf matched profiles",
    detail:
      "Recruiters/Individuals see percentage matches, high-level profile info, but no contact details yet.",
  },
  {
    title: "Send offer",
    detail:
      "Offer carries expiry timer; jobseekers can accept, decline (with reason if >70% match) or request modification.",
  },
  {
    title: "Matchmaking ends",
    detail:
      "Once accepted, contact + chat unlocks for 30 days. No live tracking or in-app payments for manual jobs.",
  },
];

const manualControls = [
  "Acceptance rating impacts surfacing order.",
  "High-decline reasons trigger admin review and possible rating drop.",
  "Manual search fees ~50% of quick search fees.",
];

const adminOverrides = [
  {
    label: "Quick search service fee",
    value: "5% cap at 15 SG Coins (Individuals) / custom for Recruiters",
  },
  {
    label: "Manual search service fee",
    value: "2% cap at 10 SG Coins (Individuals)",
  },
  {
    label: "Clock auto-stop buffer",
    value: "1 hour resume window before coins settle",
  },
  {
    label: "Chat expiry",
    value: "30 days unless new match occurs",
  },
];

export default function MatchingEnginesPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quick vs Manual Search
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Internal reference for how SquadGoo handles both matchmaking modes,
          plus the admin levers to enable/disable or tune them.
        </p>
      </div>

      <ComponentCard
        title="Quick Search overview"
        desc="System-driven offers, live tracking and SG Coin timers for urgent hiring."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <QuickSummary />
          <StageTimeline />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Quick Search settings"
        desc="Reference of user-facing toggles that admins may need to enforce."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {quickSettings.map((setting) => (
            <div
              key={setting.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <div className="flex items-center gap-2 text-brand-500 dark:text-brand-400">
                <ToggleLeft className="w-4 h-4" />
                <p className="font-semibold text-gray-900 dark:text-white">
                  {setting.title}
                </p>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {setting.detail}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Manual Search overview"
        desc="Lower-cost manual offers with negotiation and acceptance rating tracking."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ManualSummary />
          <ManualControls />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Admin overrides"
        desc="High-level levers to keep fees, timers and chat rules aligned with policy."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {adminOverrides.map((override) => (
            <div
              key={override.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {override.label}
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                {override.value}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}

function QuickSummary() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-500" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Managed by system + hirer
        </p>
      </div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
        <li>Auto matching can fire offers with match % scoring.</li>
        <li>Hirers can cancel before another jobseeker accepts.</li>
        <li>
          Chat/contact unlock immediately for 30 days; expires unless new offer
          is sent.
        </li>
        <li>
          In-app payment optional but requires QR/code confirmation from both
          parties.
        </li>
        <li>
          Timer holds SG Coins; jobseekers can acknowledge low balance or force
          recharge requests.
        </li>
      </ul>
    </div>
  );
}

function StageTimeline() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Clock8 className="w-5 h-5 text-emerald-500" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Live tracking stages
        </p>
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {quickStages.map((stage, index) => (
          <li key={stage} className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {index + 1}
            </span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Admins can pause any stage (e.g., disable stage 6 payments if TFN roles
        are involved) without disrupting the rest of the flow.
      </p>
    </div>
  );
}

function ManualSummary() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-indigo-500" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Manual steps
        </p>
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {manualFlow.map((step, idx) => (
          <li key={step.title}>
            <p className="font-medium text-gray-900 dark:text-white">
              {idx + 1}. {step.title}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-500" />
        <span>
          {`Acceptance rating is recalculated from total offers compared to accepted, closed, and declined. Poor ratings (below 70%) may reduce future visibility.`}
        </span>
      </p>
    </div>
  );
}

function ManualControls() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Negotiation + compliance
        </p>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {manualControls.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid gap-3 text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Manual offers still respect max radius preferences set by jobseekers.
        </p>
        <p className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Chat + contact details unlock post-acceptance only, then expire after
          30 days.
        </p>
      </div>
    </div>
  );
}
