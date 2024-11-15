import React from 'react';
import { Plus, X } from 'lucide-react';
import type { Reminder } from '../types/task';

interface ReminderFormProps {
  reminders: Omit<Reminder, 'id'>[];
  onChange: (reminders: Omit<Reminder, 'id'>[]) => void;
}

export function ReminderForm({ reminders, onChange }: ReminderFormProps) {
  const addReminder = () => {
    onChange([...reminders, { date: new Date().toISOString() }]);
  };

  const updateReminder = (index: number, updates: Partial<Omit<Reminder, 'id'>>) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], ...updates };
    onChange(newReminders);
  };

  const removeReminder = (index: number) => {
    onChange(reminders.filter((_, i) => i !== index));
  };

  const toggleRecurring = (index: number) => {
    const reminder = reminders[index];
    if (reminder.recurring) {
      const { recurring: _recurring, ...rest } = reminder;
      updateReminder(index, rest);
    } else {
      updateReminder(index, {
        ...reminder,
        recurring: { frequency: 'daily', interval: 1 }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Reminders</label>
        <button
          type="button"
          onClick={addReminder}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
        >
          <Plus size={16} className="mr-1" />
          Add Reminder
        </button>
      </div>

      {reminders.map((reminder, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium text-gray-700">Reminder {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeReminder(index)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                value={reminder.date.slice(0, 16)}
                onChange={(e) => updateReminder(index, { date: new Date(e.target.value).toISOString() })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recurring</label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={!!reminder.recurring}
                    onChange={() => toggleRecurring(index)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable recurring</span>
                </label>
              </div>
            </div>
          </div>

          {reminder.recurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={reminder.recurring.frequency}
                  onChange={(e) => updateReminder(index, {
                    recurring: { ...reminder.recurring!, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interval</label>
                <input
                  type="number"
                  min="1"
                  value={reminder.recurring.interval}
                  onChange={(e) => updateReminder(index, {
                    recurring: { ...reminder.recurring!, interval: parseInt(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}