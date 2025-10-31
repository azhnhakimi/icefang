import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

// POST /api/calendar → create new event
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { name, description, date, startTime, endTime, location, category } =
      body;

    if (!name || !startTime || !category || !date) {
      return NextResponse.json(
        { error: "Event name, date, start time, and category are required" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      userId: session.user.id,
      name,
      description,
      date: date ? new Date(date) : null,
      startTime,
      endTime,
      location,
      category,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error("POST /api/calendar error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/calendar → get all events for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const events = await Event.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error("GET /api/calendar error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
