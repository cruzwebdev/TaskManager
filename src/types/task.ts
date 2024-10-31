export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Changed from Date to string for serialization
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  createdAt: string; // Changed from Date to string for serialization
  updatedAt: string; // Changed from Date to string for serialization
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
}