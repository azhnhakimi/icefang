import { Metadata } from "next";
import CalendarHeader from "@/components/CalendarHeader";
import IcefangCalendar from "@/components/IcefangCalendar";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Manage and schedule your upcoming events",
};

const CalendarIndexPage = () => {
  return (
    <section className="w-full h-full bg-[var(--primary-background)] p-6 space-y-8">
      <CalendarHeader />
      <IcefangCalendar />
    </section>
  );
};

export default CalendarIndexPage;
