"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComprehensiveProfilePage from "@/components/user-profile/ComprehensiveProfilePage";
import { AdminProfile } from "@/types/admin-profile";
import { generateMockProfile } from "@/data/mockProfileData";

export default function ProfilePage() {
  const params = useParams();
  const userType = params.userType as "jobseeker" | "recruiter" | "staff";
  const userId = params.userId as string;

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        // For now, use mock data (replace with actual API call later)
        const mockProfile = generateMockProfile(userType, userId);
        setProfile(mockProfile);
        
        // Uncomment this when API is ready:
        // const response = await fetch(`/api/profile/${userType}/${userId}`);
        // const data = await response.json();
        // setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userType, userId]);

  // Mock available staff for assignment (replace with actual data from API/database)
  const availableStaff = [
    { id: "staff-1", name: "Sarah Johnson", department: "Customer Service" },
    { id: "staff-2", name: "Mike Chen", department: "KYC Verification" },
    { id: "staff-3", name: "Emily Davis", department: "Wallet Support" },
    { id: "staff-4", name: "John Smith", department: "Compliance" },
    { id: "staff-5", name: "Lisa Anderson", department: "Technical Support" },
  ];

  const currentStaffId = "admin-1"; // This would come from session/auth context

  const handleProfileUpdate = (updates: Partial<AdminProfile>) => {
    console.log("Profile updates:", updates);
    // Implement API call to update profile
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The profile you're looking for doesn't exist or has been removed.
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
      onProfileUpdate={handleProfileUpdate}
    />
  );
}
