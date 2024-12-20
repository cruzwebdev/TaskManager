import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, CreateTaskInput, Reminder } from '../types/task';
import { ReminderForm } from './ReminderForm';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => void;
  task?: Task;
}

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [reminders, setReminders] = useState<Omit<Reminder, 'id'>[]>(
    task?.reminders.map(({ id, ...rest }) => rest) || []
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Convert the date string to ISO format for the server
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(23, 59, 59, 999); // Set to end of day
    
    const taskData: CreateTaskInput = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: dueDate.toISOString(),
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      status: formData.get('status') as 'todo' | 'in-progress' | 'completed',
      assignee: formData.get('assignee') as string || undefined,
      reminders: reminders,
    };
    onSubmit(taskData);
  };

  // Format the date for the input field if editing a task
  const defaultDueDate = task?.dueDate ? 
    format(new Date(task.dueDate), 'yyyy-MM-dd') : 
    undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={task?.title}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={task?.description}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={defaultDueDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  defaultValue={task?.priority || 'medium'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  defaultValue={task?.status || 'todo'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <input
                  type="text"
                  name="assignee"
                  defaultValue={task?.assignee}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <ReminderForm 
            reminders={reminders}
            onChange={setReminders}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}