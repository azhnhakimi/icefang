"use client";

import { cn } from "@/lib/utils";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { JSX, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Pencil,
  Trash,
  X,
  Circle,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

type CalendarEvent = {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category: string;
};

type CalendarProps = {
  events?: CalendarEvent[];
  currentDate: Date;
};

export function formatTime(time24: string): string {
  try {
    const date = parse(time24, "HH:mm", new Date());
    return format(date, "hh:mm a");
  } catch {
    return time24;
  }
}

const ICON_SIZE = 14;

const CategoryColorMap: Record<string, string> = {
  personal: "#9333ea",
  work: "#ea580c",
  fitness: "#059669",
};

const IcefangCalendarMonthView = ({ events, currentDate }: CalendarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  const router = useRouter();
  const [eventsList, setEventsList] = useState<CalendarEvent[]>(events || []);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (events) setEventsList(events);
  }, [events]);

  const handleEdit = (id: string) => {
    router.push(`/calendar/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEventsList((prev) => prev.filter((event) => event._id !== id));
      setActiveModalId(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting the event");
    } finally {
      setDeleting(false);
    }
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = eventsList.filter(
        (event) =>
          format(new Date(event.date), "yyyy-MM-dd") ===
          format(cloneDay, "yyyy-MM-dd")
      );

      const maxVisible = 3;
      const visibleEvents = dayEvents.slice(0, maxVisible);
      const hiddenCount = dayEvents.length - visibleEvents.length;

      days.push(
        <div
          key={cloneDay.toString()}
          className={cn(
            "aspect-square min-h-[100px] border p-2 transition-colors overflow-hidden relative",
            !isSameMonth(cloneDay, monthStart)
              ? "bg-gray-50 text-gray-400"
              : "bg-white text-black",
            isSameDay(cloneDay, today)
              ? "border-[var(--primary-dark)] bg-[var(--primary-light)] text-[var(--primary-dark)]"
              : ""
          )}
        >
          <div className="text-sm font-medium mb-1">
            {format(cloneDay, "d")}
          </div>

          <div className="space-y-1">
            {visibleEvents.map((event, idx) => (
              <Popover.Root key={idx}>
                <Popover.Trigger asChild>
                  <div
                    className={cn(
                      "cursor-pointer truncate rounded p-1 text-xs text-white hover:opacity-90 transition-all",
                      {
                        "bg-orange-600":
                          event.category?.toLowerCase() === "work",
                        "bg-emerald-600":
                          event.category.toLowerCase() === "fitness",
                        "bg-purple-600":
                          event.category.toLowerCase() === "personal",
                        "bg-[var(--primary-dark)]": !event.category,
                      }
                    )}
                  >
                    {event.name}
                  </div>
                </Popover.Trigger>

                {activeModalId === event._id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-70 m-0">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative animate-fadeIn">
                      <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                        onClick={() => setActiveModalId(null)}
                      >
                        <X size={18} />
                      </button>

                      <h2 className="text-lg font-semibold mb-3 text-gray-800">
                        Delete Event
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete <b>{event.name}</b>?
                        This action cannot be undone.
                      </p>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setActiveModalId(null)}
                          className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={deleting}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 hover:cursor-pointer transition-all"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <Popover.Portal>
                  <Popover.Content
                    side="left"
                    align="center"
                    className="z-50 rounded-lg bg-white p-4 shadow-lg border border-gray-100 animate-in fade-in w-sm"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xl font-semibold flex-1">
                        {event.name}
                      </p>

                      <div className="flex justify-center items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => handleEdit(event._id)}
                            className="hover:cursor-pointer hover:text-[#3b82f6] text-gray-500 transition-all border-0"
                          >
                            <Pencil size={16} />
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => setActiveModalId(event._id)}
                            className="hover:cursor-pointer hover:text-[#dc2626] text-gray-500 transition-all border-0"
                          >
                            <Trash size={16} />
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex justify-start items-center gap-2 mb-4">
                      <Circle
                        size={10}
                        style={{
                          color: CategoryColorMap[event.category] || "#9ca3af",
                          fill: CategoryColorMap[event.category] || "#9ca3af",
                        }}
                      />
                      <p className="capitalize text-sm text-gray-600">
                        {event.category}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <Calendar size={ICON_SIZE} />
                      {format(new Date(event.date), "PPP")}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <Clock size={ICON_SIZE} />
                      {formatTime(event.startTime)}
                      {event.endTime ? ` - ${formatTime(event.endTime)}` : ""}
                    </p>
                    <div className="bg-gray-300 w-full h-[1px] mb-3"></div>
                    {event.description && (
                      <div className="mb-3">
                        <p className="text-gray-600 font-semibold text-md">
                          Description
                        </p>
                        <p className="text-sm text-gray-500">
                          {event.description}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 font-semibold text-md">
                        Location
                      </p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            ))}

            {hiddenCount > 0 && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <div className="text-xs text-gray-500 mt-1 cursor-pointer hover:underline">
                    +{hiddenCount} more...
                  </div>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="top"
                    align="center"
                    className="z-50 rounded-lg bg-white p-4 shadow-lg border border-gray-200 animate-in fade-in min-w-md"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <h2 className="text-sm font-semibold mb-2">
                      Events on {format(new Date(dayEvents[0].date), "PPP")}
                    </h2>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto">
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className="rounded border border-gray-200 p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-semibold flex-1">
                              {event.name}
                            </p>

                            <div className="flex justify-center items-center gap-3">
                              <Tooltip>
                                <TooltipTrigger
                                  onClick={() => handleEdit(event._id)}
                                  className="hover:cursor-pointer hover:text-[#3b82f6] text-gray-500 transition-all border-0"
                                >
                                  <Pencil size={16} />
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger
                                  onClick={() => setActiveModalId(event._id)}
                                  className="hover:cursor-pointer hover:text-[#dc2626] text-gray-500 transition-all border-0"
                                >
                                  <Trash size={16} />
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          <div className="flex justify-start items-center gap-2 mb-4">
                            <Circle
                              size={10}
                              style={{
                                color:
                                  CategoryColorMap[event.category] || "#9ca3af",
                                fill:
                                  CategoryColorMap[event.category] || "#9ca3af",
                              }}
                            />
                            <p className="capitalize text-sm text-gray-600">
                              {event.category}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                            <Clock size={ICON_SIZE} />
                            {formatTime(event.startTime)}
                            {event.endTime
                              ? ` - ${formatTime(event.endTime)}`
                              : ""}
                          </p>
                          <div className="bg-gray-300 w-full h-[1px] mb-3"></div>
                          {event.description && (
                            <div className="mb-3">
                              <p className="text-gray-600 font-semibold text-md">
                                Description
                              </p>
                              <p className="text-sm text-gray-500">
                                {event.description}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600 font-semibold text-md">
                              Location
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="relative">
      <div className="overflow-hidden border-2 bg-[var(--primary-light)] border-gray-200">
        <div className="grid grid-cols-7 border-b-2 py-2 text-center text-sm font-semibold border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="p-2">
              {d}
            </div>
          ))}
        </div>
        {rows}
      </div>
    </div>
  );
};

export default IcefangCalendarMonthView;
