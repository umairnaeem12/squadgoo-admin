"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { Send, Paperclip, ArrowLeft, User, X, Phone, Video, MoreVertical, Smile, Image as ImageIcon } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
  read: boolean;
  senderName: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId") || "";
  const userName = searchParams.get("userName") || "User";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      fetchMessages();
      // Simulate user typing after 2 seconds
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "admin",
      recipientId: userId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      senderName: "Admin",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: userId,
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update with actual message from server
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? data.data : msg))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userName}
                </h2>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-purple-600 animate-ping"></div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation with {userName}!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isAdmin = msg.senderId === "admin";
                const showDate =
                  index === 0 ||
                  new Date(messages[index - 1].timestamp).toDateString() !==
                    new Date(msg.timestamp).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {new Date(msg.timestamp).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex items-end gap-2 ${
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div
                        className={`group relative max-w-[70%] ${
                          isAdmin ? "order-1" : ""
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isAdmin
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {msg.message}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isAdmin && (
                            <span className="text-blue-500">
                              {msg.read ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            A
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-5 py-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 border border-transparent focus:border-blue-500"
                style={{ minHeight: "44px" }}
              />
              <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-purple-600 animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
