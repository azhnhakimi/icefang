import CalendarForm from "@/components/CalendarForm";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { EventLean } from "types/event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Modify your event as you please",
};

export default async function CalendarEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();

  const event = (await Event.findOne({
    _id: id,
    userId: session.user.id,
  }).lean()) as EventLean | null;

  if (!event) notFound();

  const safeEvent = {
    _id: event._id.toString(),
    name: event.name,
    description: event.description || "",
    date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    startTime: event.startTime,
    endTime: event.endTime || "",
    location: event.location,
    category: event.category,
  };

  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-[var(--primary-light)]">
      <CalendarForm mode="edit" event={safeEvent} />
    </section>
  );
}
