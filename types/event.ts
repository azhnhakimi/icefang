export interface EventLean {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
