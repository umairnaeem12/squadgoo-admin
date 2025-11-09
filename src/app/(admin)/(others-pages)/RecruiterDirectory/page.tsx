"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Search, Building2, Mail, Phone, Briefcase, BadgeCheck, Calendar } from "lucide-react";

export default function RecruiterDirectory() {
    const [selectedRecruiter, setSelectedRecruiter] = useState<any | null>(null);

    const recruiters = [
        {
            id: 1,
            name: "TalentMatch HR",
            owner: "John Doe",
            email: "john@talentmatch.com",
            phone: "+1 234 567 890",
            industry: "Technology",
            location: "San Francisco, USA",
            jobsPosted: 12,
            verified: true,
            joinedAt: "12 Jan, 2024",
            companySize: "51–200",
            description:
                "TalentMatch HR connects top technology professionals with leading startups and enterprises globally. They specialize in engineering and product management recruitment.",
        },
        {
            id: 2,
            name: "TechBridge Recruiters",
            owner: "Sarah Malik",
            email: "sarah@techbridge.com",
            phone: "+44 789 456 123",
            industry: "Finance",
            location: "London, UK",
            jobsPosted: 8,
            verified: false,
            joinedAt: "28 Feb, 2024",
            companySize: "11–50",
            description:
                "TechBridge Recruiters focuses on financial technology roles, connecting experienced analysts and developers to global fintech organizations.",
        },
    ];

    return (
        <div className="p-2 md:p-4 space-y-4">
            {/* Header */}
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Recruiter Directory
            </p>

            {/* Table */}
            <ComponentCard
                title="All Recruiters"
                desc="List of all registered recruiter companies"
                headerRight={
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search recruiter..."
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
                                <th className="px-6 py-3 font-medium">Company</th>
                                <th className="px-6 py-3 font-medium">Owner</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Phone</th>
                                <th className="px-6 py-3 font-medium">Industry</th>
                                <th className="px-6 py-3 font-medium">Jobs Posted</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recruiters.map((r) => (
                                <tr
                                    key={r.id}
                                    onClick={() => setSelectedRecruiter(r)}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                                >
                                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                                        {r.name}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.owner}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.email}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.phone}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.industry}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.jobsPosted}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${r.verified
                                                ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                                                : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                                                }`}
                                        >
                                            {r.verified ? "Verified" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                        {r.joinedAt}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>

            {/* === Recruiter Details Modal === */}
            {selectedRecruiter && (
                <div
                    className="fixed inset-x-0 bottom-0 top-[64px] z-[9999] flex items-center justify-center 
    bg-white/30 dark:bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedRecruiter(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-theme-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl">
                                    <Building2 className="text-brand-600 dark:text-brand-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedRecruiter.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedRecruiter.industry} • {selectedRecruiter.location}
                                    </p>
                                </div>
                            </div>
                            {selectedRecruiter.verified && (
                                <BadgeCheck className="text-success-500 w-6 h-6" />
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {selectedRecruiter.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" /> {selectedRecruiter.phone}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {selectedRecruiter.jobsPosted} Jobs Posted
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Joined {selectedRecruiter.joinedAt}
                            </div>
                            <div className="col-span-2">
                                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {selectedRecruiter.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedRecruiter(null)}
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
