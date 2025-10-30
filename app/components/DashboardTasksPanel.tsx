import { Calendar, ClipboardList, ChevronRight } from "lucide-react";

const mockData: any[] = [
  {
    taskName: "Set up sword dance",
    taskDueDate: "25-08-2025",
  },
  {
    taskName: "Drop a draco",
    taskDueDate: "25-10-2025",
  },
  {
    taskName: "Tera normal guts boosted facade",
    taskDueDate: "25-07-2025",
  },
  {
    taskName: "Choice specs flutter mane",
    taskDueDate: "25-11-2025",
  },
];

type PanelItemProps = {
  taskName: string;
  taskDueDate?: string;
};

const PanelItem = ({ taskName, taskDueDate }: PanelItemProps) => {
  return (
    <div className="flex justify-start items-center gap-1 w-full py-3 px-4 gap-6 transition-all hover:bg-[var(--primary-light)] hover:cursor-pointer">
      <ClipboardList size={22} className="text-[var(--primary-main)]" />
      <div className="flex flex-col justify-start items-start flex-1">
        <p className="text-medium font-semibold text-black">{taskName}</p>
        <div className="flex justify-start items-center gap-3">
          <Calendar className="text-gray-600" size={14} />
          {taskDueDate && (
            <p className="text-sm text-gray-600">{taskDueDate}</p>
          )}
        </div>
      </div>
      <ChevronRight className="text-[var(--primary-dark)]" size={20} />
    </div>
  );
};

const DashboardTasksPanel = () => {
  return (
    <div className="bg-white rounded-xl px-4 py-6 border-2 border-gray-200">
      <p className="text-xl font-bold mb-6">Pending Tasks</p>
      <div className="flex flex-col divide-y divide-gray-200">
        {mockData.length > 0 ? (
          mockData.map((task, index) => (
            <PanelItem
              key={index}
              taskName={task.taskName}
              taskDueDate={task.taskDueDate}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No pending tasks. Yahooo!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardTasksPanel;
