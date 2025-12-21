
"use client";

import { useMemo, useRef, useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { Modal } from "@/components/ui/modal";
import {
  AlertTriangle,
  CheckCircle,
  CircleDot,
  Download,
  FileSpreadsheet,
  Lock,
  MoreHorizontal,
  RefreshCcw,
  ShieldCheck,
  UserSearch,
} from "lucide-react";

type WalletTab = "marketplace" | "withdrawals" | "purchases";

type WalletStatus = "hold" | "pending" | "dispute" | "completed" | "returned";

type WalletTransaction = {
  id: string;
  tab: WalletTab;
  type: string;
  party: string;
  amount: string;
  status: WalletStatus;
  createdAt: string;
};

type RefundRequest = {
  id: string;
  tab: WalletTab;
  type: string;
  user: string;
  amount: string;
  status: "requested" | "approved" | "released" | "denied";
  createdAt: string;
};

type WithdrawalRequest = {
  id: string;
  user: string;
  method: string;
  amount: string;
  status: "pending" | "approved" | "denied" | "needs_info";
  createdAt: string;
  reviewedBy?: string;
  reviewNote?: string;
};

type NoteEntry = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type StaffMember = {
  id: string;
  name: string;
  department: string;
  online: boolean;
};

type Assignment = {
  assignee: string;
  assignedBy: string;
  assignedAt: string;
};

const tabs: { id: WalletTab; label: string }[] = [
  { id: "marketplace", label: "Marketplace" },
  { id: "withdrawals", label: "Withdrawals" },
  { id: "purchases", label: "Purchases" },
];

const marketplaceBuyers = [
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
  "Leah Santos",
  "Evan Carter",
  "Zara Ali",
  "Kian Malik",
  "Hugo Price",
];

const marketplaceSellers = [
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

const purchaseItems = [
  "Account upgrade",
  "Extras bundle",
  "Priority badge",
  "Premium insights",
  "Recruiter Plus Pack",
];

const purchaseParties = [
  "Squad Courier PRO",
  "Premium Insights",
  "Recruiter Plus Pack",
  "TalentMatch HR",
  "Logistics Elite",
  "Hiring Boost",
  "Account Shield",
];

const withdrawalUsers = [
  "Ayesha Khan",
  "Lindsey Curtis",
  "Ravi Kumar",
  "Sarah Ellis",
  "Marcus Lee",
  "Sana Ali",
  "Noah Brooks",
  "Priya Singh",
  "Jaden Lewis",
  "Mariam Noor",
  "Owen Carter",
  "Kira Patel",
];

const refundUsers = [
  "Mia Collins",
  "Jasmine Patel",
  "Rakesh Sharma",
  "Omar Daniels",
  "Hina Noor",
  "Marcus Lee",
  "Sana Ali",
  "Noah Brooks",
  "Priya Singh",
  "Recruiter Plus Pack",
  "TalentMatch HR",
  "Premium Insights",
];

const statusCycle: WalletStatus[] = ["hold", "pending", "completed", "dispute"];
const refundStatusCycle: RefundRequest["status"][] = [
  "requested",
  "approved",
  "released",
  "denied",
];
const withdrawalStatusCycle: WithdrawalRequest["status"][] = [
  "pending",
  "approved",
  "denied",
  "needs_info",
];

const makeDate = (index: number) => {
  const base = new Date(2027, 3, 1);
  base.setDate(base.getDate() + index);
  return base.toISOString().slice(0, 10);
};

const buildTransactions = (count: number): WalletTransaction[] => {
  const list: WalletTransaction[] = [];
  for (let i = 0; i < count; i += 1) {
    const tabIndex = i % 3;
    const id = `TX-${9001 + i}`;
    const createdAt = makeDate(i % 30);
    if (tabIndex === 0) {
      const buyer = marketplaceBuyers[i % marketplaceBuyers.length];
      const seller = marketplaceSellers[(i + 3) % marketplaceSellers.length];
      list.push({
        id,
        tab: "marketplace",
        type: i % 4 === 0 ? "Courier fee" : "Marketplace order",
        party: `${buyer} -> ${seller}`,
        amount: `-${180 + (i % 12) * 120} SG`,
        status: statusCycle[i % statusCycle.length],
        createdAt,
      });
    } else if (tabIndex === 1) {
      const user = withdrawalUsers[i % withdrawalUsers.length];
      list.push({
        id,
        tab: "withdrawals",
        type: "Withdrawal",
        party: user,
        amount: `-${420 + (i % 9) * 95} SG`,
        status: statusCycle[i % statusCycle.length],
        createdAt,
      });
    } else {
      const party = purchaseParties[i % purchaseParties.length];
      list.push({
        id,
        tab: "purchases",
        type: purchaseItems[i % purchaseItems.length],
        party,
        amount: `+${35 + (i % 8) * 20} SG`,
        status: i % 5 === 0 ? "pending" : "completed",
        createdAt,
      });
    }
  }
  return list;
};

const buildRefunds = (count: number): RefundRequest[] => {
  const list: RefundRequest[] = [];
  for (let i = 0; i < count; i += 1) {
    const tabIndex = i % 3;
    const id = `RF-${101 + i}`;
    const createdAt = makeDate((i + 2) % 30);
    if (tabIndex === 0) {
      list.push({
        id,
        tab: "marketplace",
        type: i % 2 === 0 ? "Marketplace refund" : "Marketplace release",
        user: refundUsers[i % refundUsers.length],
        amount: `${180 + (i % 12) * 120} SG`,
        status: refundStatusCycle[i % refundStatusCycle.length],
        createdAt,
      });
    } else if (tabIndex === 1) {
      list.push({
        id,
        tab: "withdrawals",
        type: "Withdrawal reversal",
        user: withdrawalUsers[i % withdrawalUsers.length],
        amount: `${420 + (i % 9) * 95} SG`,
        status: refundStatusCycle[i % refundStatusCycle.length],
        createdAt,
      });
    } else {
      list.push({
        id,
        tab: "purchases",
        type: "Purchase refund",
        user: purchaseParties[i % purchaseParties.length],
        amount: `${35 + (i % 8) * 20} SG`,
        status: refundStatusCycle[i % refundStatusCycle.length],
        createdAt,
      });
    }
  }
  return list;
};

const buildWithdrawals = (count: number): WithdrawalRequest[] => {
  const list: WithdrawalRequest[] = [];
  for (let i = 0; i < count; i += 1) {
    const id = `WD-${5001 + i}`;
    const user = withdrawalUsers[i % withdrawalUsers.length];
    const status = withdrawalStatusCycle[i % withdrawalStatusCycle.length];
    list.push({
      id,
      user,
      method: i % 2 === 0 ? "Bank transfer" : "AUD payout",
      amount: `${420 + (i % 10) * 115} SG`,
      status,
      createdAt: makeDate((i + 5) % 30),
      reviewedBy: status === "approved" ? "Finance Lead" : undefined,
      reviewNote: status === "denied" ? "Verification expired." : undefined,
    });
  }
  return list;
};

const initialTransactions = buildTransactions(150);
const initialRefunds = buildRefunds(120);
const initialWithdrawals = buildWithdrawals(90);

const departments = ["Finance", "Dispute", "Risk", "Operations"];

const staffDirectory: StaffMember[] = [
  { id: "st-1", name: "Ayesha Khan", department: "Finance", online: true },
  { id: "st-2", name: "Ravi Kumar", department: "Finance", online: false },
  { id: "st-3", name: "Sarah Ellis", department: "Dispute", online: true },
  { id: "st-4", name: "Noah Brooks", department: "Dispute", online: false },
  { id: "st-5", name: "Hina Noor", department: "Risk", online: true },
  { id: "st-6", name: "Marcus Lee", department: "Operations", online: true },
  { id: "st-7", name: "Priya Singh", department: "Operations", online: false },
  { id: "st-8", name: "Zara Ali", department: "Risk", online: true },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const getStatusClass = (status: WalletStatus) => {
  if (status === "hold") {
    return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
  }
  if (status === "dispute") {
    return "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-200";
  }
  if (status === "returned") {
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
  }
  if (status === "pending") {
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }
  return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
};

const getRefundStatusClass = (status: RefundRequest["status"]) => {
  if (status === "requested") {
    return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
  }
  if (status === "denied") {
    return "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-200";
  }
  if (status === "released") {
    return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
  }
  return "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200";
};

const getWithdrawalStatusClass = (status: WithdrawalRequest["status"]) => {
  if (status === "pending") {
    return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
  }
  if (status === "needs_info") {
    return "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200";
  }
  if (status === "denied") {
    return "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-200";
  }
  return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
};
export default function AdminWalletPage() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WalletTab>("marketplace");

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const [transactions, setTransactions] = useState(initialTransactions);
  const [refunds, setRefunds] = useState(initialRefunds);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [notes, setNotes] = useState<Record<string, NoteEntry[]>>({});
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [modalState, setModalState] = useState<
    | null
    | {
      type:
      | "return"
      | "deny"
      | "info"
      | "note"
      | "notes"
      | "release";
      id: string;
    }
  >(null);
  const [modalInput, setModalInput] = useState("");
  const [modalAmount, setModalAmount] = useState("0");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTargetId, setAssignTargetId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [staffQuery, setStaffQuery] = useState("");

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      if (openMenuId) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleAccessRequest = () => {
    setHasAccess(true);
    setShowAccessModal(false);
    setAccessReason("");
    setToastMessage("Access request sent to the finance admin.");
  };

  const handleRangeChange = (selectedDates: Date[], dateStr: string) => {
    if (!selectedDates.length) {
      setRangeStart("");
      setRangeEnd("");
      return;
    }
    if (selectedDates.length === 1) {
      setRangeStart(dateStr);
      setRangeEnd("");
      return;
    }
    const [start, end] = dateStr.split(" to ");
    setRangeStart(start || "");
    setRangeEnd(end || "");
  };

  const filterByCommon = useMemo(() => {
    const query = nameQuery.trim().toLowerCase();
    const idSearch = idQuery.trim().toLowerCase();
    const startTimestamp = rangeStart
      ? new Date(rangeStart).setHours(0, 0, 0, 0)
      : null;
    const endTimestamp = rangeEnd
      ? new Date(rangeEnd).setHours(23, 59, 59, 999)
      : null;

    return { query, idSearch, startTimestamp, endTimestamp };
  }, [nameQuery, idQuery, rangeStart, rangeEnd]);

  const filteredTransactions = useMemo(() => {
    const { query, idSearch, startTimestamp, endTimestamp } = filterByCommon;
    return transactions
      .filter((txn) => txn.tab === activeTab)
      .filter((txn) =>
        statusFilter === "all" ? true : txn.status === statusFilter
      )
      .filter((txn) => (typeFilter === "all" ? true : txn.type === typeFilter))
      .filter((txn) =>
        query ? txn.party.toLowerCase().includes(query) : true
      )
      .filter((txn) =>
        idSearch ? txn.id.toLowerCase().includes(idSearch) : true
      )
      .filter((txn) => {
        if (!startTimestamp && !endTimestamp) {
          return true;
        }
        const created = new Date(txn.createdAt).getTime();
        if (startTimestamp !== null && created < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && created > endTimestamp) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, activeTab, statusFilter, typeFilter, filterByCommon]);

  const filteredRefunds = useMemo(() => {
    const { query, idSearch, startTimestamp, endTimestamp } = filterByCommon;
    return refunds
      .filter((item) => item.tab === activeTab)
      .filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      )
      .filter((item) => (typeFilter === "all" ? true : item.type === typeFilter))
      .filter((item) =>
        query ? item.user.toLowerCase().includes(query) : true
      )
      .filter((item) =>
        idSearch ? item.id.toLowerCase().includes(idSearch) : true
      )
      .filter((item) => {
        if (!startTimestamp && !endTimestamp) {
          return true;
        }
        const created = new Date(item.createdAt).getTime();
        if (startTimestamp !== null && created < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && created > endTimestamp) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [refunds, activeTab, statusFilter, typeFilter, filterByCommon]);

  const filteredWithdrawals = useMemo(() => {
    if (activeTab !== "withdrawals") {
      return [] as WithdrawalRequest[];
    }
    const { query, idSearch, startTimestamp, endTimestamp } = filterByCommon;
    return withdrawals
      .filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      )
      .filter((item) => (typeFilter === "all" ? true : item.method === typeFilter))
      .filter((item) =>
        query ? item.user.toLowerCase().includes(query) : true
      )
      .filter((item) =>
        idSearch ? item.id.toLowerCase().includes(idSearch) : true
      )
      .filter((item) => {
        if (!startTimestamp && !endTimestamp) {
          return true;
        }
        const created = new Date(item.createdAt).getTime();
        if (startTimestamp !== null && created < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && created > endTimestamp) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [withdrawals, activeTab, statusFilter, typeFilter, filterByCommon]);

  const typeOptions = useMemo(() => {
    if (activeTab === "withdrawals") {
      return ["all", "Bank transfer", "AUD payout"];
    }
    if (activeTab === "purchases") {
      return ["all", "Account upgrade", "Extras bundle"];
    }
    return ["all", "Marketplace order", "Courier fee"];
  }, [activeTab]);

  const statusOptions = useMemo(() => {
    if (activeTab === "withdrawals") {
      return ["all", "pending", "approved", "denied", "needs_info"];
    }
    return ["all", "hold", "pending", "dispute", "completed"];
  }, [activeTab]);

  const handleAddNote = (targetId: string, text: string) => {
    if (!text.trim()) {
      return;
    }
    const note: NoteEntry = {
      id: `note-${Date.now()}`,
      author: "Finance Admin",
      text,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] ?? []), note],
    }));
  };

  const handleWork = (transactionId: string) => {
    const timestamp = new Date().toISOString();
    setAssignments((prev) => ({
      ...prev,
      [transactionId]: {
        assignee: "You (Admin)",
        assignedBy: "You (Admin)",
        assignedAt: timestamp,
      },
    }));
    setToastMessage("Work request sent. You are now assigned to this transaction.");
  };

  const handleAssign = (transactionId: string, staff: StaffMember) => {
    const timestamp = new Date().toISOString();
    setAssignments((prev) => ({
      ...prev,
      [transactionId]: {
        assignee: staff.name,
        assignedBy: "You (Admin)",
        assignedAt: timestamp,
      },
    }));
    setAssignModalOpen(false);
    setAssignTargetId(null);
    setStaffQuery("");
    setToastMessage(`Assigned to ${staff.name} (${staff.department}).`);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const filteredStaff = useMemo(() => {
    const query = staffQuery.trim().toLowerCase();
    return staffDirectory.filter(
      (staff) =>
        staff.department === selectedDepartment &&
        (query ? staff.name.toLowerCase().includes(query) : true)
    );
  }, [selectedDepartment, staffQuery]);

  const handleTransactionStatus = (id: string, status: WalletStatus) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, status } : txn))
    );
  };

  const handleRefundStatus = (id: string, status: RefundRequest["status"]) => {
    setRefunds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleWithdrawalReview = (
    id: string,
    status: WithdrawalRequest["status"],
    note?: string
  ) => {
    setWithdrawals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            status,
            reviewedBy: "Finance Admin",
            reviewNote: note || item.reviewNote,
          }
          : item
      )
    );
  };

  const currentNotes = modalState?.id ? notes[modalState.id] ?? [] : [];

  const isFilterActive =
    !!rangeStart ||
    !!rangeEnd ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    nameQuery.trim() !== "" ||
    idQuery.trim() !== "";

  const handleClearFilters = () => {
    setRangeStart('');
    setRangeEnd('');
    setStatusFilter("all");
    setTypeFilter("all");
    setNameQuery("");
    setIdQuery("");
  };

  // const datePickerKey =
  //   rangeStart && rangeEnd ? `${rangeStart}-${rangeEnd}` : "empty";

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const datePickerKey =
    rangeStart && rangeEnd
      ? `${formatDate(rangeStart)}-${formatDate(rangeEnd)}`
      : "empty";

  const defaultDateValue =
    rangeStart && rangeEnd
      ? `${formatDate(rangeStart)} to ${formatDate(rangeEnd)}`
      : undefined;


  if (!hasAccess) {
    return (
      <div className="p-2 md:p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Platform Wallet (SG Coins)
        </h1>
        <ComponentCard
          title="Access restricted"
          desc="Only finance team members can view wallet operations."
        >
          <div className="p-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="rounded-full bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Lock className="h-5 w-5" />
              </span>
              <p className="text-sm">
                Your access request will be sent to a finance admin for approval.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAccessModal(true)}>
              Request access
            </Button>
          </div>
        </ComponentCard>

        <Modal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Request finance access
            </h3>
            <TextArea
              rows={4}
              value={accessReason}
              onChange={setAccessReason}
              placeholder="Explain why you need wallet access"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAccessModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAccessRequest}>
                Send request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Platform Wallet (SG Coins)
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Finance operations for holds, disputes, withdrawals, and purchases.
          </p>
        </div>
        <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-300 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ComponentCard title="Summary" desc="Key wallet KPIs for the platform.">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
          <SummaryTile
            icon={<ShieldCheck className="h-5 w-5 text-brand-500" />}
            label="Total SG Coins in circulation"
            value="1,250,000 SG"
          />
          <SummaryTile
            icon={<CircleDot className="h-5 w-5 text-warning-500" />}
            label="On hold in disputes"
            value="5,270 SG"
          />
          <SummaryTile
            icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
            label="Pending withdrawals"
            value="18,400 SG"
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Filters" desc="Filter by date, status, type, name, and ID.">
        {/* Clear filters action */}
        {isFilterActive && (
          <div className="flex justify-end px-3 pt-3 md:px-4">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grid keeps everything aligned and consistent */}
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:p-4 lg:grid-cols-5">
          {/* Date range */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Date range
            </span>

            {/* If your DatePicker supports className / inputClassName, apply h-10 to match */}
            <div className="mt-1">
              <DatePicker
                key={datePickerKey}
                id="wallet-date-range"
                mode="range"
                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                defaultDate={defaultDateValue}
                onChange={handleRangeChange}
                inputClassName="
    h-10
    pr-10
    text-sm
    text-gray-800
    placeholder:text-gray-400
    caret-gray-700
    dark:text-gray-100
    dark:caret-gray-100
    dark:placeholder:text-gray-500
  "
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Status
            </span>
            <div className="mt-1 flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none dark:text-gray-100"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Type
            </span>
            <div className="mt-1 flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none dark:text-gray-100"
              >
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Name
            </span>
            <div className="mt-1 flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <UserSearch className="h-4 w-4 text-gray-400" />
              <input
                value={nameQuery}
                onChange={(event) => setNameQuery(event.target.value)}
                placeholder="Search name"
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
              />
            </div>
          </div>

          {/* ID */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              ID
            </span>
            <Input
              value={idQuery}
              onChange={(event) => setIdQuery(event.target.value)}
              placeholder="Search ID"
              className="mt-1 h-10 w-full rounded-lg text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100"
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Recent transactions"
        desc="Transactions aligned to the selected tab."
        headerRight={
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Download report
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Party</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const noteCount = notes[txn.id]?.length ?? 0;
                  const assignment = assignments[txn.id];
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {txn.id}
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {txn.type}
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {txn.party}
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {txn.amount}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            txn.status
                          )}`}
                        >
                          {txn.status}
                        </span>
                        {noteCount > 0 ? (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {noteCount} note{noteCount > 1 ? "s" : ""}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-3">
                        {assignment ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
                              {getInitials(assignment.assignee)}
                            </span>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              <p className="font-semibold text-gray-800 dark:text-gray-200">
                                {assignment.assignee}
                              </p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Assigned by {assignment.assignedBy}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {formatDate(txn.createdAt)}
                      </td>
                      <td className="">
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleWork(txn.id)}
                          >
                            Work
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                              setAssignModalOpen(true);
                              setAssignTargetId(txn.id);
                            }}
                          >
                            Assign
                          </Button>
                          <div className="relative inline-flex">
                            <button
                              type="button"
                              onClick={(event) => {
                                if (openMenuId === txn.id) {
                                  setOpenMenuId(null);
                                  setMenuPosition(null);
                                  return;
                                }
                                const rect = (
                                  event.currentTarget as HTMLButtonElement
                                ).getBoundingClientRect();
                                const menuWidth = 224;
                                const left = Math.max(
                                  12,
                                  Math.min(
                                    rect.right - menuWidth,
                                    window.innerWidth - menuWidth - 12
                                  )
                                );
                                setMenuPosition({ top: rect.top - 8, left });
                                setOpenMenuId(txn.id);
                              }}
                              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {openMenuId === txn.id && menuPosition
                              ? createPortal(
                                <div
                                  ref={menuRef}
                                  style={{ top: menuPosition.top, left: menuPosition.left }}
                                  className="fixed z-50 w-56 -translate-y-full rounded-xl border border-gray-200 bg-white p-2 text-sm shadow-xl dark:border-gray-700 dark:bg-gray-900"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleTransactionStatus(txn.id, "completed");
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                  >
                                    Approve release
                                    <CheckCircle className="h-4 w-4 text-success-500" />
                                  </button>
                                  {activeTab === "marketplace" ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          router.push(`/DisputeChat?case=${txn.id}`);
                                          setOpenMenuId(null);
                                          setMenuPosition(null);
                                        }}
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                      >
                                        Open dispute center
                                        <AlertTriangle className="h-4 w-4 text-warning-500" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setModalState({ type: "return", id: txn.id });
                                          setOpenMenuId(null);
                                          setMenuPosition(null);
                                        }}
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                      >
                                        Return to sender
                                        <RefreshCcw className="h-4 w-4 text-gray-500" />
                                      </button>
                                    </>
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleTransactionStatus(txn.id, "hold");
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                  >
                                    Put on hold
                                    <CircleDot className="h-4 w-4 text-warning-500" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleTransactionStatus(txn.id, "dispute");
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                  >
                                    Mark dispute
                                    <AlertTriangle className="h-4 w-4 text-error-500" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalState({ type: "note", id: txn.id });
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                  >
                                    Add note
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalState({ type: "notes", id: txn.id });
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                                  >
                                    View notes ({noteCount})
                                  </button>
                                </div>,
                                document.body
                              )
                              : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Refund & release"
        desc="Review refunds, releases, and reversals for the selected tab."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No refunds match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                      {item.id}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {item.type}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {item.user}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {item.amount}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRefundStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModalState({ type: "release", id: item.id })}
                        >
                          Release funds
                        </Button>
                        {activeTab === "marketplace" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/DisputeResolution?case=${item.id}`)
                            }
                          >
                            Escalate
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {
        activeTab === "withdrawals" ? (
          <ComponentCard
            title="Withdrawal reviews"
            desc="Oldest requests stay on top. Review each withdrawal request."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Requested</th>
                    <th className="px-6 py-3 font-medium">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400"
                      >
                        No withdrawal requests match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                          {item.id}
                        </td>
                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                          {item.user}
                        </td>
                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                          {item.method}
                        </td>
                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                          {item.amount}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getWithdrawalStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWithdrawalReview(item.id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setModalState({ type: "deny", id: item.id });
                                setModalInput(item.reviewNote || "");
                              }}
                            >
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setModalState({ type: "info", id: item.id });
                                setModalInput("");
                              }}
                            >
                              Request info
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        ) : null
      }

      <ComponentCard
        title="Operations"
        desc="Quick tools for finance operations and audit trails."
      >
        <div className="flex flex-wrap items-center gap-3 p-2 md:p-4">
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4" />
            Sync balances
          </Button>
          <Button variant="outline" size="sm">
            <ShieldCheck className="h-4 w-4" />
            Open audit log
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Download finance report
          </Button>
        </div>
      </ComponentCard>

      <Modal
        isOpen={modalState?.type === "return"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Return funds to sender
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Confirm how much to return to the buyer. The transaction will be marked
            as returned.
          </p>
          <Input
            value={modalAmount}
            onChange={(event) => setModalAmount(event.target.value)}
            placeholder="Return amount"
            className="h-10"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalState(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (modalState?.id) {
                  handleTransactionStatus(modalState.id, "returned");
                }
                setModalState(null);
              }}
            >
              Confirm return
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState?.type === "deny"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Deny withdrawal request
          </h3>
          <TextArea
            rows={4}
            value={modalInput}
            onChange={setModalInput}
            placeholder="Provide the reason for denial"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalState(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (modalState?.id) {
                  handleWithdrawalReview(modalState.id, "denied", modalInput);
                }
                setModalState(null);
                setModalInput("");
              }}
            >
              Deny request
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState?.type === "info"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Request more information
          </h3>
          <TextArea
            rows={4}
            value={modalInput}
            onChange={setModalInput}
            placeholder="List the documents or details needed"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalState(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (modalState?.id) {
                  handleWithdrawalReview(modalState.id, "needs_info", modalInput);
                }
                setModalState(null);
                setModalInput("");
              }}
            >
              Send request
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState?.type === "note"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add finance note
          </h3>
          <TextArea
            rows={4}
            value={modalInput}
            onChange={setModalInput}
            placeholder="Write a note for other finance staff"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalState(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (modalState?.id) {
                  handleAddNote(modalState.id, modalInput);
                }
                setModalState(null);
                setModalInput("");
              }}
            >
              Save note
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState?.type === "notes"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Finance notes
          </h3>
          {currentNotes.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No notes added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {currentNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{note.author}</span>
                    <span>{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="mt-2">{note.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-end">
            <Button size="sm" onClick={() => setModalState(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalState?.type === "release"}
        onClose={() => setModalState(null)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Release funds
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Confirm release for this refund or transaction.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalState(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const refund = refunds.find((item) => item.id === modalState?.id);
                if (refund) {
                  handleRefundStatus(refund.id, "released");
                } else if (modalState?.id) {
                  handleTransactionStatus(modalState.id, "completed");
                }
                setModalState(null);
              }}
            >
              Confirm release
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assign transaction
          </h3>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${selectedDepartment === dept
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="mb-3">
            <input
              value={staffQuery}
              onChange={(event) => setStaffQuery(event.target.value)}
              placeholder="Search staff"
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="space-y-3">
            {filteredStaff.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No staff found in this department.
              </p>
            ) : (
              filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {getInitials(staff.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {staff.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {staff.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${staff.online
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                      {staff.online ? "Online" : "Offline"}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => {
                        if (!assignTargetId) return;
                        handleAssign(assignTargetId, staff);
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
      {toastMessage && (
        <div className="pointer-events-none fixed inset-0 z-[100000] flex justify-end items-start px-4 pt-6">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-brand-200 bg-white/95 px-4 py-3 text-sm font-medium text-brand-600 shadow-lg shadow-brand-400/30 backdrop-blur dark:border-brand-800 dark:bg-gray-900/90 dark:text-brand-400"
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">{icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
