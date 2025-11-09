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
} from "lucide-react";

export default function ApplicationsReview() {
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
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
            skills: ["React", "Next.js", "TypeScript"],
            coverLetter:
                "I'm passionate about creating high-quality user experiences with modern web technologies and a focus on performance and accessibility.",
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
            skills: ["Node.js", "TypeORM", "PostgreSQL"],
            coverLetter:
                "Experienced backend developer with strong database and API design expertise. I love optimizing systems for scalability.",
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
            skills: ["Figma", "Adobe XD", "Prototyping"],
            coverLetter:
                "Creative designer focused on clean and user-centric interfaces. Skilled in wireframing and building design systems.",
        },
    ];

    const filteredApplications =
        filter === "all"
            ? applications
            : applications.filter((a) => a.status.toLowerCase() === filter.toLowerCase());

    return (
        <div className="p-2 md:p-4 space-y-4">
            {/* Header */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Applications / Resume / Portfolio Review
            </p>

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
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${filter === f
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
                            {filteredApplications.map((a) => (
                                <tr
                                    key={a.id}
                                    onClick={() => setSelectedApplication(a)}
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
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${a.status === "Shortlisted"
                                                    ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                                                    : a.status === "Reviewed"
                                                        ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
                                                        : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
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

            {/* === Application Detail Modal === */}
            {selectedApplication && (
                <div
                    className="fixed inset-x-0 bottom-0 top-[64px] z-[9999] flex items-center justify-center bg-white/30 dark:bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedApplication(null)}
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
                                        {selectedApplication.applicant}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Applied for {selectedApplication.appliedFor} •{" "}
                                        {selectedApplication.recruiter}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Applicant Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {selectedApplication.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Applied on {selectedApplication.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {selectedApplication.experience}
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" /> {selectedApplication.skills.join(", ")}
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="mt-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                                Cover Letter:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {selectedApplication.coverLetter}
                            </p>
                        </div>

                        {/* Links */}
                        <div className="mt-5 flex flex-col gap-2">
                            <a
                                href={selectedApplication.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                <FileText className="w-4 h-4" /> View Resume
                            </a>
                            <a
                                href={selectedApplication.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                <FolderGit2 className="w-4 h-4" /> View Portfolio
                            </a>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedApplication(null)}
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
