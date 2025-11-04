"use client";

import { cn } from "@/lib/utils";
import {
  addDays,
  addHours,
  differenceInMinutes,
  format,
  isSameDay,
  parse,
  startOfWeek,
  isBefore,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { Calendar, Circle, Clock, Pencil, Trash, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "./IcefangCalendarMonthView";
import { useRouter } from "next/navigation";

type CalendarEvent = {
  _id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category: string;
};

type CalendarProps = {
  events?: CalendarEvent[];
  currentDate: Date;
  onEventDelete: (id: string) => void;
};

const ICON_SIZE = 16;

const CategoryColorMap: Record<string, string> = {
  personal: "#9333ea",
  work: "#ea580c",
  fitness: "#059669",
};

const IcefangCalendarWeekView = ({
  events = [],
  currentDate,
  onEventDelete,
}: CalendarProps) => {
  const today = new Date();
  const start = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 80; // px per hour
  const router = useRouter();

  const [eventsList, setEventsList] = useState<CalendarEvent[]>(events || []);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null);
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
      onEventDelete(id);
      closeModal();
      setShowDeleteConfirmModal(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting the event");
    } finally {
      setDeleting(false);
    }
  };

  // ⏰ Update current time line every minute
  useEffect(() => {
    const updateLine = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setCurrentTimeTop((minutes / 60) * hourHeight);
    };
    updateLine();
    const interval = setInterval(updateLine, 60000);
    return () => clearInterval(interval);
  }, []);

  const openEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setShowDeleteConfirmModal(false);
  };

  // --- Handle overlapping events ---
  const getOverlappingGroups = (dayEvents: CalendarEvent[]) => {
    const parsed = dayEvents
      .map((event) => {
        const start = parse(event.startTime, "HH:mm", new Date());
        const end = event.endTime
          ? parse(event.endTime, "HH:mm", new Date())
          : addHours(start, 1);
        return { ...event, start, end };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const groups: (typeof parsed)[] = [];
    let currentGroup: typeof parsed = [];

    parsed.forEach((event) => {
      if (currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        const last = currentGroup[currentGroup.length - 1];
        if (isBefore(event.start, last.end)) {
          currentGroup.push(event);
        } else {
          groups.push(currentGroup);
          currentGroup = [event];
        }
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

  return (
    <div className="relative overflow-hidden border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-8 border-b bg-[var(--primary-light)] text-sm font-semibold">
        <div className="my-auto p-2 text-center text-gray-600">Time</div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "p-2 text-center",
              isSameDay(day, today)
                ? "font-bold text-[var(--primary-dark)]"
                : "text-gray-700"
            )}
          >
            <div>{format(day, "EEE")}</div>
            <div className="text-base font-semibold">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 divide-x divide-gray-200 text-xs text-gray-500">
        {/* Time column */}
        <div className="flex flex-col border-r border-gray-200">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b border-gray-100 px-2 py-1 text-center"
            >
              {format(new Date().setHours(hour, 0, 0, 0), "h a")}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayEvents = eventsList.filter(
            (event) =>
              format(new Date(event.date), "yyyy-MM-dd") ===
              format(day, "yyyy-MM-dd")
          );
          const overlappingGroups = getOverlappingGroups(dayEvents);

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative border-r border-gray-200",
                isSameDay(day, today) ? "bg-[var(--primary-light)]" : ""
              )}
            >
              {/* Hour lines */}
              {hours.map((hour) => (
                <div key={hour} className="h-20 border-b border-gray-100" />
              ))}

              {/* Current time line */}
              {isSameDay(day, today) && currentTimeTop !== null && (
                <div
                  className="absolute left-0 right-0 z-20 h-[2px] bg-red-500"
                  style={{ top: `${currentTimeTop}px` }}
                />
              )}

              {/* Events */}
              {overlappingGroups.map((group, gIdx) => {
                const totalCols = group.length;
                return group.map((event, idx) => {
                  const startTime = parse(event.startTime, "HH:mm", new Date());
                  const endTime = event.endTime
                    ? parse(event.endTime, "HH:mm", new Date())
                    : addHours(startTime, 1);

                  const top =
                    startTime.getHours() * hourHeight +
                    (startTime.getMinutes() / 60) * hourHeight;
                  const height =
                    (differenceInMinutes(endTime, startTime) / 60) * hourHeight;

                  const width = 100 / totalCols;
                  const left = idx * width;

                  return (
                    <div
                      key={`${gIdx}-${idx}`}
                      onClick={() => openEventModal(event)}
                      className={cn(
                        "absolute z-10 rounded-md p-1 text-[10px] font-medium text-white shadow-sm cursor-pointer overflow-hidden hover:opacity-90 transition",
                        {
                          "bg-orange-600":
                            event.category?.toLowerCase() === "work",
                          "bg-emerald-600":
                            event.category?.toLowerCase() === "fitness",
                          "bg-purple-600":
                            event.category?.toLowerCase() === "personal",
                          "bg-[var(--primary-dark)]": !event.category,
                        }
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    >
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold">
                          {format(startTime, "hh:mm a")} -{" "}
                          {format(endTime, "hh:mm a")}
                        </span>
                        <span className="truncate">{event.name}</span>
                        {event.location && (
                          <span className="truncate text-[9px] text-[var(--primary-light)]">
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-2 flex-1">
                {selectedEvent.name}
              </h2>
              <div className="flex justify-end items-center gap-3">
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => handleEdit(selectedEvent._id)}
                    className="text-gray-500 hover:text-blue-500 hover:cursor-pointer transition-all"
                  >
                    <Pencil size={19} />
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="text-gray-500 hover:text-red-600 hover:cursor-pointer transition-all"
                  >
                    <Trash size={19} />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-900 hover:cursor-pointer transition-all"
                  >
                    <X size={22} />
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex justify-start items-center gap-2 mb-4">
              <Circle
                size={10}
                style={{
                  color: CategoryColorMap[selectedEvent.category] || "#9ca3af",
                  fill: CategoryColorMap[selectedEvent.category] || "#9ca3af",
                }}
              />
              <p className="capitalize text-sm text-gray-600">
                {selectedEvent.category}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Calendar size={ICON_SIZE} />
              {format(new Date(selectedEvent.date), "PPP")}
            </p>

            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Clock size={ICON_SIZE} />
              {formatTime(selectedEvent.startTime)}
              {selectedEvent.endTime
                ? ` - ${formatTime(selectedEvent.endTime)}`
                : ""}
            </p>
            <div className="bg-gray-300 w-full h-[1px] mb-3"></div>
            {selectedEvent.description && (
              <div className="mb-3">
                <p className="text-gray-600 font-semibold text-md">
                  Description
                </p>
                <p className="text-sm text-gray-500">
                  {selectedEvent.description}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600 font-semibold text-md">Location</p>
              <p className="text-sm text-gray-500">{selectedEvent.location}</p>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Delete Event
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <b>{selectedEvent.name}</b>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedEvent._id)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 hover:cursor-pointer transition-all"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IcefangCalendarWeekView;
