"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { initializeMockData } from "@/data/mockAdminData";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();

    // Redirect if already authenticated
    if (isAuthenticated) {
      const currentAdminData = localStorage.getItem("currentAdmin");
      if (currentAdminData) {
        const admin = JSON.parse(currentAdminData);
        
        // Role-based routing
        if (admin.role === "super_admin") {
          router.push("/super-admin");
        } else {
          router.push("/admin");
        }
      }
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Get the logged-in user to check their role
        const currentAdminData = localStorage.getItem("currentAdmin");
        if (currentAdminData) {
          const admin = JSON.parse(currentAdminData);
          
          // Role-based routing
          if (admin.role === "super_admin") {
            // Super Admin → NEW Super Admin Dashboard
            router.push("/super-admin");
          } else {
            // Admin / Manager / Staff → EXISTING Admin Dashboard
            router.push("/admin");
          }
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to access the operations control center
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-500 font-semibold text-white shadow-lg transition-all hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              Demo Accounts:
            </p>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <p>
                <strong>Super Admin:</strong> super@admin.com / super123
              </p>
              <p>
                <strong>Admin:</strong> john@admin.com / admin123
              </p>
              <p>
                <strong>Manager:</strong> sarah@admin.com / manager123
              </p>
              <p>
                <strong>Staff:</strong> mike@admin.com / staff123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
