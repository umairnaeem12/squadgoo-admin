"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Mail, Phone, AlertCircle, Edit, ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { ProfileHeader as ProfileHeaderType, BadgeEntry } from "@/types/admin-profile";
import Button from "@/components/ui/button/Button";

interface ProfileHeaderProps {
  header: ProfileHeaderType;
  onBack?: () => void;
  onStartChat?: () => void;
  onOpenNotes?: () => void;
  onEdit?: () => void;
  isAdminView?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    suspended: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const VerificationBadge = ({ status }: { status: string }) => {
  const colors = {
    verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    submitted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    incomplete: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Badge = ({ badge }: { badge: BadgeEntry }) => {
  return (
    <span
      className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      title={`Added by ${badge.addedBy} - ${badge.reason}`}
    >
      {badge.label}
    </span>
  );
};

export default function ProfileHeader({
  header,
  onBack,
  onStartChat,
  onOpenNotes,
  onEdit,
  isAdminView = false,
}: ProfileHeaderProps) {
  const { identity, location, accountStatus, verificationStatus, rating, reviewCount, profileCompleteness, badges } = header;
  
  // Use dummy image if no profile picture exists
  const [profilePic, setProfilePic] = useState(identity.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(identity.name) + '&size=200&background=a855f7&color=fff');
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePicUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
      
      // TODO: Implement actual upload to server
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/profile/upload-picture', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setProfilePic(data.url);
      
      console.log('Profile picture uploaded:', file.name);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white shadow-lg">
      {/* Action buttons row */}
      {isAdminView && (
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {onOpenNotes && (
              <Button
                onClick={onOpenNotes}
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <FileText className="mr-2 h-4 w-4" />
                Internal Notes
              </Button>
            )}
            {onStartChat && (
              <Button
                onClick={onStartChat}
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Profile header content */}
      <div className="flex items-start gap-6">
        {/* Profile picture */}
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
            {profilePic ? (
              <Image
                src={profilePic}
                alt={identity.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized={profilePic.startsWith('blob:')}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-3xl font-bold">
                {identity.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          {/* Edit overlay - shows on hover */}
          {isAdminView && !isUploading && (
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert('File size must be less than 5MB');
                      return;
                    }
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                      alert('Please select an image file');
                      return;
                    }
                    handleProfilePicUpload(file);
                  }
                };
                input.click();
              }}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Click to upload new profile picture"
            >
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
          {/* Profile completeness indicator */}
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-xs font-bold text-purple-600">
            {profileCompleteness}%
          </div>
        </div>

        {/* Profile info */}
        <div className="flex-1">
          {/* Name and ID */}
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{identity.name}</h1>
              <p className="text-sm text-white/80">#{identity.uniqueId}</p>
            </div>
          </div>

          {/* Role and Rating */}
          <div className="mb-3 flex items-center gap-4">
            <span className="text-lg font-medium">{identity.role}</span>
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {rating.toFixed(1)} {reviewCount && `(${reviewCount} reviews)`}
                </span>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 opacity-80" />
              <span>{identity.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 opacity-80" />
              <span>{identity.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 opacity-80" />
              <span>Profile Status: {accountStatus}</span>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={accountStatus} />
            <VerificationBadge status={verificationStatus} />
            {badges.map((badge, index) => (
              <Badge key={badge.id || index} badge={badge} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
