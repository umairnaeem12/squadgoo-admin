"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Calendar,
  Search,
  Star,
  MapPin,
} from "lucide-react";

export default function JobseekerDirectory() {
  const [selectedJobseeker, setSelectedJobseeker] = useState<any | null>(null);

  const jobseekers = [
    {
      id: 1,
      name: "Ayesha Khan",
      email: "ayesha.khan@email.com",
      jobTitle: "Frontend Developer",
      experience: "3 years",
      location: "Karachi, Pakistan",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      resume: "https://drive.google.com/file/d/xyz",
      joinedAt: "15 Feb, 2025",
      status: "Active",
      bio: "A passionate frontend engineer specializing in React and modern web technologies. Experienced in building scalable and responsive interfaces for enterprise clients.",
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael.brown@email.com",
      jobTitle: "Backend Developer",
      experience: "5 years",
      location: "Toronto, Canada",
      skills: ["Node.js", "Express", "PostgreSQL", "TypeORM"],
      resume: "https://drive.google.com/file/d/abc",
      joinedAt: "01 Mar, 2025",
      status: "Pending",
      bio: "Backend developer with strong experience in REST API development, database design, and cloud deployment. Focused on scalable and maintainable systems.",
    },
    {
      id: 3,
      name: "Fatima Noor",
      email: "fatima.noor@email.com",
      jobTitle: "UI/UX Designer",
      experience: "2 years",
      location: "Lahore, Pakistan",
      skills: ["Figma", "Adobe XD", "Design Systems", "Wireframing"],
      resume: "https://drive.google.com/file/d/123",
      joinedAt: "23 Apr, 2025",
      status: "Active",
      bio: "Creative UI/UX designer who loves translating ideas into meaningful digital experiences. Skilled in user research and creating pixel-perfect designs.",
    },
  ];

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Header */}
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Jobseeker Directory
      </p>

      {/* Table */}
      <ComponentCard
        title="All Jobseekers"
        desc="List of all registered jobseekers on the SquadGoo platform"
        headerRight={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search jobseeker..."
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
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Job Title</th>
                <th className="px-6 py-3 font-medium">Experience</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Skills</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {jobseekers.map((js) => (
                <tr
                  key={js.id}
                  onClick={() => setSelectedJobseeker(js)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {js.name}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {js.email}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {js.jobTitle}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {js.experience}
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {js.location}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {js.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {js.skills.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-xs text-gray-500 dark:text-gray-400">
                          +{js.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        js.status === "Active"
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}
                    >
                      {js.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* === Jobseeker Details Modal === */}
      {selectedJobseeker && (
        <div
          className="fixed inset-x-0 bottom-0 top-[64px] z-[9999] flex items-center justify-center bg-white/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedJobseeker(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-theme-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl">
                  <User className="text-brand-600 dark:text-brand-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedJobseeker.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedJobseeker.jobTitle} • {selectedJobseeker.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {selectedJobseeker.email}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {selectedJobseeker.experience}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Joined {selectedJobseeker.joinedAt}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {selectedJobseeker.location}
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {selectedJobseeker.bio}
            </p>

            {/* Skills */}
            <div className="mt-3">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Key Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedJobseeker.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Link */}
            <div className="mt-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <a
                href={selectedJobseeker.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                View Resume
              </a>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedJobseeker(null)}
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
