import { NextRequest, NextResponse } from "next/server";

// Add badge
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, label, reason } = body;

  if (!userId || !label || !reason) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const badge = {
    id: `badge-${Date.now()}`,
    label,
    addedBy: "Admin User", // Get from session
    addedAt: new Date().toISOString(),
    reason,
  };

  // Save badge to database
  // Create audit log entry

  return NextResponse.json({
    success: true,
    badge,
  });
}

// Remove badge
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const badgeId = searchParams.get("badgeId");
  const reason = searchParams.get("reason");

  if (!badgeId || !reason) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Delete badge from database
  // Create audit log entry

  return NextResponse.json({
    success: true,
    message: "Badge removed successfully",
  });
}
