"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, ArrowLeft, User } from "lucide-react";
import type { ChatMessage, ChatSession } from "@/types/user-management";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export default function ChatInterface({
  isOpen,
  onClose,
  userId,
  userName,
  userAvatar,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchMessages();
    }
  }, [isOpen, userId]);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: "admin",
      receiverId: userId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "admin",
          receiverId: userId,
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? data.data : msg))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl h-[600px] rounded-lg bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {userName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hidden lg:block text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 dark:text-gray-600">
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 dark:text-gray-600 mb-2">
                  No messages yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Start the conversation by sending a message
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.senderId === "admin";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2.5 ${
                      isAdmin
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isAdmin
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="border-t border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
