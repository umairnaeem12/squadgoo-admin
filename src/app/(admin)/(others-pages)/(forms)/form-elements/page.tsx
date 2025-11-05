"use client";

import { useState } from "react";
import { User, Briefcase, Users, Search } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

export default function ManageUsersPage() {
  const [filter, setFilter] = useState<"all" | "recruiter" | "jobseeker" | "individual">("all");

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
    <div className="p-2 md:p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Users
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage all registered Recruiters, Job Seekers, and Individuals.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OverviewCard
          icon={<Briefcase className="text-blue-500 w-6 h-6" />}
          label="Total Recruiters"
          value="124"
        />
        <OverviewCard
          icon={<Users className="text-green-500 w-6 h-6" />}
          label="Total Job Seekers"
          value="342"
        />
        <OverviewCard
          icon={<User className="text-yellow-500 w-6 h-6" />}
          label="Individuals"
          value="89"
        />
      </div>

      {/* Users Table */}
      <ComponentCard
        title="All Users"
        desc="Complete list of all SquadGoo platform users"
        headerRight={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg border border-gray-200 dark:border-darkblack-500 overflow-hidden">
              {["all", "recruiter", "jobseeker", "individual"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    filter === f
                      ? "bg-gray-100 dark:bg-darkblack-500 text-blue-600"
                      : "text-gray-700 dark:text-gray-300"
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
                className="border border-gray-200 dark:border-darkblack-500 rounded-lg px-3 py-2 text-sm bg-white dark:bg-darkblack-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="p-2 border rounded-lg border-gray-200 dark:border-darkblack-500 hover:bg-gray-100 dark:hover:bg-darkblack-500 transition">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-darkblack-500 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-100 dark:border-darkblack-500 hover:bg-gray-50 dark:hover:bg-darkblack-500"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 capitalize">{u.role}</td>
                  <td className="px-6 py-3">{u.company}</td>
                  <td className="px-6 py-3">{u.joinedAt}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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

/* === Subcomponent for overview cards === */
const OverviewCard = ({
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
