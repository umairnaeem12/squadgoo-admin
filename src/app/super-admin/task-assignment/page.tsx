"use client";
import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type {
  AdminUser,
  Task,
  TaskType,
  TaskPriority,
  TaskHistoryEntry,
} from "@/types/admin-system";

export default function TaskAssignmentPage() {
  const { currentAdmin } = useAdminAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<AdminUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const allStaff: AdminUser[] = JSON.parse(
      localStorage.getItem("adminUsers") || "[]"
    ).filter((u: AdminUser) => u.role !== "super_admin");

    setTasks(allTasks);
    setStaff(allStaff);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "assigned") return task.assignedTo !== null;
    if (filter === "unassigned") return task.assignedTo === null;
    return true;
  });

  const handleCreateTask = (task: Task) => {
    const allTasks = [...tasks, task];
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    setTasks(allTasks);
    setShowCreateModal(false);
  };

  const handleAssignTask = (taskId: string, staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const history: TaskHistoryEntry = {
          id: `hist-${Date.now()}`,
          action: "assigned",
          performedBy: currentAdmin!.id,
          performedByName: currentAdmin!.name,
          details: `Assigned to ${staffMember.name}`,
          timestamp: new Date().toISOString(),
        };
        return {
          ...task,
          assignedTo: staffId,
          assignedToName: staffMember.name,
          status: "in_progress" as const,
          updatedAt: new Date().toISOString(),
          history: [...task.history, history],
        };
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleTransferTask = (taskId: string, newStaffId: string) => {
    const staffMember = staff.find((s) => s.id === newStaffId);
    if (!staffMember) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const history: TaskHistoryEntry = {
          id: `hist-${Date.now()}`,
          action: "transferred",
          performedBy: currentAdmin!.id,
          performedByName: currentAdmin!.name,
          details: `Transferred to ${staffMember.name}`,
          timestamp: new Date().toISOString(),
        };
        return {
          ...task,
          assignedTo: newStaffId,
          assignedToName: staffMember.name,
          updatedAt: new Date().toISOString(),
          history: [...task.history, history],
        };
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleUnassign = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const history: TaskHistoryEntry = {
          id: `hist-${Date.now()}`,
          action: "transferred",
          performedBy: currentAdmin!.id,
          performedByName: currentAdmin!.name,
          details: "Unassigned from staff",
          timestamp: new Date().toISOString(),
        };
        return {
          ...task,
          assignedTo: null,
          assignedToName: null,
          status: "open" as const,
          updatedAt: new Date().toISOString(),
          history: [...task.history, history],
        };
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Assignment
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and assign tasks across your team
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600"
        >
          ➕ Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Staff Directory */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Staff Directory
          </h2>
          <div className="space-y-2">
            {staff.map((member) => {
              const assignedCount = tasks.filter(
                (t) => t.assignedTo === member.id
              ).length;
              return (
                <div
                  key={member.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {member.role} • {assignedCount} task{assignedCount !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Pool */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "all"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("unassigned")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "unassigned"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Unassigned ({tasks.filter((t) => !t.assignedTo).length})
            </button>
            <button
              onClick={() => setFilter("assigned")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "assigned"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Assigned ({tasks.filter((t) => t.assignedTo).length})
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                staff={staff}
                onAssign={handleAssignTask}
                onTransfer={handleTransferTask}
                onUnassign={handleUnassign}
                onViewDetails={() => setSelectedTask(task)}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onSave={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
          currentAdminId={currentAdmin!.id}
          currentAdminName={currentAdmin!.name}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

function TaskCard({
  task,
  staff,
  onAssign,
  onTransfer,
  onUnassign,
  onViewDetails,
}: {
  task: Task;
  staff: AdminUser[];
  onAssign: (taskId: string, staffId: string) => void;
  onTransfer: (taskId: string, staffId: string) => void;
  onUnassign: (taskId: string) => void;
  onViewDetails: () => void;
}) {
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const priorityColors = {
    low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const typeIcons = {
    ticket: "🎫",
    chat_report: "💬",
    kyc: "🆔",
    wallet: "💰",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeIcons[task.type]}</span>
            <span className="text-xs font-semibold uppercase text-gray-500">
              {task.type.replace("_", " ")}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
          <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {task.summary}
          </p>
          {task.assignedToName && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Assigned to: <span className="font-medium">{task.assignedToName}</span>
            </div>
          )}
        </div>
        <div className="relative ml-4 flex gap-2">
          <button
            onClick={onViewDetails}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Details
          </button>
          <div>
            <button
              onClick={() => setShowAssignMenu(!showAssignMenu)}
              className="rounded-lg bg-brand-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              {task.assignedTo ? "Reassign" : "Assign"}
            </button>
            {showAssignMenu && (
              <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="max-h-48 overflow-y-auto p-2">
                  {task.assignedTo && (
                    <button
                      onClick={() => {
                        onUnassign(task.id);
                        setShowAssignMenu(false);
                      }}
                      className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Unassign
                    </button>
                  )}
                  {staff.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        if (task.assignedTo) {
                          onTransfer(task.id, member.id);
                        } else {
                          onAssign(task.id, member.id);
                        }
                        setShowAssignMenu(false);
                      }}
                      className="w-full rounded px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                    >
                      {member.name}
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTaskModal({
  onSave,
  onClose,
  currentAdminId,
  currentAdminName,
}: {
  onSave: (task: Task) => void;
  onClose: () => void;
  currentAdminId: string;
  currentAdminName: string;
}) {
  const [formData, setFormData] = useState({
    type: "ticket" as TaskType,
    title: "",
    summary: "",
    priority: "medium" as TaskPriority,
    relatedUserId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: `task-${Date.now()}`,
      ...formData,
      relatedUserId: formData.relatedUserId || null,
      status: "open",
      assignedTo: null,
      assignedToName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: `hist-${Date.now()}`,
          action: "created",
          performedBy: currentAdminId,
          performedByName: currentAdminName,
          details: "Task created",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    onSave(task);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Create New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as TaskType })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ticket">Ticket</option>
              <option value="chat_report">Chat Report</option>
              <option value="kyc">KYC Case</option>
              <option value="wallet">Wallet Item</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Summary
            </label>
            <textarea
              required
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as TaskPriority,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskDetailModal({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Task Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {task.summary}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Type
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {task.type.replace("_", " ")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Priority
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {task.priority}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Status
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {task.status.replace("_", " ")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Assigned To
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {task.assignedToName || "Unassigned"}
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
              History
            </h4>
            <div className="space-y-2">
              {task.history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.action.replace("_", " ")} by {entry.performedByName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {entry.details}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
