"use client";

import { useCallback, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";

const departments = [
  { id: "dev", name: "Developers" },
  { id: "phone", name: "Phone Department" },
  { id: "managers", name: "Managers" },
  { id: "super", name: "Super Admin" },
  { id: "team", name: "Team Manager" },
  { id: "supervisor", name: "Supervisor" },
  { id: "jobseekers", name: "Jobseekers" },
  { id: "recruiters", name: "Recruiter" },
  { id: "customer", name: "Customer Service" },
  { id: "account", name: "Account Review" },
  { id: "reports", name: "Reports" },
  { id: "updates", name: "Account Updates" },
];

type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  online: boolean;
  lastActive: string;
};

type ChatMessage = {
  id: string;
  sender: "admin" | "staff" | "system";
  text: string;
  timestamp: string;
};

const staffMembers: StaffMember[] = [
  {
    id: "stf-001",
    name: "Ava Brooks",
    role: "Senior Developer",
    department: "dev",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-002",
    name: "Daniel Reed",
    role: "Backend Developer",
    department: "dev",
    online: false,
    lastActive: "Last seen 12m ago",
  },
  {
    id: "stf-003",
    name: "Priya Shah",
    role: "Phone Support Lead",
    department: "phone",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-004",
    name: "Mason Cox",
    role: "Call Coordinator",
    department: "phone",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-005",
    name: "Sophia Turner",
    role: "Operations Manager",
    department: "managers",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-006",
    name: "Liam Wright",
    role: "Super Admin",
    department: "super",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-007",
    name: "Chloe Kim",
    role: "Team Manager",
    department: "team",
    online: false,
    lastActive: "Last seen 48m ago",
  },
  {
    id: "stf-008",
    name: "Owen Park",
    role: "Supervisor",
    department: "supervisor",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-009",
    name: "Nadia Ali",
    role: "Jobseekers Lead",
    department: "jobseekers",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-010",
    name: "Harris Khan",
    role: "Recruiter Ops",
    department: "recruiters",
    online: false,
    lastActive: "Last seen 1h ago",
  },
  {
    id: "stf-011",
    name: "Isla Moore",
    role: "Customer Service",
    department: "customer",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-012",
    name: "Zara Malik",
    role: "Account Review",
    department: "account",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "stf-013",
    name: "Henry Scott",
    role: "Reports Analyst",
    department: "reports",
    online: false,
    lastActive: "Last seen 30m ago",
  },
  {
    id: "stf-014",
    name: "Emma Patel",
    role: "Account Updates",
    department: "updates",
    online: true,
    lastActive: "Active now",
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "msg-001",
    sender: "staff",
    text: "Hey, I am online. What is the query?",
    timestamp: "2025-12-21T09:10:00Z",
  },
  {
    id: "msg-002",
    sender: "admin",
    text: "We need help with a high priority account issue.",
    timestamp: "2025-12-21T09:11:00Z",
  },
];

const staffReplies = [
  "I can take this. Share the details.",
  "Checking now. Give me a minute.",
  "Looping in the team for quick resolution.",
  "Got it, I will update you shortly.",
];

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export default function InternalChatPage() {
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return staffMembers
      .filter((member) => member.department === selectedDept.id)
      .filter((member) =>
        query
          ? member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)
          : true
      );
  }, [searchTerm, selectedDept.id]);

  const selectedStaff = useMemo(
    () => staffMembers.find((member) => member.id === selectedStaffId) ?? null,
    [selectedStaffId]
  );

  const handleSelectStaff = useCallback((member: StaffMember) => {
    setSelectedStaffId(member.id);
    setMessages(initialMessages);
    setDraft("");
  }, []);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text || !selectedStaff) {
      return;
    }

    const now = new Date().toISOString();
    const outgoing: ChatMessage = {
      id: `admin-${now}`,
      sender: "admin",
      text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, outgoing]);
    setDraft("");
    setIsSending(true);

    if (!selectedStaff.online) {
      const systemNote: ChatMessage = {
        id: `system-${Date.now()}`,
        sender: "system",
        text: "This staff member is offline. Your message will be queued.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemNote]);
      setIsSending(false);
      return;
    }

    const replyDelay = 1800;
    const replyText = staffReplies[Math.floor(Math.random() * staffReplies.length)];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `staff-${Date.now()}`,
          sender: "staff",
          text: replyText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsSending(false);
    }, replyDelay);
  }, [draft, selectedStaff]);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Internal Staff Chat
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select a department, then choose a staff member to start a direct chat.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_320px_minmax(0,1fr)]">
        <ComponentCard title="Departments" desc="Pick a team to view staff">
          <div className="flex flex-col gap-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  setSelectedDept(dept);
                  setSearchTerm("");
                  const deptStaff = staffMembers.filter(
                    (member) => member.department === dept.id
                  );
                  if (deptStaff[0]) {
                    handleSelectStaff(deptStaff[0]);
                  } else {
                    setSelectedStaffId("");
                  }
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${selectedDept.id === dept.id
                    ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200"
                    : "border-gray-200 bg-white text-gray-700 hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
                  }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

        </ComponentCard>

        <ComponentCard title="Staff list" desc="Online staff appear first">
          <div className="p-2 md:p-4 space-y-4">
            <Input
              type="text"
              placeholder="Search staff"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-9 rounded-lg text-sm text-gray-700 dark:text-gray-200"
            />

            <div className="flex flex-col gap-3">
              {filteredStaff.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No staff found for this department.
                </p>
              ) : (
                filteredStaff
                  .slice()
                  .sort((a, b) => Number(b.online) - Number(a.online))
                  .map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectStaff(member)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${selectedStaffId === member.id
                          ? "border-brand-200 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10"
                          : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/60"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {member.role}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${member.online
                              ? "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                        >
                          {member.online ? "Online" : "Offline"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {member.lastActive}
                      </p>
                    </button>
                  ))
              )}
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title={selectedStaff ? selectedStaff.name : "Start a conversation"}
          desc={
            selectedStaff
              ? `${selectedStaff.role} · ${selectedDept.name}`
              : "Choose a staff member to chat"
          }
        >
          <div className="p-2 md:p-4 flex flex-col gap-4 h-full">
            <div className="flex-1 space-y-3">
              {messages.map((message) => {
                const isAdmin = message.sender === "admin";
                const isSystem = message.sender === "system";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSystem ? "justify-center" : isAdmin ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[520px] rounded-2xl px-4 py-3 text-sm shadow-sm ${isSystem
                          ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          : isAdmin
                            ? "bg-brand-500/10 text-gray-900 dark:text-white"
                            : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                        <span>{isSystem ? "System" : isAdmin ? "Admin" : "Staff"}</span>
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
                    selectedStaff
                      ? "Type a message for this staff member"
                      : "Select a staff member"
                  }
                  disabled={!selectedStaff}
                  className="text-gray-700 dark:text-gray-200"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedStaff?.online
                      ? "Mock realtime enabled. Replies appear automatically."
                      : "Offline staff will reply when they are back online."}
                  </p>
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={!draft.trim() || !selectedStaff || isSending}
                  >
                    {isSending ? "Sending..." : "Send message"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

