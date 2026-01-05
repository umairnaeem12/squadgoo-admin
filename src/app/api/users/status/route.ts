import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { userId, status } = body;

  // Mock status update
  console.log("Updating user status:", userId, status);

  return NextResponse.json({
    success: true,
    message: `User status updated to ${status}`,
    data: { userId, status },
  });
}
