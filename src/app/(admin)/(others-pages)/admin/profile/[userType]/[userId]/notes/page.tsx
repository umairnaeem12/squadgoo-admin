"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { baseSupportSummary, buildNotes, StaffActivity } from "@/data/adminProfile";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const loadPersistedNotes = (userKey: string, fallback: StaffActivity[]) => {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(`admin-notes-${userKey}`);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as StaffActivity[];
  } catch {
    return fallback;
  }
};

export default function InternalNotesPage() {
  const router = useRouter();
  const params = useParams();
  const userType = (params?.userType as string) ?? "jobseeker";
  const userId = (params?.userId as string) ?? "user";
  const [notes, setNotes] = useState<StaffActivity[]>(() =>
    loadPersistedNotes(`${userType}-${userId}`, buildNotes(userId))
  );
  const [typeFilter, setTypeFilter] = useState<StaffActivity["category"] | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    setNotes(loadPersistedNotes(`${userType}-${userId}`, buildNotes(userId)));
  }, [userType, userId]);

  const filtered = useMemo(() => {
    return notes
      .filter((item) => (typeFilter === "all" ? true : item.category === typeFilter))
      .filter((item) => {
        const ts = new Date(item.timestamp).getTime();
        if (fromDate && ts < new Date(fromDate).getTime()) return false;
        if (toDate && ts > new Date(toDate).getTime()) return false;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes, typeFilter, fromDate, toDate]);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            Admin / Profile / Notes
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Internal Staff Notes
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userType} {userId} — full audit trail, newest first
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Back to profile
          </Button>
          <Link href={`/chat?userId=${userId}`}>
            <Button size="sm" variant="outline">Open chat</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ComponentCard title="Filters" desc="Date range and activity type">
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Activity type</Label>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as StaffActivity["category"] | "all")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="all">All</option>
                <option value="status">Status</option>
                <option value="badge">Badge</option>
                <option value="verification">Verification</option>
                <option value="chat">Chat</option>
                <option value="ticket">Ticket</option>
                <option value="kyc">KYC</option>
                <option value="callback">Callback</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200">
              <p className="font-semibold text-gray-900 dark:text-white">Support footprint</p>
              <p>Tickets opened: {baseSupportSummary.ticketsOpened}</p>
              <p>Tickets closed: {baseSupportSummary.ticketsClosed}</p>
              <p>Tickets pending: {baseSupportSummary.ticketsPending}</p>
              <p>Active chats: {baseSupportSummary.activeChats}</p>
              <p>Closed chats: {baseSupportSummary.closedChats}</p>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Activity history"
          desc="Clickable history — chats, tickets, badges, suspensions"
        >
          <div className="p-4 space-y-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No activity matches these filters.</p>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.id}
                  href={item.link || "#"}
                  className="block rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.category} • {formatDateTime(item.timestamp)} • {item.staffName ?? item.staffId}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {item.action}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-200">{item.reason}</p>
                </Link>
              ))
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
