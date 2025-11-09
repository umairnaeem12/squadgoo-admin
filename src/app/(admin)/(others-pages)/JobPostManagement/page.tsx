"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Search,
} from "lucide-react";

export default function JobPostManagement() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TalentMatch HR",
      recruiter: "John Doe",
      location: "San Francisco, USA",
      salaryRange: "$70k - $90k",
      applicants: 42,
      postedOn: "05 Feb, 2025",
      status: "Active",
      type: "Full-Time",
      description:
        "We are seeking a skilled Frontend Developer with strong experience in React, Next.js, and Tailwind CSS to join our growing team. You’ll collaborate closely with designers and backend developers to create highly interactive user interfaces.",
      requirements: [
        "3+ years of experience with React.js or Next.js",
        "Strong understanding of TypeScript and Tailwind CSS",
        "Good communication and teamwork skills",
      ],
    },
    {
      id: 2,
      title: "Product Manager",
      company: "TechBridge Recruiters",
      recruiter: "Sarah Malik",
      location: "London, UK",
      salaryRange: "$85k - $110k",
      applicants: 18,
      postedOn: "18 Mar, 2025",
      status: "Pending",
      type: "Remote",
      description:
        "Looking for an experienced Product Manager to drive cross-functional product initiatives in our FinTech division. You will be leading agile product teams and overseeing product life cycles from conception to delivery.",
      requirements: [
        "5+ years of experience in product management",
        "Excellent leadership and strategic planning skills",
        "Experience with agile methodologies",
      ],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "CreativeX Studio",
      recruiter: "Ali Raza",
      location: "Toronto, Canada",
      salaryRange: "$60k - $80k",
      applicants: 29,
      postedOn: "25 Apr, 2025",
      status: "Closed",
      type: "Contract",
      description:
        "CreativeX Studio is seeking a talented UI/UX Designer who can transform user requirements into intuitive and visually appealing designs. Experience with Figma, Adobe XD, and component-based design systems is a must.",
      requirements: [
        "2+ years of professional design experience",
        "Proficiency with Figma and Adobe XD",
        "Portfolio of completed design projects",
      ],
    },
  ];

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Header */}
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Job Post Management
      </p>

      {/* Table */}
      <ComponentCard
        title="All Job Posts"
        desc="Manage and review all job postings across the SquadGoo platform"
        headerRight={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search job..."
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
                <th className="px-6 py-3 font-medium">Job Title</th>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Recruiter</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Applicants</th>
                <th className="px-6 py-3 font-medium">Posted On</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {job.company}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {job.recruiter}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {job.location}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {job.applicants}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {job.postedOn}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        job.status === "Active"
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : job.status === "Closed"
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* === Job Details Modal === */}
      {selectedJob && (
        <div
          className="fixed inset-x-0 bottom-0 top-[64px] z-[9999] flex items-center justify-center bg-white/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-theme-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl">
                  <Briefcase className="text-brand-600 dark:text-brand-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedJob.company} • {selectedJob.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {selectedJob.recruiter}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Posted {selectedJob.postedOn}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> {selectedJob.salaryRange}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> {selectedJob.applicants} Applicants
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                {selectedJob.description}
              </p>

              <div className="mt-3">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Requirements:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {selectedJob.requirements.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedJob(null)}
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
