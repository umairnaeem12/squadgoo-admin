"use client";

import { useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

type ChatStatus = "active" | "ended";
type Sender = "me" | "staff" | "system";

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
};

type InternalChat = {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  subDepartment: string;
  status: ChatStatus;
  lastMessage: string;
  lastActivity: string;
  issue: string;
  messages: ChatMessage[];
};

type Department = {
  id: string;
  name: string;
  subDepartments: { id: string; name: string }[];
};

type Staff = {
  id: string;
  name: string;
  role: string;
  department: string;
  subDepartment: string;
  online: boolean;
  lastActive: string;
};

const departments: Department[] = [
  {
    id: "it",
    name: "IT Department",
    subDepartments: [
      { id: "it-web", name: "Website Developer" },
      { id: "it-app", name: "App Developer" },
    ],
  },
  {
    id: "recruiter",
    name: "Recruiter Support",
    subDepartments: [
      { id: "rec-phone", name: "Recruiter Phone Support" },
      { id: "rec-ops", name: "Recruiter Operations" },
    ],
  },
  {
    id: "individual",
    name: "Individual Support",
    subDepartments: [
      { id: "ind-phone", name: "Individual Phone Support" },
      { id: "ind-ops", name: "Individual Ops" },
    ],
  },
  {
    id: "disputes",
    name: "Dispute Resolution",
    subDepartments: [
      { id: "disp-market", name: "Marketplace disputes" },
      { id: "disp-jobs", name: "Job disputes" },
    ],
  },
];

const staff: Staff[] = [
  {
    id: "stf-001",
    name: "Ava Brooks",
    role: "Senior Developer",
    department: "it",
    subDepartment: "it-web",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-002",
    name: "Daniel Reed",
    role: "Backend Developer",
    department: "it",
    subDepartment: "it-app",
    online: false,
    lastActive: "Last seen 12m ago",
  },
  {
    id: "stf-003",
    name: "Priya Shah",
    role: "Recruiter Phone Lead",
    department: "recruiter",
    subDepartment: "rec-phone",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-004",
    name: "Mason Cox",
    role: "Recruiter Ops",
    department: "recruiter",
    subDepartment: "rec-ops",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-005",
    name: "Nadia Ali",
    role: "Marketplace Mediator",
    department: "disputes",
    subDepartment: "disp-market",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-006",
    name: "Omar Singh",
    role: "Job Disputes",
    department: "disputes",
    subDepartment: "disp-jobs",
    online: false,
    lastActive: "Last seen 40m ago",
  },
  {
    id: "stf-007",
    name: "Isla Moore",
    role: "Individual Phone Support",
    department: "individual",
    subDepartment: "ind-phone",
    online: true,
    lastActive: "Active now",
  },
];

const initialChats: InternalChat[] = [
  {
    id: "chat-001",
    staffId: "stf-001",
    staffName: "Ava Brooks",
    staffRole: "Senior Developer",
    department: "IT Department",
    subDepartment: "Website Developer",
    status: "active",
    lastMessage: "We need help with a high priority account issue.",
    lastActivity: "2m ago",
    issue: "Account bug - reset flow",
    messages: [
      {
        id: "msg-001",
        sender: "staff",
        text: "Hey, I am online. What is the query?",
        timestamp: "2025-12-21T09:10:00Z",
      },
      {
        id: "msg-002",
        sender: "me",
        text: "We need help with a high priority account issue.",
        timestamp: "2025-12-21T09:11:00Z",
      },
    ],
  },
  {
    id: "chat-002",
    staffId: "stf-003",
    staffName: "Priya Shah",
    staffRole: "Recruiter Phone Lead",
    department: "Recruiter Support",
    subDepartment: "Recruiter Phone Support",
    status: "ended",
    lastMessage: "Closing this chat. Reopen if needed.",
    lastActivity: "1h ago",
    issue: "Callback queue check",
    messages: [
      {
        id: "msg-101",
        sender: "me",
        text: "Can you check recruiter callback queue for LIST-220?",
        timestamp: "2025-12-21T08:05:00Z",
      },
      {
        id: "msg-102",
        sender: "staff",
        text: "All good. Moving one item to tomorrow.",
        timestamp: "2025-12-21T08:06:00Z",
      },
      {
        id: "msg-103",
        sender: "system",
        text: "Chat ended",
        timestamp: "2025-12-21T08:10:00Z",
      },
    ],
  },
  {
    id: "chat-003",
    staffId: "stf-002",
    staffName: "Daniel Reed",
    staffRole: "Backend Developer",
    department: "IT Department",
    subDepartment: "App Developer",
    status: "ended",
    lastMessage: "New build shipped; closing this thread.",
    lastActivity: "2d ago",
    issue: "API latency investigation",
    messages: [
      {
        id: "msg-201",
        sender: "me",
        text: "Seeing higher latency in auth API. Can you check?",
        timestamp: "2025-12-19T14:10:00Z",
      },
      {
        id: "msg-202",
        sender: "staff",
        text: "Investigating. Might be related to DB pool.",
        timestamp: "2025-12-19T14:12:00Z",
      },
      {
        id: "msg-203",
        sender: "system",
        text: "Chat ended. New issues require new chats.",
        timestamp: "2025-12-19T15:00:00Z",
      },
    ],
  },
  {
    id: "chat-004",
    staffId: "stf-007",
    staffName: "Isla Moore",
    staffRole: "Individual Phone Support",
    department: "Individual Support",
    subDepartment: "Individual Phone Support",
    status: "ended",
    lastMessage: "Escalation noted; closing thread.",
    lastActivity: "3d ago",
    issue: "Phone escalation follow-up",
    messages: [
      {
        id: "msg-301",
        sender: "me",
        text: "Need escalation notes for IND-5501.",
        timestamp: "2025-12-18T10:00:00Z",
      },
      {
        id: "msg-302",
        sender: "staff",
        text: "Sent escalation notes via email.",
        timestamp: "2025-12-18T10:15:00Z",
      },
      {
        id: "msg-303",
        sender: "system",
        text: "Chat ended. Start a new chat for new issues.",
        timestamp: "2025-12-18T11:00:00Z",
      },
    ],
  },
];

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const statusTone: Record<ChatStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
  ended:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

export default function InternalChatPage() {
  const [chats, setChats] = useState<InternalChat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(initialChats[0].id);
  const [chatFilter, setChatFilter] = useState<"all" | "active" | "ended">("all");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newDeptId, setNewDeptId] = useState<string>("");
  const [newSubDeptId, setNewSubDeptId] = useState<string>("");
  const [newStaffId, setNewStaffId] = useState<string>("");
  const [newIssue, setNewIssue] = useState<string>("");
  const [staffSearch, setStaffSearch] = useState("");

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  );

  const filteredChats = useMemo(() => {
    if (chatFilter === "all") return chats;
    return chats.filter((chat) => chat.status === chatFilter);
  }, [chats, chatFilter]);

  const visibleStaff = useMemo(() => {
    if (!newDeptId || !newSubDeptId) return [];
    const query = staffSearch.trim().toLowerCase();
    return staff
      .filter(
        (member) =>
          member.department === newDeptId && member.subDepartment === newSubDeptId
      )
      .filter((member) =>
        query
          ? member.name.toLowerCase().includes(query) ||
            member.role.toLowerCase().includes(query)
          : true
      );
  }, [newDeptId, newSubDeptId, staffSearch]);

  const startNewChat = () => {
    if (!newDeptId || !newSubDeptId || !newStaffId) return;
    const staffMember = staff.find((s) => s.id === newStaffId);
    if (!staffMember) return;
    const dept = departments.find((d) => d.id === newDeptId);
    const sub = dept?.subDepartments.find((s) => s.id === newSubDeptId);
    const newChat: InternalChat = {
      id: `chat-${Date.now()}`,
      staffId: staffMember.id,
      staffName: staffMember.name,
      staffRole: staffMember.role,
      department: dept?.name ?? "",
      subDepartment: sub?.name ?? "",
      status: "active",
      issue: newIssue.trim() || "New conversation",
      lastMessage: "New conversation started",
      lastActivity: "Just now",
      messages: [
        {
          id: `system-${Date.now()}`,
          sender: "system",
          text: "New conversation started",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setShowNewChat(false);
    setNewDeptId("");
    setNewSubDeptId("");
    setNewStaffId("");
    setNewIssue("");
    setStaffSearch("");
  };

  const handleSend = () => {
    if (!selectedChat || selectedChat.status === "ended") return;
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toISOString();
    const outgoing: ChatMessage = {
      id: `me-${now}`,
      sender: "me",
      text,
      timestamp: now,
    };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, outgoing],
              lastMessage: text,
              lastActivity: "Just now",
            }
          : chat
      )
    );
    setDraft("");
    setIsSending(true);

    const staffMember = staff.find((s) => s.id === selectedChat.staffId);
    if (!staffMember || !staffMember.online) {
      const systemNote: ChatMessage = {
        id: `system-${Date.now()}`,
        sender: "system",
        text: "Staff is offline. Your message is queued.",
        timestamp: new Date().toISOString(),
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: [...chat.messages, systemNote],
              }
            : chat
        )
      );
      setIsSending(false);
      return;
    }

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `staff-${Date.now()}`,
        sender: "staff",
        text: "Received. I will handle this and update you.",
        timestamp: new Date().toISOString(),
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: [...chat.messages, reply],
                lastMessage: reply.text,
                lastActivity: "Just now",
              }
            : chat
        )
      );
      setIsSending(false);
    }, 1400);
  };

  const handleEndChat = () => {
    if (!selectedChat) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              status: "ended",
              messages: [
                ...chat.messages,
                {
                  id: `system-end-${Date.now()}`,
                  sender: "system",
                  text: "Chat ended. Open a new chat for a new issue.",
                  timestamp: new Date().toISOString(),
                },
              ],
              lastMessage: "Chat ended.",
              lastActivity: "Just now",
            }
          : chat
      )
    );
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Internal Staff Chat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View your chats first. Start a new chat by selecting Department → Sub-department → Staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewChat(true)}>
            New Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatFilter((prev) =>
              prev === "all" ? "active" : prev === "active" ? "ended" : "all"
            )}
          >
            Filter: {chatFilter}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ComponentCard title="My chats" desc="Active and ended conversations">
          <div className="flex flex-col gap-3 md:gap-4 pt-2 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredChats.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                No chats yet. Start a new chat.
              </p>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedChatId === chat.id
                      ? "border-brand-200 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10"
                      : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {chat.staffName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.department} · {chat.subDepartment}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone[chat.status]}`}
                    >
                      {chat.status === "active" ? "Active" : "Ended"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                    {chat.lastMessage}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                    {chat.lastActivity}
                  </p>
                </button>
              ))
            )}
          </div>
        </ComponentCard>

        <div className="space-y-4">
          {showNewChat ? (
            <ComponentCard
              title="Start new chat"
              desc="Department → Sub-department → Staff → Start chat"
            >
              <div className="p-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Department
                    </p>
                    <div className="mt-2 grid gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => {
                            setNewDeptId(dept.id);
                            setNewSubDeptId("");
                            setNewStaffId("");
                          }}
                          className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                            newDeptId === dept.id
                              ? "border-brand-200 bg-brand-50 text-brand-700"
                              : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                          }`}
                        >
                          {dept.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Sub-department
                    </p>
                    <div className="mt-2 grid gap-2">
                      {(departments.find((d) => d.id === newDeptId)?.subDepartments ??
                        []
                      ).map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setNewSubDeptId(sub.id);
                            setNewStaffId("");
                          }}
                          className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                            newSubDeptId === sub.id
                              ? "border-brand-200 bg-brand-50 text-brand-700"
                              : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Staff member
                    </p>
                    <Input
                      type="text"
                      value={staffSearch}
                      onChange={(event) => setStaffSearch(event.target.value)}
                      placeholder="Search staff"
                      className="h-9 w-56 rounded-lg text-sm"
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {visibleStaff.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select department and sub-department to see staff.
                      </p>
                    ) : (
                      visibleStaff.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setNewStaffId(member.id)}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                            newStaffId === member.id
                              ? "border-brand-200 bg-brand-50 text-brand-700"
                              : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {member.role}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                              member.online
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {member.online ? "Online" : "Offline"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Issue / context</Label>
                  <Input
                    type="text"
                    value={newIssue}
                    onChange={(event) => setNewIssue(event.target.value)}
                    placeholder="What is this chat about?"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewChat(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={startNewChat}
                    disabled={!newDeptId || !newSubDeptId || !newStaffId}
                  >
                    Start chat
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ) : (
            <ComponentCard
              title={
                    selectedChat
                      ? `${selectedChat.staffName} — ${selectedChat.staffRole}`
                      : "Select a chat"
              }
              desc={
                selectedChat
                  ? `${selectedChat.department} · ${selectedChat.subDepartment}`
                  : "Choose a chat from the list or start a new one."
              }
            >
              {selectedChat ? (
                <div className="p-4 flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone[selectedChat.status]}`}
                      >
                        {selectedChat.status === "active" ? "Active" : "Chat ended"}
                      </span>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                        Issue: {selectedChat.issue}
                      </p>
                    </div>
                    {selectedChat.status === "active" && (
                      <Button variant="outline" size="sm" onClick={handleEndChat}>
                        End chat
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {selectedChat.messages.map((message, index) => {
                      const isMe = message.sender === "me";
                      const isSystem = message.sender === "system";
                      const prev = selectedChat.messages[index - 1];
                      const showDivider =
                        !isSystem &&
                        prev?.sender === "system" &&
                        prev.text.toLowerCase().includes("ended");
                      return (
                        <div key={message.id}>
                          {showDivider && (
                            <div className="my-2 text-center text-[11px] uppercase tracking-[0.3em] text-gray-400">
                              Previous conversation (ended)
                            </div>
                          )}
                          <div
                            className={`flex ${
                              isSystem ? "justify-center" : isMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[620px] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                isSystem
                                  ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                  : isMe
                                  ? "bg-brand-500/10 text-gray-900 dark:text-white"
                                  : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                                <span>
                                  {isSystem ? "System" : isMe ? "Me" : selectedChat.staffName}
                                </span>
                                <span className="normal-case tracking-normal">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-relaxed">{message.text}</p>
                            </div>
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
                          selectedChat.status === "ended"
                            ? "This chat is read-only. Start a new chat to continue."
                            : "Type a message for this staff member"
                        }
                        disabled={selectedChat.status === "ended"}
                        className="text-gray-700 dark:text-gray-200"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedChat.status === "ended"
                            ? "Chat ended. Start a new chat for a new issue."
                            : "Active chat. Replies appear automatically (simulated)."}
                        </p>
                        <Button
                          size="sm"
                          onClick={handleSend}
                          disabled={
                            !draft.trim() ||
                            !selectedChat ||
                            isSending ||
                            selectedChat.status === "ended"
                          }
                        >
                          {selectedChat.status === "ended"
                            ? "Read only"
                            : isSending
                            ? "Sending..."
                            : "Send message"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  Select a chat from the left or start a new chat.
                </div>
              )}
            </ComponentCard>
          )}
        </div>
      </div>
    </div>
  );
}
