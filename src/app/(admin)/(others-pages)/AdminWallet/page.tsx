"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  Activity,
  AlertTriangle,
  Coins,
  Download,
  FileSpreadsheet,
  RefreshCcw,
  WalletCards,
} from "lucide-react";

const transactions = [
  {
    id: "TX-9001",
    type: "Quick job",
    party: "TalentMatch HR → Rakesh Sharma",
    amount: "-180 SG",
    status: "Hold (dispute)",
    createdAt: "10 Feb, 2025",
  },
  {
    id: "TX-9002",
    type: "Marketplace",
    party: "Mia Collins → Shehroz Motors",
    amount: "-5,000 SG",
    status: "Hold (inspection)",
    createdAt: "18 Feb, 2025",
  },
  {
    id: "TX-9003",
    type: "Withdrawal",
    party: "Ayesha Khan",
    amount: "-420 SG",
    status: "Pending",
    createdAt: "19 Feb, 2025",
  },
  {
    id: "TX-9004",
    type: "Badge purchase",
    party: "Squad Courier PRO",
    amount: "+50 SG",
    status: "Completed",
    createdAt: "20 Feb, 2025",
  },
];

const refundRequests = [
  {
    id: "RF-101",
    source: "Marketplace",
    user: "Mia Collins",
    amount: "5,000 SG",
    reason: "Item faulty",
    status: "Awaiting mediator",
  },
  {
    id: "RF-102",
    source: "Quick job",
    user: "Rakesh Sharma",
    amount: "180 SG",
    reason: "Job ended early",
    status: "Ready to release",
  },
];

const reports = [
  {
    title: "SG Coin circulation report",
    detail: "Monthly circulation, inflows/outflows, badge purchases.",
  },
  {
    title: "ATO/GST export pack",
    detail: "Wallet withdrawals, marketplace fees and GST summary.",
  },
  {
    title: "Dispute hold summary",
    detail: "All holds older than 7 days with pending action.",
  },
];

export default function AdminWalletPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Platform Wallet (SG COINS)
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        High-level overview of SG COIN balances and flows from an internal
        admin perspective.
      </p>

      <ComponentCard title="Summary" desc="Key wallet KPIs for the platform.">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          <SummaryTile
            icon={<Coins className="w-5 h-5 text-brand-500" />}
            label="Total SG COINS in circulation"
            value="1,250,000 SG"
          />
          <SummaryTile
            icon={<WalletCards className="w-5 h-5 text-emerald-500" />}
            label="On hold in disputes"
            value="5,270 SG"
          />
          <SummaryTile
            icon={<WalletCards className="w-5 h-5 text-purple-500" />}
            label="Pending withdrawals"
            value="18,400 SG"
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Recent transactions"
        desc="Track marketplace holds, quick job timers, badge purchases and withdrawals."
        headerRight={
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Parties</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {txn.id}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{txn.type}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{txn.party}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {txn.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        txn.status.includes("Hold")
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                          : txn.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{txn.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Refunds & releases"
        desc="Approve refunds, release holds or trigger fines per dispute outcomes."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {refundRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {request.id} · {request.source}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">User: {request.user}</p>
                </div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-300">
                  {request.amount}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{request.status}</p>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  <RefreshCcw className="w-3 h-3" />
                  Release
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  <AlertTriangle className="w-3 h-3" />
                  Raise to dispute team
                </button>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Reports & exports"
        desc="Quick access to SG Coin, ATO/GST and dispute hold reports referenced in the document."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-brand-500" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{report.title}</p>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{report.detail}</p>
              <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Integrations"
        desc="Shows where wallet data feeds into Dispute Resolution and Marketplace."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Dispute holds
              </p>
            </div>
            <p className="mt-2 text-sm">
              Wallet coins on hold sync with Dispute Resolution timeline sections (stage 6/7) for
              quick job and marketplace cases.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Marketplace payouts
              </p>
            </div>
            <p className="mt-2 text-sm">
              MarketplaceControl page requests courier fees, listing holds and dispute outcomes
              through this wallet view.
            </p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
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
    </div>
  );
}
