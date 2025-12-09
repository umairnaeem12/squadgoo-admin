"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
    Search,
    Building2,
    Mail,
    Phone,
    Briefcase,
    BadgeCheck,
    Calendar,
    FileText,
    Globe,
    FileCheck2,
    MapPin,
    Users,
    Crown,
    Sparkles,
} from "lucide-react";

export default function RecruiterDirectory() {
    const [selectedRecruiter, setSelectedRecruiter] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState("basic");
    const [searchQuery, setSearchQuery] = useState("");

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
                "TalentMatch HR connects top technology professionals with leading startups and enterprises globally.",
            // === Detailed Tabs Data ===
            basic: {
                firstName: "John",
                lastName: "Doe",
                contact: "+1 234 567 890",
                dob: "1990-05-22",
                address: "123 Silicon Avenue, San Francisco",
                bio: "Experienced HR professional with a decade in recruitment and team management.",
            },
            company: {
                companyName: "TalentMatch HR",
                businessName: "TalentMatch Global",
                acn: "AB123456789",
                businessAddress: "123 Silicon Avenue, San Francisco",
                directorName: "John Doe",
                directorPhone: "+1 234 567 890",
                directorEmail: "john@talentmatch.com",
            },
            tax: {
                tfn: "123-456-789",
                abn: "98 765 432 100",
                residencyStatus: "US Tax Resident",
            },
            social: {
                linkedin: "https://linkedin.com/in/johndoe",
                facebook: "https://facebook.com/johndoe",
                twitter: "https://twitter.com/johndoe",
                instagram: "https://instagram.com/johndoe",
                github: "https://github.com/johndoe",
            },
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
                "TechBridge Recruiters focuses on financial technology roles, connecting analysts and developers to global fintech firms.",
            basic: {
                firstName: "Sarah",
                lastName: "Malik",
                contact: "+44 789 456 123",
                dob: "1992-11-10",
                address: "45 Oxford Street, London",
                bio: "Finance recruiter with strong fintech network and client relationship expertise.",
            },
            company: {
                companyName: "TechBridge Recruiters",
                businessName: "TechBridge Global Ltd.",
                acn: "AC987654321",
                businessAddress: "45 Oxford Street, London",
                directorName: "Sarah Malik",
                directorPhone: "+44 789 456 123",
                directorEmail: "sarah@techbridge.com",
            },
            tax: {
                tfn: "987-654-321",
                abn: "12 345 678 900",
                residencyStatus: "UK Tax Resident",
            },
            social: {
                linkedin: "https://linkedin.com/in/sarahmalik",
                facebook: "https://facebook.com/sarahmalik",
                twitter: "https://twitter.com/sarahmalik",
                instagram: "https://instagram.com/sarahmalik",
                github: "https://github.com/sarahmalik",
            },
        },
    ];

    const kybStats = [
        { label: "Pending KYB", value: "18", helper: "Awaiting document review" },
        { label: "Representative approvals", value: "12", helper: "Owner confirmation required" },
        { label: "Watchlist recruiters", value: "4", helper: "Recent disputes or chargebacks" },
    ];

    const accountStructure = [
        "Each company has one owner (main) account that controls badges, wallet, squad hiring.",
        "Representatives (sub accounts) require owner-issued reference code + approval in admin.",
        "If representative signs up without owner reference, admin must verify KYC/KYB before linking.",
    ];

    const representativeQueue = [
        {
            id: "REP-2031",
            company: "TalentMatch HR",
            owner: "John Doe",
            rep: "Samantha Lee",
            status: "Waiting owner approval",
            submitted: "11 Mar, 2025",
        },
        {
            id: "REP-2032",
            company: "Apex Logistics",
            owner: "Priya Patel",
            rep: "Marco Ruiz",
            status: "Needs additional KYC",
            submitted: "10 Mar, 2025",
        },
    ];

    const ownerControls = [
        "Send approval code to representative",
        "Force password reset / deactivate representative profile",
        "Switch into representative account for support (proxy login)",
    ];

    const filteredRecruiters = recruiters.filter(recruiter =>
        recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recruiter.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recruiter.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-2 md:p-4 space-y-4">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Recruiter Directory
                        <Sparkles className="w-5 h-5 text-brand-500" />
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage and explore all registered recruitment partners
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {filteredRecruiters.length} recruiters
                    </span>
                </div>
            </div>

            {/* Enhanced Table Card */}
            <ComponentCard
                title="All Recruiters"
                desc="List of all registered recruiter companies"
                headerRight={
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, owner, or industry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 w-64"
                            />
                        </div>
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                {[
                                    "Company",
                                    "Owner",
                                    "Email",
                                    "Industry",
                                    "Location",
                                    "Jobs",
                                    "Status",
                                    "Joined",
                                ].map((heading) => (
                                    <th key={heading} className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredRecruiters.map((r) => (
                                <tr
                                    key={r.id}
                                    onClick={() => {
                                        setSelectedRecruiter(r);
                                        setActiveTab("basic");
                                    }}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group"
                                >
                                    {/* Company */}
                                    <td className="px-6 py-3 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-brand-50 dark:bg-brand-500/10 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                    {r.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Users className="w-3 h-3" />
                                                    {r.companySize}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Owner */}
                                    <td className="px-6 py-3 align-middle text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        {r.owner}
                                    </td>

                                    {/* Email */}
                                    <td className="px-6 py-3 align-middle text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <span className="truncate max-w-[180px]">{r.email}</span>
                                        </div>
                                    </td>

                                    {/* Industry */}
                                    <td className="px-6 py-3 align-middle text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            {r.industry}
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-3 align-middle text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            {r.location}
                                        </div>
                                    </td>

                                    {/* Jobs */}
                                    <td className="px-6 py-3 align-middle">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                            <Crown className="w-3 h-3" />
                                            {r.jobsPosted}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-3 align-middle">
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${r.verified
                                                    ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                                                    : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                                                }`}
                                        >
                                            {r.verified && <BadgeCheck className="w-3 h-3" />}
                                            {r.verified ? "Verified" : "Pending"}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-6 py-3 align-middle text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            {r.joinedAt}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRecruiters.length === 0 && (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No recruiters found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                Try adjusting your search terms
                            </p>
                        </div>
                    )}
                </div>

            </ComponentCard>

            <ComponentCard
                title="KYB & representative controls"
                desc="Owner vs representative accounts, as outlined in the document."
            >
                <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-300">
                    {kybStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.helper}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Account structure</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                            {accountStructure.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Owner controls</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                            {ownerControls.map((control) => (
                                <li key={control}>{control}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-2 font-medium">Request ID</th>
                                <th className="px-4 py-2 font-medium">Company</th>
                                <th className="px-4 py-2 font-medium">Owner</th>
                                <th className="px-4 py-2 font-medium">Representative</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                                <th className="px-4 py-2 font-medium">Submitted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {representativeQueue.map((rep) => (
                                <tr key={rep.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{rep.id}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{rep.company}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{rep.owner}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{rep.rep}</td>
                                    <td className="px-4 py-2">
                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                            {rep.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{rep.submitted}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>

            {/* Enhanced Recruiter Details Modal */}
            {selectedRecruiter && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setSelectedRecruiter(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                    >
                        {/* Enhanced Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl shadow-sm">
                                    <Building2 className="text-brand-600 dark:text-brand-400 w-7 h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {selectedRecruiter.name}
                                        </h2>
                                        {selectedRecruiter.verified && (
                                            <BadgeCheck className="text-success-500 w-5 h-5" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {selectedRecruiter.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" />
                                            {selectedRecruiter.industry}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {selectedRecruiter.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {selectedRecruiter.companySize}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Tabs */}
                        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 scrollbar-hide">
                            {[
                                { key: "basic", label: "Basic Details", icon: Users },
                                { key: "company", label: "Company", icon: Building2 },
                                { key: "tax", label: "Tax Info", icon: FileText },
                                { key: "social", label: "Social Media", icon: Globe },
                                { key: "kyc", label: "KYC & KYB", icon: FileCheck2 },
                                { key: "docs", label: "Documents", icon: FileText },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap ${activeTab === tab.key
                                            ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 shadow-sm"
                                            : "hover:text-brand-500 hover:bg-white/50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Enhanced Tab Content */}
                        <div className="p-6 text-sm text-gray-700 dark:text-gray-300 overflow-y-auto max-h-96">
                            {activeTab === "basic" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.firstName}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Contact</label>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.contact}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.dob}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.lastName}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg col-span-2">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</label>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.address}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg col-span-2">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bio</label>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedRecruiter.basic.bio}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "company" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(selectedRecruiter.company).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white break-words">{value as string}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "tax" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(selectedRecruiter.tax).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white font-mono">{value as string}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "social" && (
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(selectedRecruiter.social).map(([key, link]) => (
                                        <div key={key} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                    {key}
                                                </label>
                                                <p className="font-medium text-gray-900 dark:text-white break-all">
                                                    {link as string}
                                                </p>
                                            </div>
                                            <a
                                                href={link as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand-500 hover:text-brand-600 px-3 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                                            >
                                                Visit
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "kyc" && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileCheck2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">KYC & KYB Verification</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        Verification data not uploaded yet
                                    </p>
                                    <button className="mt-4 px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                                        Request Verification
                                    </button>
                                </div>
                            )}

                            {activeTab === "docs" && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Documents & Certificates</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        No documents or certificates uploaded
                                    </p>
                                    <button className="mt-4 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        Upload Documents
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Footer */}
                        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {selectedRecruiter.id} • Joined {selectedRecruiter.joinedAt}
                            </div>
                            <div className="flex gap-2">
                                {/* <button className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors">
                                    Edit Profile
                                </button> */}
                                <button
                                    onClick={() => setSelectedRecruiter(null)}
                                    className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
