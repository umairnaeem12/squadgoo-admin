"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";

type ChatMode = "live" | "history";

type ChatMessage = {
  id: string;
  sender: "agent" | "customer" | "system";
  text: string;
  timestamp: string;
};

type TicketMeta = {
  id: string;
  status: "pending" | "solved";
  date: string;
};

const ticketMeta: TicketMeta[] = [
  { id: "#323538", status: "pending", date: "2027-04-28" },
  { id: "#323537", status: "solved", date: "2027-04-25" },
  { id: "#323536", status: "pending", date: "2027-03-19" },
  { id: "#323535", status: "pending", date: "2027-03-13" },
  { id: "#323534", status: "solved", date: "2027-02-12" },
];

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const getSeedMessages = (ticketId: string, mode: ChatMode): ChatMessage[] => {
  const base = [
    {
      id: `${ticketId}-m1`,
      sender: "customer" as const,
      text: "Hi, I am still unable to log in after resetting my password.",
      timestamp: "2025-12-20T10:05:00Z",
    },
    {
      id: `${ticketId}-m2`,
      sender: "agent" as const,
      text: "Thanks for reporting this. I am checking your account now.",
      timestamp: "2025-12-20T10:06:30Z",
    },
  ];

  if (mode === "history") {
    return [
      ...base,
      {
        id: `${ticketId}-m3`,
        sender: "customer",
        text: "That fixed it. I can log in again.",
        timestamp: "2025-12-20T10:09:00Z",
      },
      {
        id: `${ticketId}-m4`,
        sender: "agent",
        text: "Great. I will close the ticket as resolved. Reach out if you need anything else.",
        timestamp: "2025-12-20T10:10:00Z",
      },
      {
        id: `${ticketId}-m5`,
        sender: "system",
        text: "Ticket marked as resolved.",
        timestamp: "2025-12-20T10:10:30Z",
      },
    ];
  }

  return base;
};

const customerReplies = [
  "Got it, thank you.",
  "I can confirm the issue now.",
  "That makes sense. Please continue.",
  "Yes, that is the exact error I see.",
];

export default function AdminChatPage() {
  const searchParams = useSearchParams();
  const fallbackTicket = useMemo(() => {
    const latest = [...ticketMeta].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return latest ?? { id: "unknown", status: "pending", date: "" };
  }, []);
  const ticketId = searchParams.get("ticket") ?? fallbackTicket.id;
  const modeParam = searchParams.get("mode");
  const mode = (modeParam ??
    (fallbackTicket.status === "solved" ? "history" : "live")) as ChatMode;
  const isHistory = mode === "history";

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getSeedMessages(ticketId, mode)
  );
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setMessages(getSeedMessages(ticketId, mode));
    setDraft("");
  }, [ticketId, mode]);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text || isHistory) {
      return;
    }
    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
      id: `${ticketId}-agent-${now}`,
      sender: "agent",
      text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    setIsSending(true);

    const replyDelay = 2000;
    const replyText = customerReplies[Math.floor(Math.random() * customerReplies.length)];
    const timeoutId = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${ticketId}-customer-${Date.now()}`,
          sender: "customer",
          text: replyText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsSending(false);
    }, replyDelay);

    return () => clearTimeout(timeoutId);
  }, [draft, isHistory, ticketId]);

  const headerLabel = isHistory ? "Resolved transcript" : "Live support chat";

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ticket {ticketId}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {headerLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/support-tickets"
            className="text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            Back to tickets
          </Link>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isHistory
                ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                : "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200"
            }`}
          >
            {isHistory ? "History" : "Live"}
          </span>
        </div>
      </div>

      <ComponentCard
        title="Conversation"
        desc={
          isHistory
            ? "Read-only transcript for this ticket."
            : "This is a simulated live chat feed."
        }
      >
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            {messages.map((message) => {
              const isAgent = message.sender === "agent";
              const isSystem = message.sender === "system";
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isSystem ? "justify-center" : isAgent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[520px] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isSystem
                        ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        : isAgent
                        ? "bg-brand-500/10 text-gray-900 dark:text-white"
                        : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                      <span>{isSystem ? "System" : isAgent ? "Agent" : "Customer"}</span>
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
                placeholder={
                  isHistory
                    ? "This transcript is read-only"
                    : "Type your response"
                }
                disabled={isHistory}
                className="text-gray-700 dark:text-gray-200"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isHistory
                    ? "You cannot reply on resolved tickets."
                    : "Mock realtime enabled. A reply appears after you send."}
                </p>
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!draft.trim() || isHistory || isSending}
                >
                  {isSending ? "Sending..." : "Send reply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
