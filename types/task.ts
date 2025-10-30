export interface TaskLean {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: string;
  category: string;
  completed: boolean;
  dueDate: string;
  createdAt: Date;
  updatedAt: Date;
}
