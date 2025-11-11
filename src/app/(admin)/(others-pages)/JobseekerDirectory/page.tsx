"use client";

import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  MapPin,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Users,
} from "lucide-react";

export default function JobseekerDirectory() {
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [searchQuery, setSearchQuery] = useState("");

  const jobseekers = [
    {
      id: 1,
      name: "Ayesha Khan",
      email: "ayesha.khan@email.com",
      jobTitle: "Frontend Developer",
      experience: "3 years",
      location: "Karachi, Pakistan",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      joinedAt: "15 Feb, 2025",
      status: "Active",
      bio: "Frontend engineer focused on modern React stacks and clean, accessible UI. Experienced in building reusable, maintainable component systems.",
      resume: "https://drive.google.com/file/d/xyz",
      basic: {
        firstName: "Ayesha",
        lastName: "Khan",
        contact: "+92 300 1234567",
        dob: "10 June 1998",
        address: "Block 5, Clifton, Karachi",
      },
      experienceDetails: [
        {
          title: "Frontend Developer",
          company: "TechHive",
          duration: "Jan 2022 - Feb 2025",
          description: "Developed responsive UIs using React, Next.js, and Tailwind CSS for enterprise clients.",
        },
      ],
      preferences: {
        role: "Frontend Developer",
        type: "Full-time",
        salary: "$70k - $90k",
        availability: "Immediate",
        locationPreference: "Hybrid",
      },
      education: {
        degree: "Bachelor of Computer Science",
        institute: "NED University of Engineering & Technology",
        year: "2019 - 2023",
      },
      tax: { tfn: "123-456-789", residency: "Pakistani Resident" },
      social: {
        linkedin: "https://linkedin.com/in/ayeshakhan",
        github: "https://github.com/ayeshakhan",
      },
      kyc: {
        identity: "Verified",
        address: "Pending",
        resumeVerification: "Verified",
      },
      documents: [
        {
          name: "Bachelor Degree Certificate",
          date: "March 2023",
          status: "Verified",
          link: "#",
        },
        {
          name: "Resume PDF",
          date: "Jan 2025",
          status: "Approved",
          link: "#",
        },
      ],
    },
  ];

  const filteredJobseekers = useMemo(() => {
    if (!searchQuery.trim()) return jobseekers;
    const query = searchQuery.toLowerCase();
    return jobseekers.filter(js =>
      js.name.toLowerCase().includes(query) ||
      js.email.toLowerCase().includes(query) ||
      js.jobTitle.toLowerCase().includes(query) ||
      js.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const tabs = [
    { key: "basic", label: "Basic Details" },
    { key: "experience", label: "Experience" },
    { key: "preferences", label: "Preferences" },
    { key: "education", label: "Education" },
    { key: "tax", label: "Tax Info" },
    { key: "social", label: "Social Links" },
    { key: "kyc", label: "KYC Status" },
    { key: "docs", label: "Documents" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
      case "Approved":
      case "Active":
        return <CheckCircle2 className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <XCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Jobseeker Directory
            <Users className="w-5 h-5 text-brand-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and explore all registered jobseekers
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredJobseekers.length} jobseekers
        </div>
      </div>

      {/* Enhanced Table */}
      <ComponentCard
        title="All Jobseekers"
        desc="List of all registered jobseekers on SquadGoo"
        headerRight={
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobseekers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Jobseeker</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role & Experience</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredJobseekers.map((js) => (
                <tr
                  key={js.id}
                  onClick={() => {
                    setSelected(js);
                    setActiveTab("basic");
                  }}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-50 dark:bg-brand-500/10 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
                        <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {js.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {js.jobTitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {js.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{js.jobTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3" />
                        {js.experience}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {js.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        js.status === "Active"
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}
                    >
                      {getStatusIcon(js.status)}
                      {js.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobseekers.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No jobseekers found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Enhanced Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Enhanced Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-start gap-4">
                <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-xl shadow-sm">
                  <User className="text-brand-600 dark:text-brand-400 w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selected.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selected.jobTitle} • {selected.location}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        selected.status === "Active"
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}
                    >
                      {getStatusIcon(selected.status)}
                      {selected.status}
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{selected.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {selected.joinedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm font-medium text-gray-700 dark:text-gray-300 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-900 shadow-sm"
                      : "hover:text-brand-500 hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Enhanced Tab Content */}
            <div className="p-6 text-sm text-gray-700 dark:text-gray-300 max-h-[50vh] overflow-y-auto">
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected.basic).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{value as string}</p>
                    </div>
                  ))}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bio</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{selected.bio}</p>
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div className="space-y-4">
                  {selected.experienceDetails.map((exp: any, i: number) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">at {exp.company}</p>
                      <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected.preferences).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{value as string}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "education" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected.education).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key}
                      </label>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{value as string}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "tax" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected.tax).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {key.toUpperCase()}
                      </label>
                      <p className="font-medium text-gray-900 dark:text-white mt-1 font-mono">{value as string}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "social" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected.social).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key}
                      </label>
                      <a 
                        href={value as string} 
                        target="_blank" 
                        className="font-medium text-brand-600 dark:text-brand-400 hover:underline break-all block mt-1"
                      >
                        {value as string}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "kyc" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(selected.kyc).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize block mb-2">
                        {key}
                      </label>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        value === "Verified" 
                          ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                          : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                      }`}>
                        {getStatusIcon(value as string)}
                        {value as string}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "docs" && (
                <div className="space-y-3">
                  {selected.documents.map((d: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{d.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Uploaded: {d.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                          d.status === "Verified" || d.status === "Approved"
                            ? "bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400"
                            : "bg-warning-50 dark:bg-warning-500/15 text-warning-700 dark:text-warning-400"
                        }`}>
                          {getStatusIcon(d.status)}
                          {d.status}
                        </span>
                        <a
                          href={d.link}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-950">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {selected.id} • Joined {selected.joinedAt}
              </div>
              <div className="flex gap-2">
                <a
                  href={selected.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
                <button
                  onClick={() => setSelected(null)}
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