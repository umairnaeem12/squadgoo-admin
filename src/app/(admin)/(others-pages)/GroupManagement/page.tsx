"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Users,
  Mail,
  Briefcase,
  Calendar,
  Search,
  BadgeCheck,
  User,
  UserPlus,
  Activity,
  Globe,
} from "lucide-react";

export default function GroupManagement() {
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
      lastActive: "10 Nov, 2025",
      category: "Frontend Development",
      description:
        "Focused on building clean, scalable user interfaces and collaborating on frontend-focused projects across SquadGoo.",
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
      history: [
        { event: "Group created", date: "20 Feb, 2025" },
        { event: "Applied to Frontend Developer role", date: "22 Feb, 2025" },
        { event: "Shortlisted by TalentMatch HR", date: "25 Feb, 2025" },
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
      lastActive: "05 Nov, 2025",
      category: "Fullstack Development",
      description:
        "Cross-functional team working on end-to-end product development using modern stacks and cloud integration.",
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
      history: [
        { event: "Group created", date: "15 Mar, 2025" },
        { event: "Applied to Fullstack Developer role", date: "18 Mar, 2025" },
      ],
    },
  ];

  return (
    <div className="p-2 md:p-4 space-y-4">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Group Management
      </p>

      <ComponentCard
        title="All Jobseeker Groups"
        desc="Manage and review groups formed by jobseekers for team-based job applications"
        headerRight={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search group..."
              className="border border-gray-300 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="p-2 border rounded-lg border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition">
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
                  onClick={() => {
                    setSelected(g);
                    setActiveTab("overview");
                  }}
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
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        g.status === "Active"
                          ? "bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400"
                          : "bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
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

      {/* === Modal === */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl">
                  <Users className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Led by {selected.leader} • {selected.membersCount} members
                  </p>
                </div>
              </div>
              {selected.status === "Active" && (
                <BadgeCheck className="text-green-500 w-6 h-6" />
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm font-medium text-gray-700 dark:text-gray-300">
              {[
                { key: "overview", label: "Overview" },
                { key: "members", label: "Members" },
                { key: "applied", label: "Applied Jobs" },
                { key: "performance", label: "Performance" },
                { key: "history", label: "History" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 transition ${
                    activeTab === tab.key
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "hover:text-blue-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 text-sm text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto">
              {activeTab === "overview" && (
                <div className="space-y-2">
                  <p>
                    <strong>Group Category:</strong> {selected.category}
                  </p>
                  <p>
                    <strong>Leader Email:</strong> {selected.leaderEmail}
                  </p>
                  <p>
                    <strong>Created On:</strong> {selected.createdAt}
                  </p>
                  <p>
                    <strong>Last Active:</strong> {selected.lastActive}
                  </p>
                  <p>
                    <strong>Description:</strong> {selected.description}
                  </p>
                </div>
              )}

              {activeTab === "members" && (
                <div className="space-y-3">
                  {selected.members.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {m.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {m.role} • {m.expertise}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        {m.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "applied" && (
                <div className="space-y-2">
                  {selected.appliedTo.map((a: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
                    >
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>
                        {a.jobTitle} —{" "}
                        <span className="text-gray-500">{a.recruiter}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-3">
                  <p>
                    <strong>Applications Submitted:</strong>{" "}
                    {selected.appliedJobs}
                  </p>
                  <p>
                    <strong>Members Active:</strong> {selected.membersCount}
                  </p>
                  <p>
                    <strong>Status:</strong> {selected.status}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Overall engagement: High</span>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-2">
                  {selected.history.map((h: any, i: number) => (
                    <p key={i}>
                      <strong>{h.event}</strong> —{" "}
                      <span className="text-gray-500">{h.date}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 dark:border-gray-800 p-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
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
