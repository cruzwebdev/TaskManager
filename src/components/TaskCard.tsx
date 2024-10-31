import React from 'react';
import { format } from 'date-fns';
import { Clock, Flag, MoreVertical, User } from 'lucide-react';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  'completed': 'bg-green-100 text-green-800',
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          <Flag size={12} className="inline mr-1" />
          {task.priority}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{format(task.dueDate, 'MMM d')}</span>
        </div>
        {task.assignee && (
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{task.assignee}</span>
          </div>
        )}
      </div>
    </div>
  );
}