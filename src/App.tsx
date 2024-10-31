import React, { useState, useEffect } from 'react';
import { Plus, Search, Bell, Menu, X } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { tasks as tasksApi, auth as authApi } from './services/api';
import type { Task, CreateTaskInput } from './types/task';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design New Dashboard',
    description: 'Create wireframes and high-fidelity designs for the analytics dashboard',
    dueDate: '2024-03-25',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Sarah Chen',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Implement REST API endpoints for user authentication and task management',
    dueDate: '2024-03-28',
    priority: 'medium',
    status: 'todo',
    assignee: 'Mike Johnson',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct user testing sessions and gather feedback on the new features',
    dueDate: '2024-03-30',
    priority: 'low',
    status: 'todo',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
    } else {
      setIsAuthenticated(true);
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await tasksApi.getAll();
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    try {
      const newTask = await tasksApi.create(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsTaskModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleAuth = async ({ email, password, isLogin }: { email: string; password: string; isLogin: boolean }) => {
    try {
      if (isLogin) {
        await authApi.login(email, password);
      } else {
        await authApi.register(email, password);
      }
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      await fetchTasks();
      toast.success(isLogin ? 'Logged in successfully' : 'Account created successfully');
    } catch (error) {
      toast.error(isLogin ? 'Login failed' : 'Registration failed');
      console.error('Auth error:', error);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
    setTasks([]);
    setFilteredTasks([]);
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {}} // Prevent closing when not authenticated
          onSubmit={handleAuth}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                New Task
              </button>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button 
              onClick={() => {
                setIsTaskModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-1" />
              New Task
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
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
        
        <TaskList 
          tasks={filteredTasks} 
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleCreateTask}
        task={editingTask}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuth}
      />
    </div>
  );
}

export default App;