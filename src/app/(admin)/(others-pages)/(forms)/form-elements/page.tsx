"use client";

import { useState } from "react";
import { User, Briefcase, Users, Search } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

export default function ManageUsersPage() {
  const [filter, setFilter] = useState<
    "all" | "recruiter" | "jobseeker" | "individual"
  >("all");

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@squadgoo.com",
      role: "recruiter",
      company: "TalentMatch HR",
      joinedAt: "2025-08-12",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Khan",
      email: "sarah@mail.com",
      role: "jobseeker",
      company: "-",
      joinedAt: "2025-09-01",
      status: "Pending",
    },
    {
      id: 3,
      name: "Ali Raza",
      email: "ali@freelancehub.com",
      role: "individual",
      company: "-",
      joinedAt: "2025-09-18",
      status: "Active",
    },
  ];

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div className="p-2 md:p-4 space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Users
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage all registered Recruiters, Job Seekers, and
            Individuals.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OverviewCard
          icon={<Briefcase className="text-brand-500 w-6 h-6" />}
          label="Total Recruiters"
          value="124"
        />
        <OverviewCard
          icon={<Users className="text-success-500 w-6 h-6" />}
          label="Total Job Seekers"
          value="342"
        />
        <OverviewCard
          icon={<User className="text-warning-500 w-6 h-6" />}
          label="Individuals"
          value="89"
        />
      </div>

      {/* Users Table */}
      <ComponentCard
        title="All Users"
        desc="Complete list of all SquadGoo platform users"
        className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 shadow-theme-sm"
        headerRight={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {["all", "recruiter", "jobseeker", "individual"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === f
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/[0.12] dark:text-brand-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search user..."
                className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button className="p-2 border rounded-lg border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition">
                <Search className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {u.email}
                  </td>
                  <td className="px-6 py-3 capitalize text-gray-700 dark:text-gray-300">
                    {u.role}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {u.company}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {u.joinedAt}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        u.status === "Active"
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}
                    >
                      {u.status}
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

/* === Overview Card === */
const OverviewCard = ({
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
