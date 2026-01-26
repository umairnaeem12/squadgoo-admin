"use client";
import React, { useState, useEffect } from "react";
import type { Ticket, WalletCase, KYCCase, Task } from "@/types/admin-system";

export default function QueuesPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "chat-reports" | "kyc" | "wallet">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kycCases, setKycCases] = useState<KYCCase[]>([]);
  const [walletCases, setWalletCases] = useState<WalletCase[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTickets(JSON.parse(localStorage.getItem("tickets") || "[]"));
    setTasks(JSON.parse(localStorage.getItem("tasks") || "[]"));
    setKycCases(JSON.parse(localStorage.getItem("kycCases") || "[]"));
    setWalletCases(JSON.parse(localStorage.getItem("walletCases") || "[]"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Operational Queues
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor all operational queues with full access
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "tickets"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("chat-reports")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "chat-reports"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Chat Reports ({tasks.filter((t) => t.type === "chat_report").length})
        </button>
        <button
          onClick={() => setActiveTab("kyc")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "kyc"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          KYC ({kycCases.length})
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "wallet"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Wallet ({walletCases.length})
        </button>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        {activeTab === "tickets" && (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {ticket.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>Status: {ticket.status}</span>
                      <span>Priority: {ticket.priority}</span>
                      {ticket.assignedTo && <span>Assigned</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-center text-gray-500">No tickets found</p>
            )}
          </div>
        )}

        {activeTab === "chat-reports" && (
          <div className="space-y-3">
            {tasks
              .filter((t) => t.type === "chat_report")
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {task.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span>Priority: {task.priority}</span>
                    <span>Status: {task.status}</span>
                    {task.assignedToName && (
                      <span>Assigned to: {task.assignedToName}</span>
                    )}
                  </div>
                </div>
              ))}
            {tasks.filter((t) => t.type === "chat_report").length === 0 && (
              <p className="text-center text-gray-500">No chat reports found</p>
            )}
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="space-y-3">
            {kycCases.map((kycCase) => (
              <div
                key={kycCase.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {kycCase.userName}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>Status: {kycCase.status}</span>
                      <span>{kycCase.documents.length} documents</span>
                      {kycCase.assignedTo && <span>Assigned</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {kycCases.length === 0 && (
              <p className="text-center text-gray-500">No KYC cases found</p>
            )}
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-3">
            {walletCases.map((walletCase) => (
              <div
                key={walletCase.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {walletCase.userName} - ${walletCase.amount}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {walletCase.issueType.replace("_", " ")}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>Status: {walletCase.status}</span>
                      <span>Priority: {walletCase.priority}</span>
                      {walletCase.assignedTo && <span>Assigned</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {walletCases.length === 0 && (
              <p className="text-center text-gray-500">No wallet cases found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
