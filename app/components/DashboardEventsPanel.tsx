import { CalendarCheck2 } from "lucide-react";

const mockData: any[] = [
  {
    eventName: "Spore that mf",
    eventDate: "26-10-2025",
  },
  {
    eventName: "It's a monster house",
    eventDate: "26-11-2025",
  },
  {
    eventName: "Arcanine used flare blitz",
    eventDate: "26-12-2025",
  },
];

type PanelItemProps = {
  eventName: string;
  eventDate: string;
};

const PanelItem = ({ eventName, eventDate }: PanelItemProps) => {
  return (
    <div className="flex justify-start items-center gap-4 bg-[var(--primary-light)] px-4 py-3 rounded-xl">
      <div className="p-2 bg-[var(--primary-variation)] rounded-xl ">
        <CalendarCheck2 size={22} className="text-[var(--primary-main)]" />
      </div>
      <div className="flex flex-col justify-start items-start">
        <p className="text-sm font-bold">{eventName}</p>
        <p className="text-sm text-gray-600">{eventDate}</p>
      </div>
    </div>
  );
};

const DashboardEventsPanel = () => {
  return (
    <div className="bg-white rounded-xl px-4 py-6 border-2 border-gray-200">
      <p className="text-xl font-bold mb-6">Upcoming Events</p>
      {mockData.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {mockData.map((event, index) => (
            <PanelItem
              key={index}
              eventName={event.eventName}
              eventDate={event.eventDate}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No events scheduled. Yahooo!</p>
      )}
    </div>
  );
};

export default DashboardEventsPanel;
