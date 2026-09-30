import React, { useState, useEffect } from 'react';
import { X, Edit2, Clock, Flag } from 'lucide-react';

export default function EditTaskModal({ isOpen, onClose, task, onSave }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DSA');
  const [duration, setDuration] = useState('30 min');
  const [priority, setPriority] = useState('High');
  const [scheduledDate, setScheduledDate] = useState('2026-09-30');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'DSA');
      setDuration(task.duration || '30 min');
      setPriority(task.priority || 'High');
      setScheduledDate(task.scheduled_date || '2026-09-30');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      await onSave(task.id, {
        title: title.trim(),
        category,
        duration,
        priority,
        scheduled_date: scheduledDate
      });
      onClose();
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-foreground">Edit Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-foreground mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              >
                <option value="DSA">DSA</option>
                <option value="SQL">SQL</option>
                <option value="Core CS">Core CS</option>
                <option value="Frontend">Frontend</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Mock Interview">Mock Interview</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              >
                <option value="15 min">15 min</option>
                <option value="20 min">20 min</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
