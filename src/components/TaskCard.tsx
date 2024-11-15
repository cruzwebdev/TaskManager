import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Flag, MoreVertical, User, Edit, Trash2, Bell } from 'lucide-react';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
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

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatReminder = (reminder: Task['reminders'][0]) => {
    const date = format(new Date(reminder.date), 'MMM d, h:mm a');
    if (!reminder.recurring) return date;
    
    return `${date} (${reminder.recurring.frequency}, every ${reminder.recurring.interval})`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
        <div className="relative" ref={menuRef}>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={16} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(task);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
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
      
      {task.reminders.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Reminders</h4>
          <div className="space-y-1">
            {task.reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start text-xs text-gray-600">
                <Bell size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                <span>{formatReminder(reminder)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{format(new Date(task.dueDate), 'MMM d')}</span>
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