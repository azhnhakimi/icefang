import { Metadata } from "next";
import CalendarHeader from "@/components/CalendarHeader";
import IcefangCalendar from "@/components/IcefangCalendar";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Manage and schedule your upcoming events",
};

export const mockEvents = [
  {
    name: "Team Meeting",
    date: "2025-10-30",
    startTime: "09:00",
    endTime: "10:00",
    location: "Conference Room A",
    category: "Work",
  },
  {
    name: "Team Meeting B",
    date: "2025-10-30",
    startTime: "09:00",
    endTime: "10:00",
    location: "Conference Room A",
    category: "Work",
  },
  {
    name: "Team Meeting C",
    date: "2025-10-30",
    startTime: "09:00",
    endTime: "10:00",
    location: "Conference Room A",
    category: "Work",
  },
  {
    name: "Team Meeting D",
    date: "2025-10-30",
    startTime: "09:00",
    endTime: "10:00",
    location: "Conference Room A",
    category: "Work",
  },
  {
    name: "Client Call",
    date: "2025-10-30",
    startTime: "09:30",
    endTime: "10:15",
    location: "Zoom",
    category: "Work",
  },
  {
    name: "Design Review",
    date: "2025-10-30",
    startTime: "10:00",
    endTime: "11:00",
    location: "Studio",
    category: "Design",
  },
  {
    name: "Lunch with Sarah",
    date: "2025-10-30",
    startTime: "12:00",
    endTime: "13:00",
    location: "Café Luna",
    category: "Personal",
  },
  {
    name: "Code Review",
    date: "2025-10-31",
    startTime: "09:00",
    endTime: "10:30",
    location: "Office",
    category: "Work",
  },
  {
    name: "Gym",
    date: "2025-10-31",
    startTime: "09:30",
    endTime: "10:30",
    location: "FitZone",
    category: "Fitness",
  },
  {
    name: "Product Demo",
    date: "2025-10-31",
    startTime: "14:00",
    endTime: "15:00",
    location: "Zoom",
    category: "Work",
  },
  {
    name: "Doctor Appointment",
    date: "2025-11-01",
    startTime: "10:00",
    endTime: "10:30",
    location: "City Clinic",
    category: "Fitness",
  },
  {
    name: "Brunch with Friends",
    date: "2025-11-01",
    startTime: "10:15",
    endTime: "11:45",
    location: "Brew Café",
    category: "Personal",
  },
  {
    name: "Weekly Sync",
    date: "2025-11-02",
    startTime: "09:00",
    endTime: "10:00",
    location: "Office",
    category: "Work",
  },
  {
    name: "Project Brainstorm",
    date: "2025-11-02",
    startTime: "09:45",
    endTime: "11:15",
    location: "Meeting Room B",
    category: "Work",
  },
];

const CalendarIndexPage = () => {
  return (
    <section className="w-full h-full bg-[var(--primary-background)] p-6 space-y-8">
      <CalendarHeader />
      <IcefangCalendar events={mockEvents} />
    </section>
  );
};

export default CalendarIndexPage;
