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
  Clock,
  GraduationCap,
  Globe,
  UserCheck,
  Layers,
  Languages,
} from "lucide-react";

export default function JobPostManagement() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TalentMatch HR",
      recruiter: "John Doe",
      industry: "Technology",
      workLocation: "San Francisco, USA",
      rangeKm: "15",
      totalExperience: "3 Years",
      salaryRange: "$70k - $90k / year",
      jobType: "Full-Time",
      staffRequired: 2,
      availability: "Immediate",
      language: "English",
      applicants: 42,
      postedOn: "05 Feb, 2025",
      status: "Active",
      qualifications: ["Bachelor’s in Computer Science", "High School Diploma"],
      extraQualifications: ["Tailwind, TypeScript, Next.js"],
      startDate: "10 Feb, 2025",
      startTime: "09:00 AM",
      endDate: "10 Aug, 2025",
      endTime: "05:00 PM",
      offerExpiry: "120 mins",
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
      industry: "Finance",
      workLocation: "London, UK",
      rangeKm: "10",
      totalExperience: "5 Years",
      salaryRange: "$85k - $110k / year",
      jobType: "Remote",
      staffRequired: 1,
      availability: "Next Week",
      language: "English",
      applicants: 18,
      postedOn: "18 Mar, 2025",
      status: "Pending",
      qualifications: ["Master’s in Business Management"],
      extraQualifications: ["Agile Certification", "Scrum Master"],
      startDate: "01 Apr, 2025",
      startTime: "10:00 AM",
      endDate: "30 Dec, 2025",
      endTime: "06:00 PM",
      offerExpiry: "240 mins",
      description:
        "Looking for an experienced Product Manager to drive cross-functional product initiatives in our FinTech division. You will be leading agile product teams and overseeing product life cycles from conception to delivery.",
      requirements: [
        "5+ years of experience in product management",
        "Excellent leadership and strategic planning skills",
        "Experience with agile methodologies",
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
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
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
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
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
                    {job.workLocation}
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
            className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl shadow-theme-lg p-6 overflow-y-auto max-h-[85vh]"
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
                    {selectedJob.company} • {selectedJob.workLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* === Job Overview === */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Job Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Industry:</strong> {selectedJob.industry}</p>
                <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                <p><strong>Staff Required:</strong> {selectedJob.staffRequired}</p>
                <p><strong>Availability:</strong> {selectedJob.availability}</p>
                <p><strong>Experience:</strong> {selectedJob.totalExperience}</p>
                <p><strong>Language:</strong> {selectedJob.language}</p>
              </div>
            </div>

            {/* === Schedule & Payment === */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Schedule & Payment
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Start Date:</strong> {selectedJob.startDate}</p>
                <p><strong>Start Time:</strong> {selectedJob.startTime}</p>
                <p><strong>End Date:</strong> {selectedJob.endDate}</p>
                <p><strong>End Time:</strong> {selectedJob.endTime}</p>
                <p><strong>Offer Expiry:</strong> {selectedJob.offerExpiry}</p>
                <p><strong>Salary Range:</strong> {selectedJob.salaryRange}</p>
              </div>
            </div>

            {/* === Qualifications === */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Qualifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-medium mb-1">Educational:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.qualifications.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Extra:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.extraQualifications.map(
                      (q: string, i: number) => <li key={i}>{q}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* === Description & Requirements === */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Job Description & Requirements
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {selectedJob.description}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {selectedJob.requirements.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
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
