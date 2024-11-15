import express from 'express';
import Task from '../models/Task.js';
import { z } from 'zod';

const router = express.Router();

// Enhanced validation schema with reminders
const reminderSchema = z.object({
  date: z.string().datetime({ message: 'Invalid reminder date format' }),
  recurring: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().min(1)
  }).optional()
});

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime({ message: 'Invalid date format' }),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'completed']),
  assignee: z.string().optional(),
  reminders: z.array(reminderSchema).optional().default([])
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Transform _id to id for frontend consistency
    const transformedTasks = tasks.map(task => ({
      id: task._id.toString(),
      ...task,
      reminders: task.reminders.map(reminder => ({
        id: reminder._id.toString(),
        date: reminder.date.toISOString(),
        recurring: reminder.recurring
      })),
      _id: undefined,
      user: undefined,
      __v: undefined,
    }));

    res.json(transformedTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    
    // Ensure reminders are properly formatted for MongoDB
    const formattedReminders = validatedData.reminders.map(reminder => ({
      date: new Date(reminder.date),
      recurring: reminder.recurring
    }));

    const task = new Task({
      ...validatedData,
      reminders: formattedReminders,
      user: req.user.userId,
    });

    await task.save();

    // Transform response for frontend
    const responseTask = {
      id: task._id.toString(),
      ...task.toObject(),
      reminders: task.reminders.map(reminder => ({
        id: reminder._id.toString(),
        date: reminder.date.toISOString(),
        recurring: reminder.recurring
      })),
      _id: undefined,
      user: undefined,
      __v: undefined,
    };

    res.status(201).json(responseTask);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const validatedData = taskSchema.partial().parse(req.body);

    console.log(validatedData)

    // Format reminders if they exist in the update
    if (validatedData.reminders) {
      validatedData.reminders = validatedData.reminders.map(reminder => ({
        date: new Date(reminder.date),
        recurring: reminder.recurring
      }));
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      validatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Transform response for frontend
    const responseTask = {
      id: task._id.toString(),
      ...task,
      reminders: task.reminders.map(reminder => ({
        id: reminder._id.toString(),
        date: reminder.date.toISOString(),
        recurring: reminder.recurring
      })),
      _id: undefined,
      user: undefined,
      __v: undefined,
    };

    res.json(responseTask);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;