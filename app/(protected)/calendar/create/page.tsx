import CalendarForm from "@/components/CalendarForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Plan out your schedule with ease",
};

const CalendarCreatePage = () => {
  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-[var(--primary-light)]">
      <CalendarForm mode="create" />
    </section>
  );
};

export default CalendarCreatePage;
