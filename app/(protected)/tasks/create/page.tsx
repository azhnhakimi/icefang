import { Metadata } from "next";
import TaskForm from "@/components/TasksForm";

export const metadata: Metadata = {
  title: "Create Task",
  description: "Create your tasks with ease",
};

export default function TasksCreatePage() {
  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-[var(--primary-light)]">
      <TaskForm mode="create" />
    </section>
  );
}
