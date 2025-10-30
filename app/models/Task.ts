import mongoose, { Schema, Document, models } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  priority: string;
  category: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, required: true },
    category: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Task = models.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;
