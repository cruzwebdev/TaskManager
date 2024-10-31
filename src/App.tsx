import React, { useState } from 'react';
import { Plus, Search, Bell, Menu, X } from 'lucide-react';
import { TaskList } from './components/TaskList';
import type { Task } from './types/task';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design New Dashboard',
    description: 'Create wireframes and high-fidelity designs for the analytics dashboard',
    dueDate: new Date('2024-03-25'),
    priority: 'high',
    status: 'in-progress',
    assignee: 'Sarah Chen',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Implement REST API endpoints for user authentication and task management',
    dueDate: new Date('2024-03-28'),
    priority: 'medium',
    status: 'todo',
    assignee: 'Mike Johnson',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct user testing sessions and gather feedback on the new features',
    dueDate: new Date('2024-03-30'),
    priority: 'low',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-1" />
                New Task
              </button>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 p-4">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-1" />
              New Task
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your tasks efficiently
          </p>
        </div>
        
        <TaskList tasks={tasks} onEditTask={handleEditTask} />
      </main>
    </div>
  );
}

export default App;