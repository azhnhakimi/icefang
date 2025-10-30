import type { Metadata } from "next";

import TasksHeader from "@/components/TasksHeader";
import TasksDisplayPanel from "@/components/TasksDisplayPanel";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Organize and track your daily tasks and long-term projects",
};

const TasksIndexPage = () => {
  return (
    <section className="w-full h-full bg-[var(--primary-background)] p-6 space-y-8">
      <TasksHeader />
      <TasksDisplayPanel />
    </section>
  );
};

export default TasksIndexPage;
