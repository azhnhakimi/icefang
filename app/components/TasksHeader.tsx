import TasksAddNewBtn from "./TasksAddNewBtn";

const TasksHeader = () => {
  return (
    <div className="w-full mb-8 flex justify-between items-end">
      <div>
        <p className="text-black text-2xl font-semibold">Tasks & Projects</p>
        <p className="text-sm text-gray-500">
          Organize and track your daily tasks and long-term projects.
        </p>
      </div>
      <TasksAddNewBtn />
    </div>
  );
};

export default TasksHeader;
