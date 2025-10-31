import mongoose, { Schema, Document, models } from "mongoose";

export interface IEvent extends Document {
  userId: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    location: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
