import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

// POST /api/tasks → create new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { title, description, priority, category, dueDate } = body;

    if (!title || !priority || !category) {
      return NextResponse.json(
        { error: "Title, priority, and category are required" },
        { status: 400 }
      );
    }

    const newTask = await Task.create({
      userId: session.user.id,
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/tasks → get all tasks for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const tasks = await Task.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
