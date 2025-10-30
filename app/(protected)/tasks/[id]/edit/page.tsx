import TaskForm from "@/components/TasksForm";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { TaskLean } from "types/task";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Task",
  description: "Modify your task as you please",
};

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();

  const task = (await Task.findOne({
    _id: id,
    userId: session.user.id,
  }).lean()) as TaskLean | null;

  if (!task) notFound();

  const safeTask = {
    _id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    category: task.category,
    completed: task.completed || false,
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
  };

  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-[var(--primary-light)]">
      <TaskForm mode="edit" task={safeTask} />
    </section>
  );
}
