"use client";

import { cn } from "@/lib/utils";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { JSX, useState } from "react";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

type CalendarEvent = {
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category?: string;
};

type CalendarProps = {
  events?: CalendarEvent[];
  currentDate: Date;
};

const ICON_SIZE = 16;

const IcefangCalendarMonthView = ({
  events = [],
  currentDate,
}: CalendarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"event" | "day">("event");

  const openEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalMode("event");
    setShowModal(true);
  };

  const openDayModal = (events: CalendarEvent[]) => {
    setSelectedDayEvents(events);
    setModalMode("day");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedDayEvents([]);
  };

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = events.filter(
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
            "aspect-square min-h-[100px] border p-2 transition-colors overflow-hidden",
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
              <div
                key={idx}
                onClick={() => openEventModal(event)}
                className={cn(
                  "cursor-pointer truncate rounded bg-[var(--primary-dark)] p-1 text-xs text-white hover:opacity-90 transition-all",
                  {
                    "bg-orange-600": event.category === "Work",
                    "bg-emerald-700": event.category === "Fitness",
                    "bg-purple-700": event.category === "Personal",
                  }
                )}
              >
                {event.name}
              </div>
            ))}

            {hiddenCount > 0 && (
              <div
                onClick={() => openDayModal(dayEvents)}
                className="text-xs text-gray-500 mt-1 cursor-pointer hover:underline"
              >
                +{hiddenCount} more...
              </div>
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
      {/* Calendar grid */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
            >
              ✕
            </button>

            {modalMode === "event" && selectedEvent && (
              <>
                <h2 className="text-lg font-semibold mb-2">
                  {selectedEvent.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2 flex justify-start items-center gap-2">
                  <Calendar size={ICON_SIZE} />
                  {format(new Date(selectedEvent.date), "PPP")}
                </p>
                <p className="text-sm text-gray-600 mb-2 flex justify-start items-center gap-2">
                  <Clock size={ICON_SIZE} />
                  {selectedEvent.startTime}
                  {selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ""}
                </p>
                {selectedEvent.location && (
                  <p className="text-sm text-gray-600 mb-2 flex justify-start items-center gap-2">
                    <MapPin size={ICON_SIZE} />
                    {selectedEvent.location}
                  </p>
                )}
                {selectedEvent.category && (
                  <p className="text-sm text-gray-600 mb-3 flex justify-start items-center gap-2">
                    <Tag size={ICON_SIZE} />
                    {selectedEvent.category}
                  </p>
                )}
              </>
            )}

            {modalMode === "day" && selectedDayEvents.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-3">
                  Events on {format(new Date(selectedDayEvents[0].date), "PPP")}
                </h2>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedDayEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-gray-200 p-2 bg-gray-50"
                    >
                      <p className="font-medium text-sm mb-2">{event.name}</p>
                      <p className="text-xs text-gray-600 flex justify-start items-center gap-2 mb-1">
                        <Clock size={ICON_SIZE} />
                        {event.startTime}
                        {event.endTime ? ` - ${event.endTime}` : ""}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-600 flex justify-start items-center gap-2 mb-1">
                          <MapPin size={ICON_SIZE} />
                          {event.location}
                        </p>
                      )}
                      {event.category && (
                        <p className="text-xs text-gray-600 flex justify-start items-center gap-2 mb-1">
                          <Tag size={ICON_SIZE} />
                          {event.category}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IcefangCalendarMonthView;
