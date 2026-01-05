import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId } = body;

  // Mock block action
  console.log("Blocking user:", userId);

  // In production, you would:
  // 1. Update user status to inactive/blocked
  // 2. Send notification to user
  // 3. Revoke active sessions

  return NextResponse.json({
    success: true,
    message: "User blocked successfully. Notification sent to withdraw coins.",
    data: { userId, status: "inactive" },
  });
}
