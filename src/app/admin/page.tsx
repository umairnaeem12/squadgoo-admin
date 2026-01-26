"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { Task, Ticket, WalletCase, KYCCase } from "@/types/admin-system";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentAdmin, isAuthenticated, hasActionPermission } =
    useAdminAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !currentAdmin) {
      router.push("/admin/login");
      return;
    }

    if (currentAdmin.role === "super_admin") {
      router.push("/super-admin");
      return;
    }

    loadMyTasks();
  }, [isAuthenticated, currentAdmin, router]);

  const loadMyTasks = () => {
    if (!currentAdmin) return;

    const allTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const allTickets: Ticket[] = JSON.parse(
      localStorage.getItem("tickets") || "[]"
    );

    const assignedTasks = allTasks.filter(
      (t) => t.assignedTo === currentAdmin.id
    );
    const assignedTickets = allTickets.filter(
      (t) => t.assignedTo === currentAdmin.id
    );

    setMyTasks(assignedTasks);
    setMyTickets(assignedTickets);

    setStats({
      totalAssigned: assignedTasks.length + assignedTickets.length,
      inProgress: assignedTasks.filter((t) => t.status === "in_progress")
        .length,
      completed: assignedTasks.filter((t) => t.status === "resolved").length,
    });
  };

  if (!currentAdmin || currentAdmin.role === "super_admin") {
    return null;
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {currentAdmin.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's on your plate today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            title="Total Assigned"
            value={stats.totalAssigned}
            icon="📋"
            color="blue"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="⏳"
            color="orange"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon="✅"
            color="green"
          />
        </div>

        {/* My Tasks Widget */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            My Tasks
          </h2>
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {task.type.replace("_", " ")}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {task.summary}
                    </p>
                  </div>
                  {hasActionPermission("can_resolve_ticket") && (
                    <button className="ml-4 rounded-lg bg-brand-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-brand-600">
                      Work On It
                    </button>
                  )}
                </div>
              </div>
            ))}

            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        ticket
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          ticket.priority === "high" || ticket.priority === "urgent"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {ticket.description}
                    </p>
                  </div>
                  {hasActionPermission("can_resolve_ticket") && (
                    <button className="ml-4 rounded-lg bg-brand-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-brand-600">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}

            {myTasks.length === 0 && myTickets.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks assigned to you yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity (Optional) */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="View All Tickets"
              description="See all tickets in your queue"
              icon="🎫"
              href="/admin/tickets"
            />
            <QuickActionCard
              title="Profile Viewer"
              description="Search and view user profiles"
              icon="👁️"
              href="/admin/profile-viewer"
            />
            <QuickActionCard
              title="Internal Chat"
              description="Chat with your team"
              icon="💭"
              href="/admin/internal-chat"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  }[color];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses}`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-400"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </a>
  );
}
