import { cn } from "@/lib/utils";
import { addHours, format, parse } from "date-fns";
import { Calendar, Circle, Pencil, Trash, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatTime } from "./IcefangCalendarMonthView";

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

const CategoryColorMap: Record<string, string> = {
  personal: "#9333ea",
  work: "#ea580c",
  fitness: "#059669",
};

const IcefangCalendarDayView = ({
  events = [],
  currentDate,
  onEventDelete,
}: CalendarProps) => {
  const router = useRouter();
  const [eventsList, setEventsList] = useState<CalendarEvent[]>(events);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setEventsList(events);
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
      setShowDeleteConfirmModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting the event");
    } finally {
      setDeleting(false);
    }
  };

  const dayEvents = eventsList.filter(
    (event) =>
      format(new Date(event.date), "yyyy-MM-dd") ===
      format(currentDate, "yyyy-MM-dd")
  );

  return (
    <div className="relative flex min-h-[350px] flex-col rounded-lg border bg-white">
      <div className="bg-[var(--primary-light)] px-6 py-4 text-[var(--primary-dark)]">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>
      {dayEvents.length > 0 ? (
        <ul className="space-y-2 p-4">
          {dayEvents.map((event, idx) => (
            <li key={idx} className="rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{event.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(event.startTime)}
                    {event.endTime ? ` - ${formatTime(event.endTime)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => handleEdit(event._id)}
                      className="text-gray-500 hover:text-blue-500 transition-colors hover:cursor-pointer"
                    >
                      <Pencil size={16} />
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDeleteConfirmModal(true);
                      }}
                      className="text-gray-500 hover:text-red-600 transition-colors hover:cursor-pointer"
                    >
                      <Trash size={16} />
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Circle
                  size={10}
                  style={{
                    color: CategoryColorMap[event.category] || "#9ca3af",
                    fill: CategoryColorMap[event.category] || "#9ca3af",
                  }}
                />
                <p className="capitalize text-xs text-gray-600">
                  {event.category}
                </p>
              </div>
              {event.description && (
                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                  <span className="font-semibold text-gray-600">
                    Description:
                  </span>
                  {"\n"}
                  {event.description}
                </p>
              )}
              {event.location && (
                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                  <span className="font-semibold text-gray-600">Location:</span>
                  {"\n"}
                  {event.location}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <Calendar />
          <p className="text-sm text-gray-800">
            No events scheduled for this day.
          </p>
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

export default IcefangCalendarDayView;
