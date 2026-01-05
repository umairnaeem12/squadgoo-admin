import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage, ChatSession } from "@/types/user-management";

// GET: Fetch chat sessions
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (userId) {
    // Fetch messages for specific chat session
    const mockMessages: ChatMessage[] = [
      {
        id: "msg-1",
        senderId: "admin",
        receiverId: userId,
        message: "Hello, how can I help you today?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: "msg-2",
        senderId: userId,
        receiverId: "admin",
        message: "I have a question about my account status.",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true,
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockMessages,
    });
  }

  // Fetch all chat sessions
  const mockSessions: ChatSession[] = [
    {
      id: "session-1",
      userId: "JS-1001",
      userName: "Ayesha Khan",
      userAvatar: undefined,
      lastMessage: "Thank you for your help!",
      lastMessageTime: new Date(Date.now() - 600000).toISOString(),
      unreadCount: 2,
      status: "online",
    },
    {
      id: "session-2",
      userId: "REC-2001",
      userName: "John Doe",
      userAvatar: undefined,
      lastMessage: "Can you verify my company details?",
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0,
      status: "offline",
    },
  ];

  return NextResponse.json({
    success: true,
    data: mockSessions,
  });
}

// POST: Send a message
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { senderId, receiverId, message, attachments } = body;

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId,
    receiverId,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    attachments,
  };

  // In production:
  // 1. Save message to database
  // 2. Send real-time notification via WebSocket/Socket.io
  // 3. Send push notification if user is offline

  return NextResponse.json({
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
}

// PATCH: Mark messages as read
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { messageIds } = body;

  return NextResponse.json({
    success: true,
    message: "Messages marked as read",
    data: { messageIds },
  });
}
