import { NextRequest, NextResponse } from "next/server";

// Assign case
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, action, targetStaffId, reason } = body;

  if (!userId || !action || !reason) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate action
  if (!["assign-to-me", "assign-to-staff", "transfer"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  if ((action === "assign-to-staff" || action === "transfer") && !targetStaffId) {
    return NextResponse.json(
      { error: "Target staff ID is required for this action" },
      { status: 400 }
    );
  }

  const currentStaffId = "admin-1"; // Get from session
  const currentStaffName = "Admin User"; // Get from session

  // Create or update assignment in database
  // Create audit log entry

  const assignment = {
    caseId: `case-${userId}`,
    owner: action === "assign-to-me" ? currentStaffName : "Target Staff",
    ownerId: action === "assign-to-me" ? currentStaffId : targetStaffId,
    assignedAt: new Date().toISOString(),
    department: "Customer Service",
    status: "in-progress",
    history: [],
  };

  return NextResponse.json({
    success: true,
    assignment,
  });
}

// Get assignment details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Fetch assignment from database
  const mockAssignment = null; // No assignment yet

  return NextResponse.json({
    assignment: mockAssignment,
  });
}
