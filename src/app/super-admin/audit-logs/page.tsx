"use client";
import React, { useState, useEffect } from "react";
import type { AuditLogEntry } from "@/types/admin-system";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "user" | "permission" | "task" | "system">("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const allLogs: AuditLogEntry[] = JSON.parse(
      localStorage.getItem("auditLogs") || "[]"
    );
    setLogs(allLogs);
  };

  const filteredLogs = logs.filter((log) =>
    filter === "all" ? true : log.category === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track all system activity and changes
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "user", "permission", "task", "system"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === cat
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {log.action}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {log.details}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                      {log.category}
                    </span>
                    <span>By: {log.performedByName}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No audit logs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
