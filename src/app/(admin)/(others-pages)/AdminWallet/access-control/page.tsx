"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

type AccessRequestStatus =
  | "pending"
  | "approved_full"
  | "approved_limited"
  | "denied"
  | "expired";

type AccessRequest = {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  rating: number;
  requestedSection: string;
  reason: string;
  status: AccessRequestStatus;
  submittedAt: string;
  reviewer: string;
  decisionNote?: string;
  expiryAt?: string;
  pastAccess: string;
  currentPermissions: string[];
  activitySummary: string;
  accessHistory: string[];
};

const accessStatusMeta: Record<
  AccessRequestStatus,
  { label: string; tone: string }
> = {
  pending: {
    label: "Pending review",
    tone: "bg-warning-100 text-warning-700",
  },
  approved_full: {
    label: "Approved – Full Access",
    tone: "bg-success-100 text-success-700",
  },
  approved_limited: {
    label: "Approved – Time Limited",
    tone: "bg-brand-50 text-brand-700",
  },
  denied: {
    label: "Denied",
    tone: "bg-error-100 text-error-700",
  },
  expired: {
    label: "Expired (auto)",
    tone: "bg-gray-100 text-gray-600",
  },
};

const initialAccessRequests: AccessRequest[] = [
  {
    id: "REQ-9301",
    staffId: "st-2",
    staffName: "Ravi Kumar",
    role: "Finance Analyst",
    department: "Finance",
    rating: 4.6,
    requestedSection: "SSG Coin",
    reason: "Need SSG Coin access to reconcile a high-value withdrawal dispute.",
    status: "pending",
    submittedAt: "2027-04-01T08:20:00Z",
    reviewer: "Super Admin",
    pastAccess: "Had 30-minute conditional access during February audit.",
    currentPermissions: ["Wallet exports (read-only)", "Finance tickets"],
    activitySummary: "Resolved 6 finance tickets in last 24h, SLA 98%.",
    accessHistory: [
      "Mar 12: Access removed after shift end.",
      "Feb 02: Conditional access expired automatically.",
    ],
  },
  {
    id: "REQ-9302",
    staffId: "st-5",
    staffName: "Hina Noor",
    role: "Risk Ops Lead",
    department: "Risk",
    rating: 4.9,
    requestedSection: "SSG Coin",
    reason: "Investigating SG Coin risk anomalies flagged by monitoring.",
    status: "approved_limited",
    submittedAt: "2027-04-01T07:55:00Z",
    reviewer: "Super Admin",
    decisionNote: "Approved for short window to inspect anomalies.",
    expiryAt: "2027-04-01T08:25:00Z",
    pastAccess: "Granted full access during incident review last quarter.",
    currentPermissions: ["Risk dashboard", "Dispute review"],
    activitySummary: "Flagged 3 high-risk wallets in last 48h.",
    accessHistory: [
      "Apr 01: Conditional access approved for 30 minutes.",
      "Mar 18: Full access revoked after incident closure.",
    ],
  },
  {
    id: "REQ-9303",
    staffId: "st-6",
    staffName: "Marcus Lee",
    role: "Ops Supervisor",
    department: "Operations",
    rating: 4.3,
    requestedSection: "SSG Coin",
    reason: "Needs SG Coin visibility to confirm a partner payout.",
    status: "denied",
    submittedAt: "2027-03-31T18:10:00Z",
    reviewer: "Super Admin",
    decisionNote: "Outside scope; route via Finance.",
    pastAccess: "No prior SSG Coin access.",
    currentPermissions: ["Operations dashboard", "Payout queue (view)"],
    activitySummary: "Handles escalations; 2 payouts reassigned today.",
    accessHistory: [
      "Mar 31: Request denied - not in Finance/Risk.",
      "Feb 20: Asked for export; redirected to Finance.",
    ],
  },
];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function AccessControlPage() {
  const [accessRequests, setAccessRequests] =
    useState<AccessRequest[]>(initialAccessRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    initialAccessRequests[0]?.id ?? null
  );
  const [requestForm, setRequestForm] = useState({
    staffId: "st-9",
    staffName: "Nadia Ali",
    role: "Finance Ops",
    department: "Finance",
    reason: "",
  });
  const [decisionNote, setDecisionNote] = useState("");
  const [limitMinutes, setLimitMinutes] = useState("15");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRequest =
    accessRequests.find((item) => item.id === selectedRequestId) ||
    accessRequests[0] ||
    null;

  const pendingCount = useMemo(
    () => accessRequests.filter((req) => req.status === "pending").length,
    [accessRequests]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setAccessRequests((prev) =>
        prev.map((req) => {
          if (
            req.status === "approved_limited" &&
            req.expiryAt &&
            new Date(req.expiryAt).getTime() <= Date.now()
          ) {
            const note = "Conditional access expired automatically.";
            return {
              ...req,
              status: "expired",
              decisionNote: note,
              accessHistory: [
                `Access auto-expired ${formatDateTime(
                  new Date().toISOString()
                )}`,
                ...req.accessHistory,
              ],
            };
          }
          return req;
        })
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const updateRequestDecision = (
    id: string,
    status: AccessRequestStatus,
    note?: string,
    expiryAt?: string
  ) => {
    const decidedAt = new Date().toISOString();
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              decisionNote: note,
              expiryAt,
              reviewer: "Super Admin",
              accessHistory: [
                `${accessStatusMeta[status].label} at ${formatDateTime(
                  decidedAt
                )}${note ? ` — ${note}` : ""}${
                  expiryAt ? ` (expires ${formatDateTime(expiryAt)})` : ""
                }`,
                ...req.accessHistory,
              ],
            }
          : req
      )
    );
    setToastMessage(accessStatusMeta[status].label);
  };

  const handleSubmitAccessRequest = () => {
    if (
      !requestForm.staffId.trim() ||
      !requestForm.staffName.trim() ||
      !requestForm.role.trim()
    ) {
      setToastMessage("Fill Staff ID, name, and role to submit.");
      return;
    }
    if (!requestForm.reason.trim()) {
      setToastMessage("Add a reason for requesting SSG Coin access.");
      return;
    }
    const now = new Date().toISOString();
    const newRequest: AccessRequest = {
      id: `REQ-${accessRequests.length + 9301}`,
      staffId: requestForm.staffId.trim(),
      staffName: requestForm.staffName.trim(),
      role: requestForm.role.trim(),
      department: requestForm.department,
      rating: 4.5,
      requestedSection: "SSG Coin",
      reason: requestForm.reason.trim(),
      status: "pending",
      submittedAt: now,
      reviewer: "Super Admin",
      pastAccess: "No prior SSG Coin access for this staff member.",
      currentPermissions: ["Finance tickets (view)", "Operations dashboard"],
      activitySummary: "Recent activity will be shown here for review.",
      accessHistory: [`Request submitted at ${formatDateTime(now)}`],
    };
    setAccessRequests((prev) => [newRequest, ...prev]);
    setSelectedRequestId(newRequest.id);
    setRequestForm((prev) => ({ ...prev, reason: "" }));
    setToastMessage("Request submitted to Super Admin. Status: Pending.");
  };

  const handleApproveFull = () => {
    if (!selectedRequest) return;
    const note =
      decisionNote.trim() || "Full access granted by Super Admin.";
    updateRequestDecision(selectedRequest.id, "approved_full", note);
    setDecisionNote("");
  };

  const handleApproveLimited = () => {
    if (!selectedRequest) return;
    const minutes = Number.parseInt(limitMinutes, 10);
    if (Number.isNaN(minutes) || minutes <= 0) {
      setToastMessage("Add a valid access duration in minutes.");
      return;
    }
    const expiry = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const note =
      decisionNote.trim() || `Time-bound access for ${minutes} minutes.`;
    updateRequestDecision(
      selectedRequest.id,
      "approved_limited",
      note,
      expiry
    );
    setDecisionNote("");
  };

  const handleDeny = () => {
    if (!selectedRequest) return;
    if (!decisionNote.trim()) {
      setToastMessage("Denial requires a reason.");
      return;
    }
    updateRequestDecision(
      selectedRequest.id,
      "denied",
      decisionNote.trim()
    );
    setDecisionNote("");
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SSG Coin Access Control
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Full-screen workspace for reviewing and deciding on SSG Coin
            access requests.
          </p>
        </div>
        <Link href="/AdminWallet">
          <Button variant="outline" size="sm">
            Back to wallet
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <ComponentCard
          title="Submit access request"
          desc="Staff cannot access SSG Coin until approved."
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Routes to: Super Admin
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  accessStatusMeta[selectedRequest?.status ?? "pending"].tone
                }`}
              >
                {accessStatusMeta[selectedRequest?.status ?? "pending"].label}
              </span>
            </div>
            <div className="space-y-1.5">
              <Label>Staff ID</Label>
              <Input
                value={requestForm.staffId}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    staffId: event.target.value,
                  }))
                }
                placeholder="e.g. st-901"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Staff name</Label>
              <Input
                value={requestForm.staffName}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    staffName: event.target.value,
                  }))
                }
                placeholder="Name requesting access"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input
                value={requestForm.role}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }))
                }
                placeholder="Role / title"
              />
            </div>
            <div>
              <Label>Department</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["Finance", "Risk", "Dispute", "Operations"].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() =>
                      setRequestForm((prev) => ({ ...prev, department: dept }))
                    }
                    className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                      requestForm.department === dept
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-gray-200 bg-white hover:border-brand-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason for requesting access</Label>
              <TextArea
                rows={4}
                value={requestForm.reason}
                onChange={(value) =>
                  setRequestForm((prev) => ({ ...prev, reason: value }))
                }
                placeholder="Explain why access is needed"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{pendingCount} pending</span>
              <Button size="sm" onClick={handleSubmitAccessRequest}>
                Submit access request
              </Button>
            </div>
          </div>
        </ComponentCard>

        <div className="space-y-4">
          <ComponentCard
            title="Requests to review"
            desc="Routed to Super Admin"
            className=""
          >
            <div className="p-3 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {accessRequests.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                    selectedRequestId === req.id
                      ? "border-brand-200 bg-brand-50"
                      : "border-gray-200 bg-white hover:border-brand-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {req.staffName} · {req.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {req.staffId} • {req.department}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Requested: {formatDateTime(req.submittedAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${accessStatusMeta[req.status].tone}`}
                    >
                      {accessStatusMeta[req.status].label}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600">
                    {req.reason}
                  </p>
                </button>
              ))}
            </div>
          </ComponentCard>

          {selectedRequest ? (
            <ComponentCard
              title={`${selectedRequest.staffName} — ${selectedRequest.role}`}
              desc={`${selectedRequest.department} • Staff ID ${selectedRequest.staffId} • Rating ${selectedRequest.rating.toFixed(
                1
              )}/5`}
            >
              <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${accessStatusMeta[selectedRequest.status].tone}`}
                  >
                    {accessStatusMeta[selectedRequest.status].label}
                  </span>
                  {selectedRequest.expiryAt && (
                    <span className="text-xs text-gray-500">
                      Expires {formatDateTime(selectedRequest.expiryAt)}
                    </span>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold text-gray-800">
                      Requested access
                    </p>
                    <p>Section: {selectedRequest.requestedSection}</p>
                    <p>Reason: {selectedRequest.reason}</p>
                    <p>Submitted: {formatDateTime(selectedRequest.submittedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold text-gray-800">
                      Staff profile snapshot
                    </p>
                    <p>{selectedRequest.activitySummary}</p>
                    <p className="mt-1">Past access: {selectedRequest.pastAccess}</p>
                    <p className="mt-1">
                      Current permissions:{" "}
                      {selectedRequest.currentPermissions.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Decision note / reason</Label>
                    <TextArea
                      rows={3}
                      value={decisionNote}
                      onChange={setDecisionNote}
                      placeholder="Required for denial; add context for approvals"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] items-end">
                    <div>
                      <Label>Time-limited duration (minutes)</Label>
                      <Input
                        value={limitMinutes}
                        onChange={(event) => setLimitMinutes(event.target.value)}
                        placeholder="e.g. 15"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[5, 10, 15, 30, 60].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setLimitMinutes(String(m))}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              limitMinutes === String(m)
                                ? "bg-brand-100 text-brand-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Button variant="outline" size="sm" onClick={handleDeny}>
                        Deny (reason required)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApproveLimited}
                      >
                        Grant time-limited
                      </Button>
                      <Button size="sm" onClick={handleApproveFull}>
                        Grant full access
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold text-gray-800">Staff view</p>
                    <p className="mt-1">
                      Decision: {accessStatusMeta[selectedRequest.status].label}
                    </p>
                    {selectedRequest.decisionNote && (
                      <p className="mt-1">Reason: {selectedRequest.decisionNote}</p>
                    )}
                    {selectedRequest.expiryAt && (
                      <p className="mt-1">
                        Access expiry: {formatDateTime(selectedRequest.expiryAt)}
                      </p>
                    )}
                    {selectedRequest.status === "expired" && (
                      <p className="mt-1 text-error-600">
                        Access removed automatically after expiry.
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold text-gray-800">
                      Notifications & audit
                    </p>
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto pr-1">
                      {selectedRequest.accessHistory.map((entry, idx) => (
                        <p key={idx} className="leading-5">
                          • {entry}
                        </p>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-500">
                      Super Admin is notified on new requests. Staff are notified on
                      approval, conditional approval, denial, and expiry.
                    </p>
                  </div>
                </div>
              </div>
            </ComponentCard>
          ) : (
            <ComponentCard title="Select a request" desc="Choose a request to review">
              <div className="p-6 text-center text-sm text-gray-500">
                Pick a request from the left column to view details and act.
              </div>
            </ComponentCard>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="pointer-events-none fixed inset-0 z-[100000] flex justify-end items-start px-4 pt-6">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-brand-200 bg-white/95 px-4 py-3 text-sm font-medium text-brand-600 shadow-lg shadow-brand-400/30 backdrop-blur"
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
