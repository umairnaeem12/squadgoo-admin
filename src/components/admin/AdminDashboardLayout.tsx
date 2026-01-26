"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentAdmin, isAuthenticated, hasMenuPermission, logout } =
    useAdminAuth();

  useEffect(() => {
    // Redirect non-authenticated users
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Redirect Super Admin to their dashboard
    if (currentAdmin && currentAdmin.role === "super_admin") {
      router.push("/super-admin");
    }
  }, [isAuthenticated, currentAdmin, router]);

  // Block Super Admin access
  if (!currentAdmin || currentAdmin.role === "super_admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Build navigation based on permissions
  const navigation = [
    { name: "Dashboard", path: "/admin", permission: "dashboard" as const, icon: "📊" },
    { name: "Wallet", path: "/admin/wallet", permission: "wallet" as const, icon: "💰" },
    { name: "KYC", path: "/admin/kyc", permission: "kyc" as const, icon: "🆔" },
    { name: "Jobseekers", path: "/admin/jobseekers", permission: "jobseekers" as const, icon: "👤" },
    { name: "Recruiters", path: "/admin/recruiters", permission: "recruiters" as const, icon: "👔" },
    { name: "Tickets", path: "/admin/tickets", permission: "tickets" as const, icon: "🎫" },
    { name: "Reports", path: "/admin/reports", permission: "reports" as const, icon: "📋" },
    { name: "Chat Reports", path: "/admin/chat-reports", permission: "chat_reports" as const, icon: "💬" },
    { name: "Internal Chat", path: "/admin/internal-chat", permission: "internal_chat" as const, icon: "💭" },
    { name: "Profile Viewer", path: "/admin/profile-viewer", permission: "profile_viewer" as const, icon: "👁️" },
  ].filter((item) => hasMenuPermission(item.permission));

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                {currentAdmin.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {currentAdmin.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {currentAdmin.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen w-full">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
