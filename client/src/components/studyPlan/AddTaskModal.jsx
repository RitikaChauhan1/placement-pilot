import React, { useState } from 'react';
import { X, Plus, Clock, Tag, Flag, Calendar, BookOpen } from 'lucide-react';

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DSA');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [priority, setPriority] = useState('High');
  const [scheduledDate, setScheduledDate] = useState('2026-09-30');
  const [resourceUrl, setResourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      await onAddTask({
        title: title.trim(),
        category,
        topic: topic.trim(),
        duration,
        estimatedMinutes: parseInt(duration, 10) || 30,
        priority,
        scheduledDate,
        resourceUrl: resourceUrl.trim(),
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Add Study Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          {/* Task Name */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Task Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Practice Binary Search on Rotated Array"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
            />
          </div>

          {/* Category & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <option value="Projects">Projects</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Specific Topic</label>
              <input
                type="text"
                placeholder="e.g. Binary Search, Joins, OOP"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Duration & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Estimated Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
              >
                <option value="15 min">15 min</option>
                <option value="20 min">20 min</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min (1 hr)</option>
                <option value="90 min">90 min</option>
              </select>
            </div>
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
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium text-foreground mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
            />
          </div>

          {/* Resource URL / Optional notes */}
          <div>
            <label className="block font-medium text-foreground mb-1">Optional Notes</label>
            <textarea
              rows={2}
              placeholder="Key concepts to focus on, problem numbers, or reference notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-hidden text-xs sm:text-sm"
            />
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
              disabled={submitting || !title.trim()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
