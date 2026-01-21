"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComprehensiveProfilePage from "@/components/user-profile/ComprehensiveProfilePage";
import { AdminProfile } from "@/types/admin-profile";

export default function ProfilePage() {
  const params = useParams();
  const userType = params.userType as string;
  const userId = params.userId as string;

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userType}/${userId}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userType, userId]);

  // Mock available staff for assignment
  const availableStaff = [
    { id: "staff-1", name: "Sarah Johnson", department: "Customer Service" },
    { id: "staff-2", name: "Mike Chen", department: "KYC Verification" },
    { id: "staff-3", name: "Emily Davis", department: "Wallet Support" },
  ];

  const currentStaffId = "admin-1"; // This would come from session/auth

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The requested profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ComprehensiveProfilePage
      profile={profile}
      currentStaffId={currentStaffId}
      availableStaff={availableStaff}
      onProfileUpdate={(updates) => {
        // Handle profile updates
        console.log("Profile updates:", updates);
      }}
    />
  );
}
