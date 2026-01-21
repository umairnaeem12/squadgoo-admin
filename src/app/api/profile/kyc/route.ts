import { NextRequest, NextResponse } from "next/server";

// KYC approval
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { submissionId, action, reason, requiredDocs } = body;

  if (!submissionId || !action) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate action
  if (!["approve", "reject", "need-more-info"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  // Require reason for reject and need-more-info
  if ((action === "reject" || action === "need-more-info") && !reason) {
    return NextResponse.json(
      { error: "Reason is required for this action" },
      { status: 400 }
    );
  }

  // Update KYC submission status in database
  // Create audit log entry
  // Send notification to user if needed

  const result = {
    success: true,
    message: `KYC submission ${action}d successfully`,
    submission: {
      id: submissionId,
      status: action === "approve" ? "verified" : action === "reject" ? "rejected" : "pending",
      reviewedBy: "Admin User", // Get from session
      reviewedAt: new Date().toISOString(),
      reason: reason || undefined,
      additionalDocsRequested: requiredDocs || undefined,
    },
  };

  return NextResponse.json(result);
}

// Get KYC submission details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Fetch KYC submission from database
  const mockSubmission = {
    id: `kyc-${userId}`,
    submittedAt: new Date().toISOString(),
    status: "pending",
    idType: "National ID",
    idNumber: "****5678",
    documents: [],
    attempts: [
      {
        attemptNumber: 1,
        submittedAt: new Date().toISOString(),
        status: "pending",
      },
    ],
  };

  return NextResponse.json(mockSubmission);
}
