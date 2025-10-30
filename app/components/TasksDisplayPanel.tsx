"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  Calendar,
  Circle,
  CheckCircle,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: string;
  category: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const PriorityColorMap: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const CategoryColorMap: Record<string, string> = {
  personal: "#7e22ce",
  work: "#2563eb",
  fitness: "#ea580c",
};

const PanelItem = ({
  task,
  onDelete,
  onToggleComplete,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}) => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/tasks/${task._id}/edit`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      onDelete(task._id);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting the task");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    try {
      onToggleComplete(task._id, !task.completed);
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error("Failed to update completion status");
    } catch (err) {
      console.error(err);
      alert("Something went wrong updating task");
      onToggleComplete(task._id, task.completed);
    }
  };

  const priorityColor =
    PriorityColorMap[task.priority] || "bg-gray-100 text-gray-700";
  const categoryColor = CategoryColorMap[task.category] || "#9ca3af";

  return (
    <>
      <div
        className={`flex justify-stretch items-stretch py-4 px-6 gap-8 ${
          !task.completed ? "bg-white" : "bg-gray-200"
        }`}
      >
        <div className="flex items-center">
          {task.completed ? (
            <CheckCircle
              size={22}
              className="text-green-600 cursor-pointer hover:scale-110 transition-transform"
              onClick={handleToggle}
            />
          ) : (
            <Circle
              size={22}
              className="text-gray-400 cursor-pointer hover:text-green-500 hover:scale-110 transition-transform"
              onClick={handleToggle}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <p
            className={`font-semibold ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </p>
          <p className="text-sm text-gray-500">{task.description}</p>

          <div className="flex justify-start items-center gap-4 text-xs">
            <div className="flex justify-start items-center gap-1">
              <Calendar size={14} className="text-[var(--primary-dark)]" />
              <p className="text-[var(--primary-dark)] font-semibold">
                {task.dueDate
                  ? new Date(task.dueDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : "No due date"}
              </p>
            </div>

            <p
              className={`px-3 py-1 rounded-lg font-medium capitalize ${priorityColor}`}
            >
              {task.priority}
            </p>

            <div className="flex justify-start items-center gap-1">
              <Circle
                size={10}
                style={{ color: categoryColor, fill: categoryColor }}
              />
              <p className="capitalize">{task.category}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleEdit}
            className="hover:cursor-pointer hover:text-[#3b82f6] text-gray-500 transition-all"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="hover:cursor-pointer hover:text-[#dc2626] text-gray-500 transition-all"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowConfirmModal(false)}
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Delete Task
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <b>{task.title}</b>? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 hover:cursor-pointer transition-all"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TasksDisplayPanel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, completed } : task))
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const categoryMatch =
      categoryFilter === "all" || task.category === categoryFilter;
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "ongoing" && !task.completed);
    return categoryMatch && statusMatch;
  });

  if (loading) {
    return <p className="text-sm text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>

        <div className="flex gap-2">
          {["all", "completed", "ongoing"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition ${
                statusFilter === status
                  ? "bg-[var(--primary-dark)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <PanelItem
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No matching tasks found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TasksDisplayPanel;
