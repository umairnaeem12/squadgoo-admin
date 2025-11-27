"use client";

import { useState, useRef, useEffect } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    Clock,
    Filter,
    Gavel,
    Inbox,
    MessageCircle,
    Scale,
} from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

type TicketStatus = "all" | "solved" | "pending";

type Dispute = {
    id: string;
    type: "Job" | "Marketplace";
    raisedBy: string;
    against: string;
    reason: string;
    status: "Open" | "In Review" | "Resolved";
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
        reason: "Item not as described – motorbike mechanical issues",
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

export default function SupportTicketsPage() {
    const [filter, setFilter] = useState<TicketStatus>("all");
    const [showFilterBox, setShowFilterBox] = useState(false);
    const filterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setShowFilterBox(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const tickets = [
        {
            id: "#323534",
            name: "Lindsey Curtis",
            email: "demoemail@gmail.com",
            subject: "Issue with Dashboard Login Access",
            date: "12 Feb, 2027",
            status: "solved",
        },
        {
            id: "#323535",
            name: "Kaiya George",
            email: "demoemail@gmail.com",
            subject: "Billing Information Not Updating Properly",
            date: "13 Mar, 2027",
            status: "pending",
        },
        {
            id: "#323536",
            name: "Zain Geidt",
            email: "demoemail@gmail.com",
            subject: "Bug Found in Dark Mode Layout",
            date: "19 Mar, 2027",
            status: "pending",
        },
        {
            id: "#323537",
            name: "Abram Schleifer",
            email: "demoemail@gmail.com",
            subject: "Request to Add New Integration Feature",
            date: "25 Apr, 2027",
            status: "solved",
        },
        {
            id: "#323538",
            name: "Mia Chen",
            email: "mia.chen@email.com",
            subject: "Unable to Reset Password",
            date: "28 Apr, 2027",
            status: "pending",
        },
    ];

    const filteredTickets =
        filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

    return (
        <div className="p-2 md:p-4 space-y-4">
            {/* Page Title */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Support Tickets
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    icon={<Inbox className="w-8 h-8 text-brand-500" />}
                    label="Total tickets"
                    value="5,347"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8 text-warning-500" />}
                    label="Pending tickets"
                    value="1,230"
                />
                <StatCard
                    icon={<BadgeCheck className="w-8 h-8 text-success-500" />}
                    label="Solved tickets"
                    value="4,117"
                />
                <StatCard
                    icon={<Scale className="w-8 h-8 text-error-500" />}
                    label="Open disputes (jobs & marketplace)"
                    value="23"
                />
            </div>

            {/* Main Table – Customer Service */}
            <ComponentCard
                title="Support Tickets"
                desc="Your most recent support tickets list"
                className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800"
                headerRight={
                    <div className="flex flex-wrap items-center justify-end gap-2 relative">
                        {/* Filter Buttons */}
                        <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                            {[
                                { key: "all", label: "All", icon: "" },
                                { key: "solved", label: "Solved", icon: "" },
                                { key: "pending", label: "Pending", icon: "" }
                            ].map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as TicketStatus)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${filter === key
                                            ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <span className="text-sm">{icon}</span>
                                    {label}
                                        </button>
                                    ))}
                        </div>

                        {/* Search & Filter */}
                        <div className="flex items-center gap-2" ref={filterRef}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            />
                            <button
                                onClick={() => setShowFilterBox((prev) => !prev)}
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium 
                  border-gray-200 dark:border-gray-800 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-white/5 
                  transition relative"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>

                            {/* Floating Filter Box */}
                            {showFilterBox && (
                                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-10">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Search category..."
                                                className="w-full border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Search company..."
                                                className="w-full border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => setShowFilterBox(false)}
                                            className="w-full mt-2 bg-brand-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-brand-700 transition"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            >
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 font-medium">Ticket ID</th>
                                <th className="px-6 py-3 font-medium">Requested By</th>
                                <th className="px-6 py-3 font-medium">Subject</th>
                                <th className="px-6 py-3 font-medium">Create Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredTickets.map((t, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                                >
                                    <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                                        {t.id}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {t.name}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                {t.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {t.subject}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {t.date}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${t.status === "solved"
                                                ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                                                : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                                                }`}
                                        >
                                            {t.status[0].toUpperCase() + t.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>

            {/* Dispute Resolution Centre – Admin view */}
            <ComponentCard
                title="Dispute Resolution Centre"
                desc="Track job and marketplace disputes, SG Coin holds and mediator activity"
                className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 font-medium">Case</th>
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
                            {DISPUTES.map((d) => (
                                <tr
                                    key={d.id}
                                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
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
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                                d.status === "Open"
                                                    ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                                                    : d.status === "In Review"
                                                    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300"
                                                    : "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                                            }`}
                                        >
                                            {d.status === "Open" && (
                                                <AlertTriangle className="w-3 h-3" />
                                            )}
                                            {d.status === "In Review" && (
                                                <Scale className="w-3 h-3" />
                                            )}
                                            {d.status === "Resolved" && (
                                                <BadgeCheck className="w-3 h-3" />
                                            )}
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                                        {d.createdAt}
                                    </td>
                                    <td className="px-6 py-3">
                                        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                                            <MessageCircle className="w-3 h-3" />
                                            Open case chat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>
        </div>
    );
}

/* === Stat Card === */
const StatCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="bg-white dark:bg-gray-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-theme-sm transition">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </h2>
            </div>
        </div>
    </div>
);
