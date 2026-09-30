import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DSA');
  const [duration, setDuration] = useState('30 min');
  const [priority, setPriority] = useState('High');
  const [scheduledDate, setScheduledDate] = useState('2026-09-30');
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
        duration,
        estimatedMinutes: parseInt(duration, 10) || 30,
        priority,
        scheduledDate
      });
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Add Study Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Task Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Practice Binary Search on Rotated Array"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 outline-hidden text-xs sm:text-sm"
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
              <label className="block font-medium text-slate-300 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 outline-hidden text-xs sm:text-sm"
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
              <label className="block font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 outline-hidden text-xs sm:text-sm"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 outline-hidden text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
