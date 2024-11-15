import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  recurring: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() {
        return !!this.recurring;
      }
    },
    interval: {
      type: Number,
      min: 1,
      required: function() {
        return !!this.recurring;
      }
    }
  }
}, { _id: true });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo',
  },
  assignee: {
    type: String,
  },
  reminders: [reminderSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);