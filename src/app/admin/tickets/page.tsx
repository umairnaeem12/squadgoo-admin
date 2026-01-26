"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { Ticket } from "@/types/admin-system";

export default function TicketsPage() {
  const router = useRouter();
  const { isAuthenticated, hasMenuPermission, hasActionPermission, currentAdmin } = useAdminAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!hasMenuPermission("tickets")) {
      // Redirect to appropriate dashboard based on role
      const role = currentAdmin?.role;
      if (role === "super_admin") {
        router.push("/super-admin");
      } else {
        router.push("/admin");
      }
      return;
    }

    loadTickets();
  }, [isAuthenticated, router]);

  const loadTickets = () => {
    const ticketsData = localStorage.getItem("tickets");
    if (ticketsData) {
      setTickets(JSON.parse(ticketsData));
    }
  };

  const assignToMe = (ticketId: string) => {
    if (!hasActionPermission("can_assign_task")) return;

    const updated = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            assignedTo: currentAdmin?.name || "",
            status: "assigned" as const,
            activityLog: [
              ...t.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Assigned",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: `Ticket assigned to ${currentAdmin?.name}`,
              },
            ],
          }
        : t
    );
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  const resolveTicket = (ticketId: string) => {
    const updated = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            status: "resolved" as const,
            activityLog: [
              ...t.activityLog,
              {
                id: `log-${Date.now()}`,
                action: "Resolved",
                performedBy: currentAdmin?.name || "",
                performedAt: new Date().toISOString(),
                details: "Ticket marked as resolved",
              },
            ],
          }
        : t
    );
    setTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!isAuthenticated || !hasMenuPermission("tickets")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tickets & Support
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage user tickets, reports, and support requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 rounded-lg border border-gray-300 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reporter
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assigned To
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 text-sm font-mono text-gray-900 dark:text-white">
                    {ticket.id}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {ticket.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {ticket.reporterName}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.subject}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.priority === "urgent"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : ticket.priority === "high"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {ticket.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {ticket.assignedTo || "Unassigned"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!ticket.assignedTo && hasActionPermission("can_assign_task") && (
                        <button
                          onClick={() => assignToMe(ticket.id)}
                          className="rounded bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
                        >
                          Take
                        </button>
                      )}
                      {ticket.status !== "resolved" && ticket.assignedTo === currentAdmin?.name && (
                        <button
                          onClick={() => resolveTicket(ticket.id)}
                          className="rounded bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
