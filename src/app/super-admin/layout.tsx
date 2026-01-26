"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentAdmin, isAuthenticated, logout } = useAdminAuth();

  useEffect(() => {
    // Redirect non-authenticated users
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Redirect non-super-admin users to regular dashboard
    if (currentAdmin && currentAdmin.role !== "super_admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, currentAdmin, router]);

  // Only render for super admin
  if (!currentAdmin || currentAdmin.role !== "super_admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Super Admin
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <NavLink href="/super-admin" icon="📊">
              Overview
            </NavLink>
            <NavLink href="/super-admin/admin-management" icon="👥">
              Admin Management
            </NavLink>
            <NavLink href="/super-admin/permissions" icon="🔐">
              Permissions & Departments
            </NavLink>
            <NavLink href="/super-admin/task-assignment" icon="📋">
              Task Assignment
            </NavLink>
            <NavLink href="/super-admin/queues" icon="📦">
              Operational Queues
            </NavLink>
            <NavLink href="/super-admin/audit-logs" icon="📜">
              Audit Logs
            </NavLink>
            <NavLink href="/super-admin/settings" icon="⚙️">
              Settings
            </NavLink>
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
                  {currentAdmin.email}
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

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <span className="text-lg">{icon}</span>
      {children}
    </Link>
  );
}
