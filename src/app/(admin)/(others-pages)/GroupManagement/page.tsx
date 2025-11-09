"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
    Users,
    User,
    Briefcase,
    Calendar,
    Search,
    Mail,
    BadgeCheck,
    UserPlus,
} from "lucide-react";

export default function GroupManagement() {
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    const groups = [
        {
            id: 1,
            name: "Frontend Squad",
            leader: "Ayesha Khan",
            leaderEmail: "ayesha.khan@email.com",
            membersCount: 4,
            appliedJobs: 2,
            createdAt: "20 Feb, 2025",
            status: "Active",
            members: [
                {
                    name: "Ayesha Khan",
                    email: "ayesha.khan@email.com",
                    role: "Team Leader",
                    expertise: "React / Next.js / UI Engineering",
                },
                {
                    name: "Ali Raza",
                    email: "ali.raza@email.com",
                    role: "Frontend Developer",
                    expertise: "TypeScript / Tailwind / Redux",
                },
                {
                    name: "Fatima Noor",
                    email: "fatima.noor@email.com",
                    role: "UI Designer",
                    expertise: "Figma / Design Systems",
                },
                {
                    name: "Bilal Ahmed",
                    email: "bilal.ahmed@email.com",
                    role: "QA Engineer",
                    expertise: "Jest / Cypress / Automation",
                },
            ],
            appliedTo: [
                { jobTitle: "Frontend Developer", recruiter: "TalentMatch HR" },
                { jobTitle: "UI Engineer", recruiter: "TechBridge Recruiters" },
            ],
        },
        {
            id: 2,
            name: "Fullstack Force",
            leader: "Michael Brown",
            leaderEmail: "michael.brown@email.com",
            membersCount: 3,
            appliedJobs: 1,
            createdAt: "15 Mar, 2025",
            status: "Pending",
            members: [
                {
                    name: "Michael Brown",
                    email: "michael.brown@email.com",
                    role: "Team Leader",
                    expertise: "Node.js / PostgreSQL / TypeORM",
                },
                {
                    name: "John Doe",
                    email: "john.doe@email.com",
                    role: "Frontend Developer",
                    expertise: "React / Next.js / Zustand",
                },
                {
                    name: "Sara Lee",
                    email: "sara.lee@email.com",
                    role: "UI/UX Designer",
                    expertise: "Figma / Prototyping / Branding",
                },
            ],
            appliedTo: [
                { jobTitle: "Fullstack Developer", recruiter: "CreativeX Studio" },
            ],
        },
    ];

    return (
        <div className="p-2 md:p-4 space-y-4">
            {/* Header */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Group Management
            </p>

            {/* Table */}
            <ComponentCard
                title="All Jobseeker Groups"
                desc="Manage and review groups formed by jobseekers for team-based job applications"
                headerRight={
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search group..."
                            className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                        <button className="p-2 border rounded-lg border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            <Search className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 font-medium">Group Name</th>
                                <th className="px-6 py-3 font-medium">Leader</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Members</th>
                                <th className="px-6 py-3 font-medium">Applied Jobs</th>
                                <th className="px-6 py-3 font-medium">Created On</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {groups.map((g) => (
                                <tr
                                    key={g.id}
                                    onClick={() => setSelectedGroup(g)}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                                >
                                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                                        {g.name}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {g.leader}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {g.leaderEmail}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {g.membersCount}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {g.appliedJobs}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {g.createdAt}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${g.status === "Active"
                                                ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                                                : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                                                }`}
                                        >
                                            {g.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>

            {/* === Group Details Modal === */}
            {/* === Group Details Modal === */}
            {selectedGroup && (
                <div
                    className="fixed inset-x-0 bottom-0 top-[64px] z-[9999] flex items-center justify-center bg-white/20 dark:bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedGroup(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-[#111418] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl shadow-black/40 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl">
                                    <Users className="text-brand-600 dark:text-brand-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedGroup.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Led by {selectedGroup.leader} • {selectedGroup.membersCount} members
                                    </p>
                                </div>
                            </div>
                            {selectedGroup.status === "Active" && (
                                <BadgeCheck className="text-success-500 w-6 h-6" />
                            )}
                        </div>

                        {/* Group Members */}
                        <div className="mb-6">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                                Group Members
                            </p>
                            <div className="space-y-3">
                                {selectedGroup.members.map((m: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 
              bg-gray-50 dark:bg-[#1b1f24] border border-gray-200 dark:border-gray-800"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {m.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {m.role} • {m.expertise}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                                {m.email}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Applied Jobs */}
                        <div className="mb-6">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                                Applied Jobs
                            </p>
                            <div className="space-y-2">
                                {selectedGroup.appliedTo.map((job: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <Briefcase className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <span>
                                            {job.jobTitle} —{" "}
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {job.recruiter}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 
          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2228] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
