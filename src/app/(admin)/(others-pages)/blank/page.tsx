"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Search, UserCircle, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

type Individual = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  totalGigs: number;
  walletBalance: number;
  createdAt: string;
};

const MOCK_INDIVIDUALS: Individual[] = [
  {
    id: "IND-1001",
    name: "Rakesh Sharma",
    email: "rakesh@example.com",
    phone: "+61 412 345 678",
    location: "Sydney, NSW",
    kycStatus: "Verified",
    totalGigs: 8,
    walletBalance: 240,
    createdAt: "10 Jan, 2025",
  },
  {
    id: "IND-1002",
    name: "Mia Collins",
    email: "mia.collins@example.com",
    phone: "+61 430 111 222",
    location: "Melbourne, VIC",
    kycStatus: "Pending",
    totalGigs: 2,
    walletBalance: 35,
    createdAt: "22 Feb, 2025",
  },
  {
    id: "IND-1003",
    name: "Liam Nguyen",
    email: "liam.nguyen@example.com",
    phone: "+61 405 888 999",
    location: "Brisbane, QLD",
    kycStatus: "Verified",
    totalGigs: 4,
    walletBalance: 120,
    createdAt: "03 Mar, 2025",
  },
];

export default function IndividualsPage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_INDIVIDUALS.filter((ind) => {
    const q = query.toLowerCase();
    return (
      ind.name.toLowerCase().includes(q) ||
      ind.email.toLowerCase().includes(q) ||
      ind.location.toLowerCase().includes(q) ||
      ind.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-2 md:p-4 space-y-4">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Individuals Directory
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Individuals" value="1,248" helper="+34 this week" />
        <StatCard label="KYC Verified" value="1,020" helper="82% of total" />
        <StatCard label="Active Gigs" value="143" helper="Across all individuals" />
      </div>

      <ComponentCard
        title="Individual Accounts"
        desc="Manage individual users who use SquadGoo to find contractors"
        headerRight={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/70"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Individual</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">KYC Status</th>
                <th className="px-6 py-3 font-medium">Total Gigs</th>
                <th className="px-6 py-3 font-medium">Wallet (SG)</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((ind) => (
                <tr
                  key={ind.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                        <UserCircle className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ind.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ind.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{ind.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{ind.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{ind.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        ind.kycStatus === "Verified"
                          ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
                          : ind.kycStatus === "Pending"
                          ? "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400"
                          : "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {ind.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {ind.totalGigs}
                  </td>
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200">
                    {ind.walletBalance.toLocaleString()} SG
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {ind.createdAt}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No individuals found for the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      {helper && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
}
