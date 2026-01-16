"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, BadgeCheck, MessageSquare, CheckCircle2, Plus, Sparkles } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import UserStatusBadge from "@/components/user-management/UserStatusBadge";
import {
  AdminProfileRecord,
  AdminProfileSection,
  StaffActivity,
  SupportSummary,
  baseSupportSummary,
  buildNotes,
  buildProfileSeed,
} from "@/data/adminProfile";

type StatusAction = "suspend" | "reactivate" | "deactivate";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const sectionTick = (verified: boolean) =>
  verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
      <CheckCircle2 className="h-3 w-3" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
      Pending
    </span>
  );

const sectionToToggleMap = (sections: AdminProfileSection[]) =>
  sections.reduce<Record<string, boolean>>((acc, section) => {
    acc[section.key] = section.verified;
    return acc;
  }, {});

const loadPersistedNotes = (userKey: string, fallback: StaffActivity[]) => {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(`admin-notes-${userKey}`);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as StaffActivity[];
  } catch {
    return fallback;
  }
};

const persistNotes = (userKey: string, value: StaffActivity[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`admin-notes-${userKey}`, JSON.stringify(value));
};

const mapFetchedProfile = (
  seed: AdminProfileRecord,
  fetched: any
): AdminProfileRecord => {
  if (!fetched) return seed;
  const base = {
    ...seed,
    name:
      fetched.firstName && fetched.lastName
        ? `${fetched.firstName} ${fetched.lastName}`
        : seed.name,
    status: fetched.status ?? seed.status,
    kycStatus: fetched.kycStatus ?? seed.kycStatus,
    location: fetched.location ?? seed.location,
  };

  if (seed.userType === "jobseeker") {
    const experience = fetched.experience ?? seed.role;
    const preferences = fetched.preferences ?? seed.sections.find((s) => s.key === "preferences");
    return {
      ...base,
      role: fetched.jobTitle ?? seed.role,
      sections: [
        {
          key: "basic",
          title: "Basic details",
          verified: true,
          fields: [
            { label: "Email", value: fetched.email ?? "—" },
            { label: "Phone", value: fetched.phone ?? "—" },
            { label: "Current location", value: fetched.location ?? "—" },
          ],
        },
        {
          key: "experience",
          title: "Experience",
          verified: true,
          fields: [
            { label: "Role", value: fetched.jobTitle ?? seed.role },
            { label: "Total experience", value: experience ?? "—" },
            { label: "Skills", value: (fetched.skills ?? []).join(", ") || "—" },
          ],
        },
        {
          key: "education",
          title: "Education",
          verified: false,
          fields: [
            { label: "Degree", value: fetched.education?.degree ?? "Not provided" },
            { label: "Institute", value: fetched.education?.institute ?? "—" },
            { label: "Graduation", value: fetched.education?.year ?? "—" },
          ],
        },
        {
          key: "preferences",
          title: "Preferences",
          verified: false,
          fields: [
            { label: "Availability", value: preferences?.availability ?? "—" },
            { label: "Work type", value: preferences?.type ?? "—" },
            { label: "Location preference", value: preferences?.locationPreference ?? "—" },
          ],
        },
        {
          key: "kyc",
          title: "KYC",
          verified: fetched.kycStatus === "verified",
          fields: [
            { label: "Status", value: fetched.kycStatus ?? "pending" },
            { label: "Document", value: "Govt ID + selfie" },
          ],
        },
        {
          key: "tax",
          title: "Tax info",
          verified: Boolean(fetched.tfn || fetched.abn),
          fields: [
            { label: "TFN", value: fetched.tfn ?? "Pending" },
            { label: "ABN", value: fetched.abn ?? "Pending" },
          ],
        },
      ],
    };
  }

  if (seed.userType === "recruiter") {
    return {
      ...base,
      role: fetched.companyName ? `${fetched.companyName} recruiter` : seed.role,
      sections: [
        {
          key: "company",
          title: "Company",
          verified: true,
          fields: [
            { label: "Company", value: fetched.companyName ?? "—" },
            { label: "Industry", value: fetched.industry ?? "—" },
            { label: "Company size", value: fetched.companySize ?? "—" },
          ],
        },
        {
          key: "offers",
          title: "Job offers",
          verified: true,
          fields: [
            { label: "Active offers", value: fetched.jobsPosted ?? "—" },
            { label: "Closed offers", value: "—" },
            { label: "Expired offers", value: "—" },
          ],
        },
        {
          key: "jobs",
          title: "Job post details",
          verified: true,
          fields: [
            { label: "Latest job", value: fetched.latestJobTitle ?? "Not provided" },
            { label: "Method", value: "Quick + Manual" },
            { label: "Budget", value: fetched.budget ?? "SG 2,500" },
            {
              label: "Last updated",
              value: fetched.updatedAt ? formatDateTime(fetched.updatedAt) : "—",
            },
          ],
        },
        {
          key: "hiring",
          title: "Hiring methods",
          verified: true,
          fields: [
            { label: "Quick", value: "Enabled" },
            { label: "Manual", value: "Enabled" },
            { label: "Budget", value: "SG 2,500" },
          ],
        },
        {
          key: "kyb",
          title: "KYB",
          verified: fetched.kycStatus === "verified",
          fields: [
            { label: "ABN", value: fetched.abn ?? "Pending" },
            { label: "KYB status", value: fetched.kycStatus ?? "pending" },
          ],
        },
      ],
    };
  }

  if (seed.userType === "squad") {
    return {
      ...base,
      role: "Squad leader",
      sections: [
        {
          key: "squad",
          title: "Squad details",
          verified: fetched.status === "active",
          fields: [
            { label: "Squad name", value: fetched.name ?? seed.name },
            { label: "Category", value: fetched.category ?? "—" },
            { label: "Jobs applied", value: fetched.appliedJobs ?? 0 },
          ],
        },
        {
          key: "activity",
          title: "Activity summary",
          verified: true,
          fields: [
            { label: "Members", value: fetched.membersCount ?? 0 },
            { label: "Last active", value: fetched.lastActive ? formatDateTime(fetched.lastActive) : "—" },
            { label: "Created", value: fetched.createdAt ? formatDateTime(fetched.createdAt) : "—" },
          ],
        },
      ],
    };
  }

  return {
    ...base,
    sections: [
      {
        key: "profile",
        title: "Profile",
        verified: fetched.kycStatus === "verified",
        fields: [
          { label: "Email", value: fetched.email ?? "—" },
          { label: "Phone", value: fetched.phone ?? "—" },
          { label: "Location", value: fetched.location ?? "—" },
        ],
      },
      {
        key: "services",
        title: "Services",
        verified: false,
        fields: [
          { label: "Preferred services", value: "Courier, cleaning" },
          { label: "Budget", value: "SG 600 / month" },
          { label: "Engagement", value: fetched.totalGigs ? `${fetched.totalGigs} gigs` : "—" },
        ],
      },
    ],
  };
};

export default function AdminProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userType = (params?.userType as AdminProfileRecord["userType"]) ?? "individual";
  const userId = (params?.userId as string) ?? "user";
  const [profile, setProfile] = useState<AdminProfileRecord>(() =>
    buildProfileSeed(userType, userId)
  );
  const [sectionVerification, setSectionVerification] = useState<Record<string, boolean>>(
    () => sectionToToggleMap(buildProfileSeed(userType, userId).sections)
  );
  const [badges, setBadges] = useState<string[]>(() => buildProfileSeed(userType, userId).badges);
  const [newBadge, setNewBadge] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [notes, setNotes] = useState<StaffActivity[]>(() =>
    loadPersistedNotes(`${userType}-${userId}`, buildNotes(userId))
  );
  const [supportSummary, setSupportSummary] = useState<SupportSummary>(baseSupportSummary);
  const [toast, setToast] = useState<string | null>(null);
  const [documents, setDocuments] = useState(profile.documents ?? []);

  const acceptanceImpact = useMemo(() => {
    if (profile.userType !== "jobseeker" || !profile.acceptanceRating) return null;
    const finalMatch = ((86 + profile.acceptanceRating) / 2).toFixed(1);
    return finalMatch;
  }, [profile]);

  useEffect(() => {
    const seed = buildProfileSeed(userType, userId);
    setProfile(seed);
    setBadges(seed.badges);
    setSectionVerification(sectionToToggleMap(seed.sections));
    setDocuments(seed.documents ?? []);
    const seededNotes = loadPersistedNotes(`${userType}-${userId}`, buildNotes(userId));
    setNotes(seededNotes);
    persistNotes(`${userType}-${userId}`, seededNotes);
    fetch(`/api/users/${userType === "squad" ? "squads" : `${userType}s`}?limit=60&search=${encodeURIComponent(userId)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data?.data?.find((item: any) => item.id === userId);
        if (found) {
          setProfile((prev) => mapFetchedProfile(prev, found));
        }
      })
      .catch(() => undefined);
  }, [userType, userId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDocUpload = (docName: string, fileLabel: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.name === docName
          ? { ...doc, status: "submitted", lastUpdated: new Date().toISOString() }
          : doc
      )
    );
    const entry: StaffActivity = {
      id: `doc-${Date.now()}`,
      action: "Document uploaded",
      reason: `${docName} updated (${fileLabel})`,
      staffId: "staff-admin",
      staffName: "Super Admin",
      timestamp: new Date().toISOString(),
      title: `${docName} uploaded`,
      category: "verification",
    };
    const updated = [entry, ...notes];
    setNotes(updated);
    persistNotes(`${userType}-${userId}`, updated);
    setToast("Document updated");
  };

  const toggleDocVerify = (docName: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.name === docName
          ? {
              ...doc,
              status: doc.status === "verified" ? "submitted" : "verified",
              lastUpdated: new Date().toISOString(),
            }
          : doc
      )
    );
    const entry: StaffActivity = {
      id: `doc-verify-${Date.now()}`,
      action: "Document verification",
      reason: `${docName} ${documents.find((d) => d.name === docName)?.status === "verified" ? "marked unverified" : "marked verified"}`,
      staffId: "staff-admin",
      staffName: "Super Admin",
      timestamp: new Date().toISOString(),
      title: `${docName} verification`,
      category: "verification",
    };
    const updated = [entry, ...notes];
    setNotes(updated);
    persistNotes(`${userType}-${userId}`, updated);
    setToast("Document verification updated");
  };

  const handleStatusAction = (action: StatusAction) => {
    if (!statusReason.trim()) {
      setToast("Add a reason before changing status.");
      return;
    }
    const nextStatus =
      action === "suspend" ? "suspended" : action === "deactivate" ? "inactive" : "active";
    setProfile((prev) => ({ ...prev, status: nextStatus }));
    const entry: StaffActivity = {
      id: `note-${Date.now()}`,
      action: `${action} user`,
      reason: statusReason.trim(),
      staffId: "staff-admin",
      staffName: "Super Admin",
      timestamp: new Date().toISOString(),
      title: `Status changed to ${nextStatus}`,
      category: "status",
    };
    const updated = [entry, ...notes];
    setNotes(updated);
    persistNotes(`${userType}-${userId}`, updated);
    setStatusReason("");
    setToast(`Status updated to ${nextStatus}`);
  };

  const handleAddBadge = () => {
    const value = newBadge.trim();
    if (!value) return;
    const next = [...badges, value];
    setBadges(next);
    setProfile((prev) => ({ ...prev, badges: next }));
    const entry: StaffActivity = {
      id: `badge-${Date.now()}`,
      action: "Badge assigned",
      reason: value,
      staffId: "staff-admin",
      staffName: "Super Admin",
      timestamp: new Date().toISOString(),
      title: `Badge: ${value}`,
      category: "badge",
    };
    const updated = [entry, ...notes];
    setNotes(updated);
    persistNotes(`${userType}-${userId}`, updated);
    setSupportSummary((prev) => ({ ...prev, ticketsOpened: prev.ticketsOpened + 1 }));
    setNewBadge("");
    setToast("Badge assigned");
  };

  const toggleVerification = (key: string) => {
    setSectionVerification((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setProfile((current) => ({
        ...current,
        sections: current.sections.map((section) =>
          section.key === key ? { ...section, verified: next[key] } : section
        ),
      }));
      const entry: StaffActivity = {
        id: `verify-${Date.now()}`,
        action: "Section verification",
        reason: `${key} marked ${next[key] ? "verified" : "unverified"}`,
        staffId: "staff-admin",
        staffName: "Super Admin",
        timestamp: new Date().toISOString(),
        title: `Section ${next[key] ? "verified" : "unverified"}`,
        category: "verification",
      };
      const updated = [entry, ...notes];
      setNotes(updated);
      persistNotes(`${userType}-${userId}`, updated);
      return next;
    });
  };

  const recentNotes = notes.slice(0, 3);

  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Admin / Profile</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <UserStatusBadge status={profile.status as any} />
            {profile.kycStatus && sectionTick(profile.kycStatus === "verified")}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile.role} — {profile.location ?? "Location pending"} — {userType} ID {userId}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-100"
              >
                <Sparkles className="h-3 w-3" />
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Back
          </Button>
          <Link href={`/admin/profile/${userType}/${userId}/notes`}>
            <Button variant="outline" size="sm">Internal staff notes</Button>
          </Link>
          <Button size="sm" onClick={() => router.push(`/chat?userId=${userId}&userName=${encodeURIComponent(profile.name)}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Start chat
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_420px] items-start">
        <div className="space-y-4">
          <ComponentCard
            title="User view"
            desc="Rendered exactly as user sees it. Admin controls stay on the right."
          >
            <div className="p-5 lg:p-6 space-y-5">
              {profile.userType === "jobseeker" && profile.acceptanceRating !== undefined && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Acceptance rating: {profile.acceptanceRating}% (internal)
                  </div>
                  <p className="text-xs mt-1">
                    Drops when ≥80% matches are rejected. Final matching score = (match % + acceptance rating %) / 2 → {acceptanceImpact}%.
                    {profile.acceptanceRating <= 20 &&
                      ` Auto-suspended for 30 days${
                        profile.autoSuspendedUntil ? ` until ${profile.autoSuspendedUntil}` : ""
                      }.`}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {profile.sections.map((section) => (
                  <div
                    key={section.key}
                    className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      {sectionTick(sectionVerification[section.key])}
                    </div>
                    <div className="mt-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
                      {section.fields.map((field) => (
                        <div key={`${section.key}-${field.label}`} className="flex justify-between gap-3">
                          <span className="text-gray-500">{field.label}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ComponentCard>

          {profile.offers && (
            <ComponentCard title="Job offers & pool" desc="Live offers the job seeker sees">
              <div className="p-4 grid gap-3 md:grid-cols-3 text-sm text-gray-700 dark:text-gray-200">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Active offers
                  </p>
                  <ul className="mt-2 space-y-1">
                    {profile.offers.active.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Accepted
                  </p>
                  <ul className="mt-2 space-y-1">
                    {profile.offers.accepted.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Expired
                  </p>
                  <ul className="mt-2 space-y-1">
                    {profile.offers.expired.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ComponentCard>
          )}

          {profile.members && (
            <ComponentCard title="Squad members" desc="Exact membership & scopes the leader sees">
              <div className="p-4 grid gap-2">
                {profile.members.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900/50"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        {member.role} — {member.scope}
                      </p>
                    </div>
                    <BadgeCheck className="h-4 w-4 text-blue-600" />
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}
        </div>

        <div className="space-y-4">
          <ComponentCard title="Admin overlay" desc="Internal-only controls">
            <div className="p-5 space-y-4">
              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <Label>Badges</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newBadge}
                      onChange={(event) => setNewBadge(event.target.value)}
                      placeholder="Add badge"
                    />
                    <Button size="sm" onClick={handleAddBadge}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Section verification</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {profile.sections.map((section) => (
                      <button
                        key={section.key}
                        type="button"
                        onClick={() => toggleVerification(section.key)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                          sectionVerification[section.key]
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                        }`}
                      >
                        <span>{section.title}</span>
                        {sectionTick(sectionVerification[section.key])}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <Label>Status actions (reason required)</Label>
                <TextArea
                  rows={3}
                  value={statusReason}
                  onChange={setStatusReason}
                  placeholder="Reason is stored permanently in staff notes"
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleStatusAction("suspend")}>
                    Suspend (reason)
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleStatusAction("deactivate")}>
                    Deactivate
                  </Button>
                  <Button size="sm" onClick={() => handleStatusAction("reactivate")}>
                    Reactivate
                  </Button>
                </div>
              </div>

              {documents.length > 0 && (
                <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Documents</p>
                      <p className="text-xs text-gray-500">Upload or mark verified (admin-only)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900/60"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.lastUpdated ? `Updated ${formatDateTime(doc.lastUpdated)}` : "Not uploaded"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            className="hidden"
                            id={`doc-${doc.name}`}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              handleDocUpload(doc.name, file.name);
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById(`doc-${doc.name}`) as HTMLInputElement | null;
                              input?.click();
                            }}
                          >
                            {doc.status === "submitted" ? "Replace" : doc.status === "verified" ? "Replace" : "Upload"}
                          </Button>
                          <Button
                            size="sm"
                            variant={doc.status === "verified" ? "outline" : "primary"}
                            onClick={() => toggleDocVerify(doc.name)}
                          >
                            {doc.status === "verified" ? "Unverify" : "Verify"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>

          <ComponentCard title="Internal staff notes" desc="Private & auditable">
            <div className="p-4 space-y-3">
              {recentNotes.map((note) => (
                <div key={note.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-gray-900/60">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white">{note.title}</p>
                    <span className="text-[11px] text-gray-500">{formatDateTime(note.timestamp)}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">
                    {note.reason} — <span className="text-xs text-gray-500">by {note.staffName}</span>
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1 text-gray-700 dark:text-gray-200">
                  <p>Tickets opened: {supportSummary.ticketsOpened}</p>
                  <p>Tickets closed: {supportSummary.ticketsClosed}</p>
                  <p>Tickets pending: {supportSummary.ticketsPending}</p>
                  <p>Active chats: {supportSummary.activeChats}</p>
                  <p>Closed chats: {supportSummary.closedChats}</p>
                </div>
                <Link href={`/admin/profile/${userType}/${userId}/notes`} className="text-sm font-semibold text-brand-600 hover:text-brand-500">
                  Open history
                </Link>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-0 z-[100000] flex items-start justify-end px-4 pt-6">
          <div className="rounded-2xl border border-brand-200 bg-white/95 px-4 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-400/30 backdrop-blur dark:border-brand-800 dark:bg-gray-900/90 dark:text-brand-200">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
