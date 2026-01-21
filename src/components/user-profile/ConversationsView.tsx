"use client";

import React, { useState } from "react";
import { MessageSquare, AlertTriangle, Search, User, Clock } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  participantNames: string[];
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  isReported?: boolean;
  reportReason?: string;
  messages: Message[];
}

interface ConversationsViewProps {
  conversations: Conversation[];
  currentUserId: string;
  isAdminView?: boolean;
}

export default function ConversationsView({
  conversations,
  currentUserId,
  isAdminView = false,
}: ConversationsViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportedOnly, setShowReportedOnly] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: 'resolve' | 'action', conversationId: string } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionType, setActionType] = useState<'warn' | 'suspend' | 'block'>('warn');

  const handleResolveIssue = (conversationId: string) => {
    // TODO: Implement API call to resolve reported chat
    console.log('Resolving issue for conversation:', conversationId);
    alert('Issue resolved successfully! This chat has been marked as resolved.');
    // Update conversation status
    if (selectedConversation) {
      setSelectedConversation({
        ...selectedConversation,
        isReported: false,
      });
    }
    setActionModal(null);
    setActionReason('');
  };

  const handleTakeAction = (conversationId: string, action: string, reason: string) => {
    // TODO: Implement API call to take action on reported user
    console.log('Taking action:', { conversationId, action, reason });
    alert(`Action taken: ${action}\nReason: ${reason}\n\nThe user will be notified and appropriate measures have been applied.`);
    setActionModal(null);
    setActionReason('');
    setActionType('warn');
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.participantNames.some((name) => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReportFilter = showReportedOnly ? conv.isReported : true;

    return matchesSearch && matchesReportFilter;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="rounded-xl bg-white shadow dark:bg-gray-800">
      <div className="grid h-[600px] grid-cols-1 lg:grid-cols-3">
        {/* Left Sidebar: Chat List */}
        <div className="flex flex-col border-r border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Conversations</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredConversations.length} conversation(s)
            </p>

            {/* Search */}
            <div className="mt-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full"
              />
            </div>

            {/* Filter Reported */}
            {isAdminView && (
              <button
                onClick={() => setShowReportedOnly(!showReportedOnly)}
                className={`mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  showReportedOnly
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                {showReportedOnly ? "Showing Reported Only" : "Show Reported Chats"}
              </button>
            )}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedConversation?.id === conv.id
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-bold text-white">
                        {conv.participantNames[0]?.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        {/* Participant Names */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-medium text-gray-900 dark:text-white">
                            {conv.participantNames.join(", ")}
                          </p>
                          {conv.unreadCount && conv.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>

                        {/* Last Message */}
                        <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                          {conv.lastMessage}
                        </p>

                        {/* Time and Report Badge */}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                          {conv.isReported && (
                            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                              <AlertTriangle className="h-3 w-3" />
                              Reported
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation View */}
        <div className="flex flex-col lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.participantNames.join(", ")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedConversation.messages.length} message(s)
                    </p>
                  </div>
                  {selectedConversation.isReported && (
                    <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-semibold">Reported Chat</p>
                          <p className="text-xs">{selectedConversation.reportReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.isCurrentUser ? "order-2" : "order-1"
                        }`}
                      >
                        {/* Sender Name */}
                        <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {message.senderName}
                        </p>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isCurrentUser
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>

                        {/* Timestamp */}
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions (if reported) */}
              {isAdminView && selectedConversation.isReported && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setActionModal({ type: 'resolve', conversationId: selectedConversation.id })}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Resolve Issue
                    </Button>
                    <Button 
                      onClick={() => setActionModal({ type: 'action', conversationId: selectedConversation.id })}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Take Action
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Select a conversation to view messages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Issue Modal */}
      {actionModal?.type === 'resolve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActionModal(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Resolve Reported Chat</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to mark this reported conversation as resolved? This will remove the report flag.
            </p>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Resolution Notes (Optional)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Add any notes about how this was resolved..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleResolveIssue(actionModal.conversationId)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirm Resolve
              </Button>
              <Button
                onClick={() => setActionModal(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Take Action Modal */}
      {actionModal?.type === 'action' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setActionModal(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Take Action on Reported User</h3>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="warn">Send Warning</option>
                <option value="suspend">Suspend Account (7 days)</option>
                <option value="block">Block Account Permanently</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reason (Required)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Explain why this action is being taken..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={4}
                required
              />
            </div>

            <div className="mb-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ This action will be logged in the audit trail and the user will be notified via email.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleTakeAction(actionModal.conversationId, actionType, actionReason)}
                disabled={!actionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Action
              </Button>
              <Button
                onClick={() => {
                  setActionModal(null);
                  setActionReason('');
                  setActionType('warn');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
