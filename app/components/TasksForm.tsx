"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: {
    _id: string;
    title: string;
    description?: string;
    priority: string;
    category: string;
    completed: boolean;
    dueDate?: string;
  };
}

export default function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [category, setCategory] = useState(task?.category || "work");
  const [completed, setCompleted] = useState(task?.completed || false);
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        mode === "create" ? "/api/tasks" : `/api/tasks/${task?._id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          completed,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save task");

      router.push("/tasks");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 mx-auto min-w-md"
    >
      <h1 className="text-xl font-semibold">
        {mode === "create" ? "Create Task" : "Edit Task"}
      </h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          rows={4}
        />
      </div>

      {/* Priority + Category */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Completed (edit mode only) */}
      {mode === "edit" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label>Mark as completed</label>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary-dark-hover)] disabled:opacity-50 hover:cursor-pointer transition-all"
      >
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Task"
          : "Save Changes"}
      </button>
    </form>
  );
}
