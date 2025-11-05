"use client";

import { useState, useRef, useEffect } from "react";
import { BadgeCheck, Clock, Inbox, Filter } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

export default function SupportTicketsPage() {
    const [filter, setFilter] = useState<"all" | "solved" | "pending">("all");
    const [showFilterBox, setShowFilterBox] = useState(false);
    const filterRef = useRef<HTMLDivElement | null>(null);

    // Close the filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setShowFilterBox(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mock data
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
            {/* ==== PAGE TITLE ==== */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Support Tickets
            </p>

            {/* ==== STATS CARDS ==== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    icon={<Inbox className="w-8 h-8 text-blue-500" />}
                    label="Total tickets"
                    value="5,347"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8 text-yellow-500" />}
                    label="Pending tickets"
                    value="1,230"
                />
                <StatCard
                    icon={<BadgeCheck className="w-8 h-8 text-green-500" />}
                    label="Solved tickets"
                    value="4,117"
                />
            </div>

            {/* ==== MAIN TABLE CARD ==== */}
            <ComponentCard
                title="Support Tickets"
                desc="Your most recent support tickets list"
                headerRight={
                    <div className="flex flex-wrap items-center justify-end gap-2 relative">
                        {/* Filter Buttons */}
                        <div className="flex rounded-lg border border-gray-200 dark:border-darkblack-500 overflow-hidden">
                            {["all", "solved", "pending"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-4 py-2 text-sm font-medium transition ${filter === f
                                            ? "bg-gray-100 dark:bg-darkblack-500 text-blue-600"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {f[0].toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Search + Filter */}
                        <div className="flex items-center gap-2" ref={filterRef}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-200 dark:border-darkblack-500 rounded-lg px-3 py-2 text-sm bg-white dark:bg-darkblack-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                onClick={() => setShowFilterBox((prev) => !prev)}
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium 
             border-gray-200 dark:border-darkblack-500 
             text-gray-700 dark:text-gray-300 
             hover:bg-gray-100 dark:hover:bg-darkblack-500 
             transition relative"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>

                            {/* === Floating Filter Box === */}
                            {showFilterBox && (
                                <div
                                    className="absolute right-0 top-12 w-64 bg-white dark:bg-darkblack-600 rounded-xl shadow-lg border border-gray-200 dark:border-darkblack-500 p-4 z-10"
                                >
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Search category..."
                                                className="w-full border border-gray-200 dark:border-darkblack-500 rounded-lg px-3 py-2 text-sm bg-white dark:bg-darkblack-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Search company..."
                                                className="w-full border border-gray-200 dark:border-darkblack-500 rounded-lg px-3 py-2 text-sm bg-white dark:bg-darkblack-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => setShowFilterBox(false)}
                                            className="w-full mt-2 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition"
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
                {/* ==== TABLE ==== */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-darkblack-500 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 font-medium">Ticket ID</th>
                                <th className="px-6 py-3 font-medium">Requested By</th>
                                <th className="px-6 py-3 font-medium">Subject</th>
                                <th className="px-6 py-3 font-medium">Create Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((t, i) => (
                                <tr
                                    key={i}
                                    className="border-t border-gray-100 dark:border-darkblack-500 hover:bg-gray-50 dark:hover:bg-darkblack-500"
                                >
                                    <td className="px-6 py-3">{t.id}</td>
                                    <td className="px-6 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {t.name}
                                            </p>
                                            <p className="text-gray-500 text-xs">{t.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{t.subject}</td>
                                    <td className="px-6 py-3">{t.date}</td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${t.status === "solved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
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
        </div>
    );
}

/* === Small Subcomponent for Stat Cards === */
const StatCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="bg-white dark:bg-darkblack-600 rounded-xl p-5 border border-gray-200 dark:border-darkblack-500 shadow-sm">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
        </div>
    </div>
);
