"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfileData } from "@/hooks/useProfileData";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useRef } from "react";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import DatePicker from "../form/date-picker";
import { Modal } from "../ui/modal";
import type {
  ProfilePayload,
  ProfileSocialLinks,
  FeedbackType,
  FeedbackDirection,
} from "@/types/profile";
import { CalenderIcon } from "@/icons";

type ChangeRequestStatus = "Pending" | "Approved" | "Rejected";
type ChangeRequest = {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  reason: string;
  userId: string;
  status: ChangeRequestStatus;
  submittedAt: string;
};

const ratingClasses = (rating: number) =>
  Array.from({ length: 5 }, (_, index) =>
    index < rating ? "text-brand-500" : "text-gray-300"
  );

const plurality = (count: number) => (count === 1 ? "task" : "tasks");

const socialIcons: Record<keyof ProfileSocialLinks, string> = {
  facebook:
    "M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z",

  twitter:
    "M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z",

  linkedin:
    "M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z",

  instagram:
    "M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const ProfileHeader: React.FC<{
  profile: ProfilePayload;
  onSocialSave: (values: { social: ProfileSocialLinks; bio: string }) => void;
  onAvatarChange: (nextAvatar: string) => void;
}> = ({ profile, onSocialSave, onAvatarChange }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [social, setSocial] = useState(profile.social);
  const [bio, setBio] = useState(profile.bio);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSocial(profile.social);
    setBio(profile.bio);
  }, [profile]);

  useEffect(() => {
    if (isOpen) {
      setSocial(profile.social);
      setBio(profile.bio);
    }
  }, [isOpen, profile]);

  const handleSubmit = () => {
    onSocialSave({ social, bio });
    closeModal();
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    onAvatarChange(nextUrl);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 shadow-sm transition hover:shadow-md dark:border-gray-800"
            aria-label="Update profile picture"
          >
            <div className="h-full w-full">
              <Image
                src={profile.avatar}
                width={96}
                height={96}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
              Update photo
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </button>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {profile.name.full}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.role} · {profile.location}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(profile.social).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-sm text-gray-600 shadow-sm transition hover:border-brand-300 hover:text-brand-500"
            >
              <span className="sr-only">{key}</span>
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={socialIcons[key as keyof ProfileSocialLinks]}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>
          ))}
        </div>
        <Button size="sm" onClick={openModal} className="ml-auto lg:ml-0">
          Edit social & bio
        </Button>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {profile.bio}
      </p>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl">
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900">
            Update social links & bio
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(social).map(([key, value]) => (
              <div key={key}>
                <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  type="text"
                  value={value}
                  onChange={(event) =>
                    setSocial((prev) => ({
                      ...prev,
                      [key]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <div>
              <Label>Bio</Label>
              <Input type="text" value={bio} onChange={(event) => setBio(event.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ProfilePersonal: React.FC<{
  profile: ProfilePayload;
  onProfileUpdate: (next: ProfilePayload) => void;
  onSubmitRequest: (req: ChangeRequest) => void;
}> = ({ profile, onProfileUpdate, onSubmitRequest }) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [reason, setReason] = useState("");
  const restrictedFields = useMemo(
    () => new Set(["email", "phone", "address", "city", "state", "country"]),
    []
  );

  const fields = useMemo(
    () => [
      { label: "Full name", value: profile.name.full, key: "full" },
      { label: "Email", value: profile.personalInfo.email, key: "email" },
      { label: "Phone", value: profile.personalInfo.phone, key: "phone" },
      { label: "Address", value: profile.personalInfo.address, key: "address" },
      { label: "City", value: profile.personalInfo.city, key: "city" },
      { label: "State", value: profile.personalInfo.state, key: "state" },
      { label: "Country", value: profile.personalInfo.country, key: "country" },
    ],
    [profile]
  );

  const startEdit = (fieldKey: string, value: string) => {
    setEditingKey(fieldKey);
    setDraftValue(value);
    setReason("");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraftValue("");
    setReason("");
  };

  const handleSave = (fieldKey: string, label: string, oldValue: string) => {
    const trimmed = draftValue.trim();
    if (!trimmed || trimmed === oldValue) {
      cancelEdit();
      return;
    }

    if (restrictedFields.has(fieldKey)) {
      if (!reason.trim()) {
        return;
      }
      const req: ChangeRequest = {
        id: `req-${Date.now()}`,
        fieldKey,
        fieldLabel: label,
        oldValue,
        newValue: trimmed,
        reason: reason.trim(),
        userId: profile.id,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };
      onSubmitRequest(req);
      cancelEdit();
      return;
    }

    if (fieldKey === "full") {
      const [first, ...rest] = trimmed.split(" ");
      const last = rest.join(" ") || profile.name.last;
      onProfileUpdate({
        ...profile,
        name: { ...profile.name, full: trimmed, first: first || profile.name.first, last },
      });
    } else {
      onProfileUpdate({
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          [fieldKey]: trimmed,
        },
      } as ProfilePayload);
    }
    cancelEdit();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Personal information
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Inline edits save immediately for open fields. Restricted fields submit a request.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const isEditing = editingKey === field.key;
          const isRestricted = restrictedFields.has(field.key);
          return (
            <div
              key={field.key}
              className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    {field.label}
                  </p>
                  {isRestricted && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
                      Needs review
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(field.key, field.label, field.value)}
                      disabled={isRestricted && !reason.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(field.key, field.value)}
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-500"
                  >
                    <span aria-hidden>✏️</span> Edit
                  </button>
                )}
              </div>
              <div className="mt-2">
                {isEditing ? (
                  <Input
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {field.value}
                  </p>
                )}
              </div>
              {isEditing && isRestricted && (
                <div className="mt-3 space-y-2">
                  <Label>Reason for change</Label>
                  <TextArea
                    rows={2}
                    value={reason}
                    onChange={(value) => setReason(value)}
                    placeholder="Explain why this needs to change. Required for restricted fields."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type ReviewRatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

const reviewRatingValues: ReviewRatingFilter[] = ["5", "4", "3", "2", "1"];

const ProfileRequests: React.FC<{
  requests: ChangeRequest[];
}> = ({ requests }) => {
  const statusTone: Record<ChangeRequestStatus, string> = {
    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100",
    Approved:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
    Rejected:
      "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-100",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Requests
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Field-level change requests with old → new values and reason.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-200">
          {requests.length} total
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No requests submitted yet.
          </p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {req.fieldLabel}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[req.status]}`}
                >
                  {req.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                  Old: {req.oldValue}
                </span>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
                  New: {req.newValue}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Reason: {req.reason}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                Submitted {formatDateTime(req.submittedAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfileReviews: React.FC<{ reviews: ProfilePayload["reviews"] }> = ({
  reviews,
}) => {
  const [ratingFilter, setRatingFilter] = useState<ReviewRatingFilter>("all");
  const [pendingStartDate, setPendingStartDate] = useState("");
  const [pendingEndDate, setPendingEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const ratingOptions = useMemo(() => {
    const counts = reviews.reduce<Record<string, number>>((acc, review) => {
      const key = review.rating.toString();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return [
      {
        value: "all" as const,
        label: `All ratings (${reviews.length})`,
      },
      ...reviewRatingValues.map((value) => ({
        value,
        label: `${value} star${value === "1" ? "" : "s"} (${counts[value] ?? 0})`,
      })),
    ];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const startTimestamp = appliedStartDate
      ? new Date(appliedStartDate).setHours(0, 0, 0, 0)
      : null;
    const endTimestamp = appliedEndDate
      ? new Date(appliedEndDate).setHours(23, 59, 59, 999)
      : null;

    return [...reviews]
      .filter((review) =>
        ratingFilter === "all" ? true : review.rating === Number(ratingFilter)
      )
      .filter((review) => {
        const reviewTimestamp = new Date(review.date).getTime();
        if (startTimestamp !== null && reviewTimestamp < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && reviewTimestamp > endTimestamp) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, ratingFilter, appliedStartDate, appliedEndDate]);

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const hasActiveDateRange = Boolean(appliedStartDate || appliedEndDate);

  const formatFilterDate = (value: string) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "";

  const pendingRangeSet = Boolean(pendingStartDate && pendingEndDate);
  const showResetButton = hasActiveDateRange || pendingRangeSet;

  const handleApplyDateRange = () => {
    if (!pendingRangeSet) {
      return;
    }
    setAppliedStartDate(pendingStartDate);
    setAppliedEndDate(pendingEndDate);
  };

  const handleResetDates = () => {
    setPendingStartDate("");
    setPendingEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
  };

  const handleRangeChange = useCallback((selectedDates: Date[], dateStr: string) => {
    if (!selectedDates.length) {
      setPendingStartDate("");
      setPendingEndDate("");
      return;
    }
    if (selectedDates.length === 1) {
      setPendingStartDate(dateStr);
      setPendingEndDate("");
      return;
    }
    const [start, end] = dateStr.split(" to ");
    setPendingStartDate(start || "");
    setPendingEndDate(end || "");
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customer service reviews
          </h4>

          <div className="ml-auto flex items-center gap-2 whitespace-nowrap">
            {/* Rating */}
            <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={ratingFilter}
                onChange={(event) =>
                  setRatingFilter(event.target.value as ReviewRatingFilter)
                }
                className="bg-transparent text-[11px] font-medium text-gray-700 focus:outline-none dark:text-gray-200"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="relative h-8 w-9 flex items-center justify-center">
              <DatePicker
                id="review-date-range"
                mode="range"
                wrapperClassName="absolute inset-0"
                inputClassName="h-8 w-9 rounded-lg border border-gray-200 bg-white text-transparent caret-transparent placeholder:text-transparent shadow-[0_2px_10px_rgba(15,23,42,0.08)] focus:outline-none dark:border-gray-700 dark:bg-gray-900/60"
                defaultDate={
                  appliedStartDate && appliedEndDate
                    ? appliedStartDate
                    : undefined
                }
                onChange={handleRangeChange}
              />
            </div>


            <Button
              size="sm"
              onClick={handleApplyDateRange}
              disabled={!pendingRangeSet}
              className="h-8 px-3 text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Apply
            </Button>

            {showResetButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetDates}
                className="h-8 px-3 text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span>
            Showing {filteredReviews.length} of {reviews.length} entries · average{" "}
            {averageRating.toFixed(1)} stars
          </span>

          {hasActiveDateRange && (
            <span>
              {formatFilterDate(appliedStartDate)} →{" "}
              {formatFilterDate(appliedEndDate)}
            </span>
          )}
        </div>
      </div>


      <div className="mt-6 space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews match the selected filters.
          </p>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-dashed border-gray-200 p-4 transition hover:border-brand-200 dark:border-gray-700 dark:hover:border-brand-500/60"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {review.author}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {review.serviceArea} · {review.channel}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-sm font-semibold text-brand-500">
                    <span>{review.rating.toFixed(1)}</span>
                    <div className="flex">
                      {ratingClasses(review.rating).map((cls, index) => (
                        <span key={index} className={`${cls} text-[11px]`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {formatDate(review.date)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                {review.subject}
              </p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfileFeedback: React.FC<{ feedback: ProfilePayload["feedback"] }> = ({
  feedback,
}) => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<"all" | FeedbackType>("all");
  const [directionFilter, setDirectionFilter] = useState<
    "all" | FeedbackDirection
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const handleRangeChange = useCallback((selectedDates: Date[], dateStr: string) => {
    if (!selectedDates.length) {
      setRangeStart("");
      setRangeEnd("");
      return;
    }
    if (selectedDates.length === 1) {
      setRangeStart(dateStr);
      setRangeEnd("");
      return;
    }
    const [start, end] = dateStr.split(" to ");
    setRangeStart(start || "");
    setRangeEnd(end || "");
  }, []);

  const baseFeedback = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const startTimestamp = rangeStart
      ? new Date(rangeStart).setHours(0, 0, 0, 0)
      : null;
    const endTimestamp = rangeEnd
      ? new Date(rangeEnd).setHours(23, 59, 59, 999)
      : null;

    return feedback
      .filter((item) => {
        if (!query) {
          return true;
        }
        return (
          item.summary.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
        );
      })
      .filter((item) => {
        const timestamp = new Date(item.timestamp).getTime();
        if (startTimestamp !== null && timestamp < startTimestamp) {
          return false;
        }
        if (endTimestamp !== null && timestamp > endTimestamp) {
          return false;
        }
        return true;
      });
  }, [feedback, searchTerm, rangeStart, rangeEnd]);

  const typeOptions = useMemo(() => {
    const counts = baseFeedback.reduce<Record<string, number>>((acc, item) => {
      acc[item.type] = (acc[item.type] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { value: "all" as const, label: `All types (${baseFeedback.length})` },
      { value: "live chat" as const, label: `Live chat (${counts["live chat"] ?? 0})` },
      { value: "call" as const, label: `Call (${counts.call ?? 0})` },
    ];
  }, [baseFeedback]);

  const directionOptions = useMemo(() => {
    const scoped = baseFeedback.filter((item) =>
      typeFilter === "all" ? true : item.type === typeFilter
    );
    const counts = scoped.reduce<Record<string, number>>((acc, item) => {
      acc[item.direction] = (acc[item.direction] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { value: "all" as const, label: `All directions (${scoped.length})` },
      { value: "given" as const, label: `Given (${counts.given ?? 0})` },
      { value: "received" as const, label: `Received (${counts.received ?? 0})` },
    ];
  }, [baseFeedback, typeFilter]);

  const filteredFeedback = useMemo(() => {
    return baseFeedback
      .filter((item) => (typeFilter === "all" ? true : item.type === typeFilter))
      .filter((item) =>
        directionFilter === "all" ? true : item.direction === directionFilter
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [baseFeedback, typeFilter, directionFilter]);

  const given = filteredFeedback.filter((item) => item.direction === "given");
  const received = filteredFeedback.filter((item) => item.direction === "received");

  const statusClass = (status: ProfilePayload["feedback"][number]["status"]) => {
    if (status === "actioned") {
      return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
    }
    if (status === "follow-up") {
      return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
    }
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  };

  const renderList = (items: typeof feedback, emptyText: string) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              router.push(`/AdminChat?ticket=${encodeURIComponent(item.id)}&mode=history`)
            }
            className="cursor-pointer rounded-2xl border border-gray-100 p-4 transition hover:border-brand-200 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-brand-500/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {item.author}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {item.type} - {formatDateTime(item.timestamp)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-200">
                  {item.direction}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                  {item.status}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  Rating {item.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.summary}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Live chat & call feedback
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500">shared by customers & team</p>
        </div>
        <div className="ml-auto flex items-end gap-3">
          {/* Type */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
              Type
            </span>
            <div className="flex h-8 w-40 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as FeedbackType | "all")
                }
                className="w-full bg-transparent text-[11px] font-medium text-gray-700 focus:outline-none dark:text-gray-200"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Direction */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
              Direction
            </span>
            <div className="flex h-8 w-40 items-center rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={directionFilter}
                onChange={(event) =>
                  setDirectionFilter(event.target.value as FeedbackDirection | "all")
                }
                className="w-full bg-transparent text-[11px] font-medium text-gray-700 focus:outline-none dark:text-gray-200"
              >
                {directionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date (icon-only, consistent with reviews) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
              Date
            </span>
            <div className="relative h-8 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/60">
              <DatePicker
                id="feedback-date-range"
                mode="range"
                wrapperClassName="absolute inset-0"
                inputClassName="h-8 w-9 rounded-lg border border-gray-200 bg-white text-transparent caret-transparent placeholder:text-transparent focus:outline-none dark:border-gray-700 dark:bg-gray-900/60"
                defaultDate={
                  rangeStart && rangeEnd ? `${rangeStart} to ${rangeEnd}` : undefined
                }
                onChange={handleRangeChange}
              />
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">
              Search
            </span>
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search feedback"
              className="h-8 w-52 rounded-lg text-[11px] font-medium text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Given</p>
          {renderList(given, "No given feedback found.")}
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Received</p>
          {renderList(received, "No received feedback found.")}
        </div>
      </div>
    </div>
  );
};

const ProfileTasks: React.FC<{ tasks: ProfilePayload["tasks"] }> = ({ tasks }) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<
    "all" | ProfilePayload["tasks"][number]["status"]
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | ProfilePayload["tasks"][number]["priority"]
  >("all");

  const todayTasks = useMemo(() => tasks.filter((task) => task.isToday), [tasks]);

  const statusOptions = useMemo(() => {
    const counts = todayTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { value: "all" as const, label: `All statuses (${todayTasks.length})` },
      { value: "assigned" as const, label: `Assigned (${counts.assigned ?? 0})` },
      { value: "pending" as const, label: `Pending (${counts.pending ?? 0})` },
      { value: "completed" as const, label: `Completed (${counts.completed ?? 0})` },
    ];
  }, [todayTasks]);

  const priorityOptions = useMemo(() => {
    const counts = todayTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.priority] = (acc[task.priority] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { value: "all" as const, label: `All priorities (${todayTasks.length})` },
      { value: "high" as const, label: `High (${counts.high ?? 0})` },
      { value: "medium" as const, label: `Medium (${counts.medium ?? 0})` },
      { value: "low" as const, label: `Low (${counts.low ?? 0})` },
    ];
  }, [todayTasks]);

  const filteredTasks = useMemo(() => {
    return todayTasks
      .filter((task) => (statusFilter === "all" ? true : task.status === statusFilter))
      .filter((task) =>
        priorityFilter === "all" ? true : task.priority === priorityFilter
      );
  }, [todayTasks, statusFilter, priorityFilter]);
  const displayTasks = filteredTasks.slice(0, 10);

  const todayCount = todayTasks.length;
  const getPriorityClass = (priority: ProfilePayload["tasks"][number]["priority"]) => {
    if (priority === "high") {
      return "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-200";
    }
    if (priority === "medium") {
      return "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-200";
    }
    return "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200";
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Assigned tasks
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Today only - {todayCount} {plurality(todayCount)}.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            Status
            <div className="mt-2 flex h-10 w-44 items-center rounded-lg border border-gray-200 bg-white px-4 shadow-[0_2px_10px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as ProfilePayload["tasks"][number]["status"] | "all"
                  )
                }
                className="w-full bg-transparent pr-6 text-sm font-semibold text-gray-800 focus:outline-none dark:text-gray-200"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="flex flex-col text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            Priority
            <div className="mt-2 flex h-10 w-44 items-center rounded-lg border border-gray-200 bg-white px-4 shadow-[0_2px_10px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-gray-900/60">
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value as ProfilePayload["tasks"][number]["priority"] | "all"
                  )
                }
                className="w-full bg-transparent pr-6 text-sm font-semibold text-gray-800 focus:outline-none dark:text-gray-200"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {displayTasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tasks match the selected filters.</p>
        ) : (
          displayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/MyTask/${task.id}`)}
              className={`rounded-2xl border p-4 ${task.isToday ? "border-brand-200 bg-brand-50/40 dark:border-brand-500/40 dark:bg-brand-500/10" : "border-gray-100 dark:border-gray-800 dark:bg-gray-900/40"
                } cursor-pointer transition hover:border-brand-300 dark:hover:border-brand-500/60`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{task.assignedBy}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${task.status === "completed"
                      ? "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-200"
                      : task.status === "pending"
                        ? "bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-200"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {task.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                  Due {formatDate(task.dueDate)} at {task.dueTime}
                </span>
                {task.isToday && <span className="text-brand-500">Today</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { data } = useProfileData();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [requests, setRequests] = useState<ChangeRequest[]>([
    {
      id: "req-1",
      fieldKey: "phone",
      fieldLabel: "Phone",
      oldValue: "+09 363 398 46",
      newValue: "+09 555 111 22",
      reason: "Primary number retired; need to move to company device.",
      userId: "user-001",
      status: "Pending",
      submittedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      id: "req-2",
      fieldKey: "address",
      fieldLabel: "Address",
      oldValue: "54 Crown Road, Phoenix",
      newValue: "22 Northbridge Ave, Phoenix",
      reason: "Relocated to new apartment on Jan 5.",
      userId: "user-001",
      status: "Approved",
      submittedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    },
  ]);
  const [requestToast, setRequestToast] = useState<string | null>(null);

  useEffect(() => {
    if (!requestToast) return;
    const timer = setTimeout(() => setRequestToast(null), 3200);
    return () => clearTimeout(timer);
  }, [requestToast]);

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  if (!profile) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onSocialSave={({ social, bio }) =>
          setProfile((prev) => (prev ? { ...prev, social, bio } : prev))
        }
        onAvatarChange={(nextAvatar) =>
          setProfile((prev) => (prev ? { ...prev, avatar: nextAvatar } : prev))
        }
      />
      <ProfilePersonal
        profile={profile}
        onProfileUpdate={(next) => setProfile(next)}
        onSubmitRequest={(req) => {
          setRequests((prev) => [req, ...prev]);
          setRequestToast(`${req.fieldLabel} request submitted.`);
        }}
      />
      <ProfileRequests requests={requests} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileTasks tasks={profile.tasks} />
        <ProfileReviews reviews={profile.reviews} />
      </div>
      <ProfileFeedback feedback={profile.feedback} />
      {requestToast && (
        <div className="pointer-events-none fixed inset-0 z-[100000] flex justify-end items-start px-4 pt-6">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-brand-200 bg-white/95 px-4 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-brand-400/30 backdrop-blur dark:border-brand-800 dark:bg-gray-900/90 dark:text-brand-200"
          >
            {requestToast}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
