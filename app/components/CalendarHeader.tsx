import CalendarAddNewBtn from "./CalendarAddNewBtn";

const CalendarHeader = () => {
  return (
    <div className="w-full mb-8 flex justify-between items-end">
      <div>
        <p className="text-black text-2xl font-semibold">Calendar & Events</p>
        <p className="text-sm text-gray-500">
          Manage and schedule your upcoming events.
        </p>
      </div>
      <CalendarAddNewBtn />
    </div>
  );
};

export default CalendarHeader;
