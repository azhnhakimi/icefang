"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CalendarFormProps {
  mode: "create" | "edit";
  event?: {
    _id: string;
    name: string;
    description?: string;
    date: string;
    startTime: string;
    endTime?: string;
    location?: string;
    category: string;
  };
}

export default function CalendarForm({ mode, event }: CalendarFormProps) {
  const router = useRouter();

  const [name, setName] = useState(event?.name || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || "");
  const [startTime, setStartTime] = useState(event?.startTime || "");
  const [endTime, setEndTime] = useState(event?.endTime || "");
  const [location, setLocation] = useState(event?.location || "");
  const [category, setCategory] = useState(event?.category || "work");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        mode === "create" ? "/api/calendar" : `/api/calendar/${event?._id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          date: date ? new Date(date).toISOString() : null,
          startTime,
          endTime,
          location,
          category,
        }),
      });

      if (!res.ok) throw new Error("Failed to save event");

      router.push("/calendar");
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
      className="space-y-12 bg-white p-6 rounded-xl border border-gray-200 min-w-md w-4xl flex flex-col"
    >
      <h1 className="text-xl font-semibold">
        {mode === "create" ? "Create Event" : "Edit Event"}
      </h1>

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg flex-1 resize-none"
              rows={4}
            />
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Event Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Event End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="">
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
      </div>

      <div className="flex justify-end items-center gap-2">
        <button
          disabled={loading}
          type="button"
          className="w-fit py-2 px-6 self-end bg-gray-50 text-black border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer transition-all"
        >
          <Link href={"/calendar"}>cancel</Link>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-fit py-2 px-6 self-end bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary-dark-hover)] disabled:opacity-50 hover:cursor-pointer transition-all"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Event"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
