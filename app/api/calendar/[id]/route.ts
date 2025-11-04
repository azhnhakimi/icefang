import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

// GET /api/calendar/:id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const event = await Event.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!event) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("GET /api/calendar/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/calendar/:id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!updatedEvent)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(updatedEvent);
  } catch (err) {
    console.error("PATCH /api/calendar/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar/:id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const deletedEvent = await Event.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedEvent)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/calendar/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
