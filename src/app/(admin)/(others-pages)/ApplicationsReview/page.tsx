"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  User,
  Briefcase,
  Mail,
  FileText,
  FolderGit2,
  Calendar,
  Search,
  Star,
  MapPin,
  GraduationCap,
  DollarSign,
  MessageSquare,
} from "lucide-react";

export default function ApplicationsReview() {
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");

  const applications = [
    {
      id: 1,
      applicant: "Ayesha Khan",
      email: "ayesha.khan@email.com",
      appliedFor: "Frontend Developer",
      recruiter: "TalentMatch HR",
      date: "20 Feb, 2025",
      status: "Pending",
      resume: "https://drive.google.com/file/d/frontend",
      portfolio: "https://ayeshakhan.design",
      experience: "3 years",
      education: "BS Computer Science — NED University (2023)",
      location: "Karachi, Pakistan",
      phone: "+92 300 1234567",
      expectedSalary: "$70k - $90k",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      coverLetter:
        "I'm passionate about crafting modern, performant user interfaces that drive real impact. My focus is on clean design systems, scalability, and UX consistency.",
      feedback: "",
    },
    {
      id: 2,
      applicant: "Michael Brown",
      email: "michael.brown@email.com",
      appliedFor: "Backend Developer",
      recruiter: "TechBridge Recruiters",
      date: "12 Mar, 2025",
      status: "Reviewed",
      resume: "https://drive.google.com/file/d/backend",
      portfolio: "https://michaelb.dev",
      experience: "5 years",
      education: "BS Software Engineering — University of Toronto (2018)",
      location: "Toronto, Canada",
      phone: "+1 647 555 1122",
      expectedSalary: "$85k - $110k",
      skills: ["Node.js", "TypeORM", "PostgreSQL", "AWS"],
      coverLetter:
        "Backend engineer with 5 years of experience building REST APIs and optimizing relational databases. Skilled in distributed systems and TypeORM.",
      feedback: "Technically solid candidate, might fit senior role better.",
    },
    {
      id: 3,
      applicant: "Fatima Noor",
      email: "fatima.noor@email.com",
      appliedFor: "UI/UX Designer",
      recruiter: "CreativeX Studio",
      date: "01 Apr, 2025",
      status: "Shortlisted",
      resume: "https://drive.google.com/file/d/uiux",
      portfolio: "https://dribbble.com/fatima-noor",
      experience: "2 years",
      education: "BA Design & Media — Punjab University (2022)",
      location: "Lahore, Pakistan",
      phone: "+92 301 6547890",
      expectedSalary: "$50k - $65k",
      skills: ["Figma", "Adobe XD", "Wireframing", "Design Systems"],
      coverLetter:
        "Creative designer who believes good design is functional, emotional, and intuitive. I thrive on user feedback loops and fast-paced iteration.",
      feedback: "Portfolio aligns with our visual standards.",
    },
  ];

  const filtered =
    filter === "all"
      ? applications
      : applications.filter(
          (a) => a.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Header */}
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Applications / Resume / Portfolio Review
      </p>

      {/* High-level review metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Quick vs Manual jobs"
          value="64% Quick · 36% Manual"
          helper="Last 30 days across all applications"
        />
        <SummaryCard
          label="Average rating"
          value="4.3 / 5.0"
          helper="Based on completed jobs linked to these applicants"
        />
        <SummaryCard
          label="Flagged / low acceptance profiles"
          value="12 profiles"
          helper="Require admin review from Reports & Reviews"
        />
      </div>

      {/* Table */}
      <ComponentCard
        title="All Applications"
        desc="Monitor and review all job applications submitted by jobseekers"
        headerRight={
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              {["all", "pending", "reviewed", "shortlisted"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    filter === f
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                placeholder="Search applicant..."
                className="border border-gray-300 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="p-2 border rounded-lg border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-white/5 transition">
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
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Applied For</th>
                <th className="px-6 py-3 font-medium">Recruiter</th>
                <th className="px-6 py-3 font-medium">Experience</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => {
                    setSelected(a);
                    setActiveTab("overview");
                  }}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {a.applicant}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {a.email}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {a.appliedFor}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {a.recruiter}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {a.experience}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {a.date}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        a.status === "Shortlisted"
                          ? "bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400"
                          : a.status === "Reviewed"
                          ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
                          : "bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {a.status}
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
                  <User className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selected.applicant}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selected.appliedFor} • {selected.recruiter}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm font-medium text-gray-700 dark:text-gray-300">
              {[
                { key: "overview", label: "Overview" },
                { key: "skills", label: "Skills" },
                { key: "cover", label: "Cover Letter" },
                { key: "links", label: "Links" },
                { key: "feedback", label: "Recruiter Notes" },
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
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Email:</strong> {selected.email}</p>
                  <p><strong>Phone:</strong> {selected.phone}</p>
                  <p><strong>Location:</strong> {selected.location}</p>
                  <p><strong>Experience:</strong> {selected.experience}</p>
                  <p><strong>Education:</strong> {selected.education}</p>
                  <p><strong>Expected Salary:</strong> {selected.expectedSalary}</p>
                  <p><strong>Applied On:</strong> {selected.date}</p>
                  <p><strong>Status:</strong> {selected.status}</p>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="flex flex-wrap gap-2">
                  {selected.skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {activeTab === "cover" && (
                <div>
                  <p className="font-medium mb-1 text-gray-900 dark:text-white">Cover Letter:</p>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              {activeTab === "links" && (
                <div className="space-y-2">
                  <a
                    href={selected.resume}
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" /> View Resume
                  </a>
                  <a
                    href={selected.portfolio}
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FolderGit2 className="w-4 h-4" /> View Portfolio
                  </a>
                </div>
              )}

              {activeTab === "feedback" && (
                <div>
                  <p className="font-medium mb-1 text-gray-900 dark:text-white">
                    Recruiter Feedback / Notes:
                  </p>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    {selected.feedback || "No feedback added yet."}
                  </p>
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

type SummaryCardProps = {
  label: string;
  value: string;
  helper?: string;
};

function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
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
