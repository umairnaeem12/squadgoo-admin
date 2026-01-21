"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Smile } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface Message {
  id: string;
  sender: "admin" | "user";
  content: string;
  timestamp: Date;
  read: boolean;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      content: "Hi, I need help with my profile verification.",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "2",
      sender: "admin",
      content: "Hello! I'd be happy to help you with that. What specific issue are you facing?",
      timestamp: new Date(Date.now() - 3500000),
      read: true,
    },
    {
      id: "3",
      sender: "user",
      content: "My documents were rejected but I'm not sure why.",
      timestamp: new Date(Date.now() - 3400000),
      read: true,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "admin",
      content: message,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // TODO: Send message to backend
    console.log("Sending message to", userId, ":", message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {userName || "User"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.sender === "admin"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`mt-1 text-xs ${
                    msg.sender === "admin"
                      ? "text-purple-200"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3">
            {/* Attachment Buttons */}
            <div className="flex gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="Attach image"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="h-10 bg-purple-600 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600 dark:text-gray-300">Loading chat…</div>}>
      <ChatContent />
    </Suspense>
  );
}
