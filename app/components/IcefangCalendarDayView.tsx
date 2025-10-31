import { cn } from "@/lib/utils";
import { addHours, format, parse } from "date-fns";
import { Calendar } from "lucide-react";

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

const IcefangCalendarDayView = ({
  events = [],
  currentDate,
}: CalendarProps) => {
  const dayEvents = events.filter(
    (event) =>
      format(new Date(event.date), "yyyy-MM-dd") ===
      format(currentDate, "yyyy-MM-dd")
  );

  return (
    <div className="flex min-h-[350px] flex-col rounded-lg border bg-white">
      <div className="bg-[var(--primary-light)] px-6 py-4 text-[var(--primary-dark)]">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>
      {dayEvents.length > 0 ? (
        <ul className="space-y-2 p-4">
          {dayEvents.map((event, idx) => (
            <li
              key={idx}
              className={cn(
                "rounded bg-[var(--primary-dark)] px-3 py-2 text-sm font-medium text-white",
                {
                  "bg-orange-500": event.category === "Work",
                  "bg-emerald-700": event.category === "Fitness",
                  "bg-purple-700": event.category === "Personal",
                }
              )}
            >
              <span className="font-semibold">
                {format(
                  parse(event.startTime ?? "", "HH:mm", new Date()),
                  "h:mm a"
                )}{" "}
                –{" "}
                {event.endTime
                  ? format(
                      parse(event.endTime ?? "", "HH:mm", new Date()),
                      "h:mm a"
                    )
                  : format(
                      addHours(
                        parse(event.startTime ?? "", "HH:mm", new Date()),
                        1
                      ),
                      "h:mm a"
                    )}
              </span>{" "}
              — {event.name}
              <p>{event.location}</p>
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
    </div>
  );
};

export default IcefangCalendarDayView;
