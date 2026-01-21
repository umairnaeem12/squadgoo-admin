import { NextRequest, NextResponse } from "next/server";

// Add staff note
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, content, category, isPrivate } = body;

  if (!userId || !content || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const note = {
    id: `note-${Date.now()}`,
    content,
    category,
    author: "Admin User", // Get from session
    authorId: "admin-1",
    createdAt: new Date().toISOString(),
    isPrivate: isPrivate || false,
  };

  // Save note to database

  return NextResponse.json({
    success: true,
    note,
  });
}

// Get staff notes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Fetch notes from database
  const mockNotes: any[] = [];

  return NextResponse.json({
    notes: mockNotes,
  });
}
