import Link from "next/link";
import { Plus } from "lucide-react";

const CalendarAddNewBtn = () => {
  return (
    <Link
      href={"/calendar/create"}
      className="flex justify-center items-center gap-1 bg-[var(--primary-dark)] px-4 py-2 rounded-xl hover:bg-[var(--primary-dark-hover)] transition-all"
    >
      <Plus className="text-white" size={18} strokeWidth={3} />
      <p className="font-semibold text-white">New Event</p>
    </Link>
  );
};

export default CalendarAddNewBtn;
