"use client";

import {
  addDays,
  addMonths,
  format,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import IcefangCalendarHeader from "./IcefangCalendarHeader";
import IcefangCalendarMonthView from "./IcefangCalendarMonthView";
import IcefangCalendarWeekView from "./IcefangCalendarWeekView";
import IcefangCalendarDayView from "./IcefangCalendarDayView";

type CalendarEvent = {
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category?: string;
};

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

type CalendarProps = {
  events?: CalendarEvent[];
};

const IcefangCalendar = () => {
  const [events, setEvent] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/calendar");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventDelete = (deletedEventId: string) => {
    setEvent((prevEvents) =>
      prevEvents.filter((event) => event._id !== deletedEventId)
    );
  };

  const handlePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subDays(currentDate, 7));
    else if (view === "day") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addDays(currentDate, 7));
    else if (view === "day") setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(today);

  const getHeaderLabel = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") {
      const weekStart = startOfWeek(currentDate);
      return `Week of ${format(weekStart, "MMM d, yyyy")}`;
    }
    return format(currentDate, "EEEE, MMMM d, yyyy");
  };

  return (
    <div className="bg-white rounded-xl px-8 py-6 border-2 border-gray-200">
      <IcefangCalendarHeader
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleToday={handleToday}
        getHeaderLabel={getHeaderLabel}
        view={view}
        setView={setView}
      />
      <div>
        {view === "month" && (
          <IcefangCalendarMonthView
            events={events}
            currentDate={currentDate}
            onEventDelete={handleEventDelete}
          />
        )}
        {view === "week" && (
          <IcefangCalendarWeekView
            events={events}
            currentDate={currentDate}
            onEventDelete={handleEventDelete}
          />
        )}
        {view === "day" && (
          <IcefangCalendarDayView
            events={events}
            currentDate={currentDate}
            onEventDelete={handleEventDelete}
          />
        )}
      </div>
    </div>
  );
};

export default IcefangCalendar;
