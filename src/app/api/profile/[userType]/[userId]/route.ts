import { NextRequest, NextResponse } from "next/server";
import { generateMockProfile } from "@/data/mockProfileData";
import { ProfileType } from "@/types/admin-profile";

// Mock data - replace with actual database queries
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userType: string; userId: string }> }
) {
  const { userType, userId } = await params;

  // Validate user type
  if (!["jobseeker", "recruiter", "staff"].includes(userType)) {
    return NextResponse.json(
      { error: "Invalid user type" },
      { status: 400 }
    );
  }

  // Generate mock profile data - replace with database query
  const mockProfile = generateMockProfile(userType as ProfileType, userId);

  return NextResponse.json(mockProfile);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userType: string; userId: string }> }
) {
  const { userType, userId } = await params;
  const body = await request.json();

  // Validate and process the update
  // This is where you would update the database

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully",
  });
}
