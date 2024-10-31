import React from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function TaskList({ tasks, onEditTask }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  );
}