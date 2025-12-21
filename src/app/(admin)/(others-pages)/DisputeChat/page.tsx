"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import {
  FileText,
  MessageCircle,
  Paperclip,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

type ParticipantRole = "Mediator" | "Buyer" | "Seller";

type EvidenceStatus = "received" | "reviewing" | "requested";

type DisputeMessage = {
  id: string;
  sender: ParticipantRole;
  text: string;
  timestamp: string;
};

type EvidenceItem = {
  id: string;
  name: string;
  owner: ParticipantRole;
  uploadedAt: string;
  status: EvidenceStatus;
};

type ParticipantProfile = {
  name: string;
  role: ParticipantRole;
  department: string;
  rating: number;
  totalOrders: number;
  disputes: number;
  resolved: number;
  lastActive: string;
};

type RecordEntry = {
  id: string;
  title: string;
  status: "Resolved" | "Open" | "In Review";
  date: string;
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const seedMessages = (caseId: string): DisputeMessage[] => [
  {
    id: `${caseId}-m1`,
    sender: "Buyer",
    text: "Item arrived with visible scratches and missing manual.",
    timestamp: "2027-04-21T10:05:00Z",
  },
  {
    id: `${caseId}-m2`,
    sender: "Seller",
    text: "We shipped in sealed packaging. Please share photos of the damage.",
    timestamp: "2027-04-21T10:08:00Z",
  },
  {
    id: `${caseId}-m3`,
    sender: "Mediator",
    text: "Please upload photos and the delivery receipt within 24 hours.",
    timestamp: "2027-04-21T10:12:00Z",
  },
];

const autoReplies: Record<Exclude<ParticipantRole, "Mediator">, string[]> = {
  Buyer: [
    "Uploading images now.",
    "I also have the unboxing video ready.",
    "The courier left it outside; attaching proof.",
  ],
  Seller: [
    "We can offer a partial refund if verified.",
    "Uploading original packing photos.",
    "Please confirm the tracking number.",
  ],
};

const buyerNames = [
  "Mia Collins",
  "Jasmine Patel",
  "Rakesh Sharma",
  "Omar Daniels",
  "Hina Noor",
  "Marcus Lee",
  "Sana Ali",
  "Noah Brooks",
  "Priya Singh",
  "Isla Ford",
];

const sellerNames = [
  "Shehroz Motors",
  "Squad Courier",
  "TalentMatch HR",
  "Atlas Rentals",
  "ProFix Auto",
  "Rapid Logistics",
  "Prime Staffing",
  "TalentNest",
  "Vertex Services",
  "Nova Freight",
];

const departments = [
  "Marketplace",
  "Logistics",
  "Recruiting",
  "Account Upgrades",
  "Customer Service",
];

const makeSeed = (value: string) =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

export default function DisputeChatPage() {
  const searchParams = useSearchParams();
  const caseId = useMemo(
    () => (searchParams.get("case") ?? "DSP-UNKNOWN").toUpperCase(),
    [searchParams]
  );
  const caseSeed = useMemo(() => makeSeed(caseId), [caseId]);
  const buyerName = useMemo(
    () => buyerNames[caseSeed % buyerNames.length],
    [caseSeed]
  );
  const sellerName = useMemo(
    () => sellerNames[(caseSeed + 3) % sellerNames.length],
    [caseSeed]
  );
  const buyerProfile = useMemo<ParticipantProfile>(
    () => ({
      name: buyerName,
      role: "Buyer",
      department: departments[caseSeed % departments.length],
      rating: 4.1 + ((caseSeed % 7) * 0.1),
      totalOrders: 24 + (caseSeed % 18),
      disputes: 2 + (caseSeed % 4),
      resolved: 18 + (caseSeed % 6),
      lastActive: formatDate(new Date().toISOString()),
    }),
    [buyerName, caseSeed]
  );
  const sellerProfile = useMemo<ParticipantProfile>(
    () => ({
      name: sellerName,
      role: "Seller",
      department: departments[(caseSeed + 2) % departments.length],
      rating: 4.3 + ((caseSeed % 5) * 0.1),
      totalOrders: 68 + (caseSeed % 25),
      disputes: 3 + (caseSeed % 5),
      resolved: 54 + (caseSeed % 12),
      lastActive: formatDate(new Date().toISOString()),
    }),
    [sellerName, caseSeed]
  );
  const mediatorProfile = useMemo<ParticipantProfile>(
    () => ({
      name: "Finance Mediator",
      role: "Mediator",
      department: "Dispute Resolution",
      rating: 4.9,
      totalOrders: 0,
      disputes: 120,
      resolved: 110,
      lastActive: "Online",
    }),
    []
  );

  const previousRecords = useMemo<RecordEntry[]>(
    () => [
      {
        id: `${caseId}-A1`,
        title: `${buyerName} vs ${sellerName} - Item quality`,
        status: "Resolved",
        date: "2027-03-12",
      },
      {
        id: `${caseId}-B2`,
        title: `${buyerName} chargeback - delivery delay`,
        status: "In Review",
        date: "2027-02-22",
      },
      {
        id: `${caseId}-C3`,
        title: `${sellerName} delivery dispute`,
        status: "Open",
        date: "2027-01-18",
      },
    ],
    [buyerName, sellerName, caseId]
  );

  const [messages, setMessages] = useState<DisputeMessage[]>(() =>
    seedMessages(caseId)
  );
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [evidenceRequest, setEvidenceRequest] = useState("");
  const [evidence, setEvidence] = useState<EvidenceItem[]>([
    {
      id: `${caseId}-ev-1`,
      name: "Delivery receipt.pdf",
      owner: "Seller",
      uploadedAt: "2027-04-21T09:50:00Z",
      status: "reviewing",
    },
    {
      id: `${caseId}-ev-2`,
      name: "Product photos.zip",
      owner: "Buyer",
      uploadedAt: "2027-04-21T10:20:00Z",
      status: "received",
    },
  ]);

  useEffect(() => {
    setMessages(seedMessages(caseId));
  }, [caseId]);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      {
        id: `${caseId}-med-${now}`,
        sender: "Mediator",
        text,
        timestamp: now,
      },
    ]);
    setDraft("");
    setIsSending(true);

    const otherSide = Math.random() > 0.5 ? "Buyer" : "Seller";
    const replyPool = autoReplies[otherSide];
    const replyText = replyPool[Math.floor(Math.random() * replyPool.length)];

    const timeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${caseId}-${otherSide}-${Date.now()}`,
          sender: otherSide,
          text: replyText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsSending(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [caseId, draft]);

  const handleUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    const file = fileList[0];
    setEvidence((prev) => [
      {
        id: `${caseId}-ev-${Date.now()}`,
        name: file.name,
        owner: "Mediator",
        uploadedAt: new Date().toISOString(),
        status: "received",
      },
      ...prev,
    ]);
  };

  const handleEvidenceStatus = (id: string, status: EvidenceStatus) => {
    setEvidence((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleEvidenceRemove = (id: string) => {
    setEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRequestEvidence = () => {
    const text = evidenceRequest.trim();
    if (!text) {
      return;
    }
    setEvidence((prev) => [
      {
        id: `${caseId}-ev-${Date.now()}`,
        name: text,
        owner: "Mediator",
        uploadedAt: new Date().toISOString(),
        status: "requested",
      },
      ...prev,
    ]);
    setEvidenceRequest("");
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dispute chat {caseId}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Group chat between buyer, seller, and mediator with evidence uploads.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          Live mediation
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <ComponentCard
          title="Mediator conversation"
          desc="Ask for evidence, negotiate, and resolve the dispute."
        >
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              {messages.map((message) => {
                const isMediator = message.sender === "Mediator";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMediator ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[520px] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isMediator
                          ? "bg-brand-500/10 text-gray-900 dark:text-white"
                          : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                        <span>{message.sender}</span>
                        <span className="normal-case tracking-normal">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex flex-col gap-3">
                <TextArea
                  rows={3}
                  value={draft}
                  onChange={setDraft}
                  placeholder="Send a mediator update or request more evidence"
                  className="text-gray-700 dark:text-gray-200"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) => handleUpload(event.target.files)}
                    />
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                      <Paperclip className="h-3 w-3" />
                      Upload evidence
                    </span>
                  </label>
                  <Button size="sm" onClick={handleSend} disabled={!draft.trim() || isSending}>
                    {isSending ? "Sending..." : "Send update"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>

        <div className="space-y-4">
          <ComponentCard
            title="Participants"
            desc="Active staff and customer participants in this dispute."
          >
            <div className="space-y-3 p-4 text-sm">
              {[mediatorProfile, buyerProfile, sellerProfile].map((profile) => (
                <div
                  key={profile.role}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <UserCircle className="h-4 w-4 text-brand-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {profile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {profile.role} - {profile.department}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Online
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Rating: {profile.rating.toFixed(1)}</span>
                    <span>Orders: {profile.totalOrders}</span>
                    <span>Disputes: {profile.disputes}</span>
                    <span>Resolved: {profile.resolved}</span>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Evidence uploads"
            desc="Uploaded files that support the dispute."
          >
            <div className="space-y-3 p-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={evidenceRequest}
                  onChange={(event) => setEvidenceRequest(event.target.value)}
                  placeholder="Request evidence (e.g., invoice or receipt)"
                  className="h-9 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
                <Button size="sm" onClick={handleRequestEvidence} disabled={!evidenceRequest.trim()}>
                  Request
                </Button>
              </div>
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.owner} - {formatTime(item.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.status === "received"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : item.status === "reviewing"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                          : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {item.status !== "received" && (
                      <button
                        type="button"
                        onClick={() => handleEvidenceStatus(item.id, "received")}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        Mark received
                      </button>
                    )}
                    {item.status !== "reviewing" && (
                      <button
                        type="button"
                        onClick={() => handleEvidenceStatus(item.id, "reviewing")}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        Mark reviewing
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEvidenceRemove(item.id)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Previous records"
            desc="Recent dispute history for the buyer and seller."
          >
            <div className="space-y-3 p-4 text-sm text-gray-700 dark:text-gray-300">
              {previousRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {record.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      record.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : record.status === "In Review"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                        : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Case summary"
            desc="Short summary for the mediator."
          >
            <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-brand-500" />
                <p>Buyer reports product damage and missing documentation.</p>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Next step: confirm evidence and propose resolution or partial refund.
              </p>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
