import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Plus,
  ChevronRight,
  Calendar
} from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Link } from 'react-router-dom';

export default function DailyPlanTab({
  tasks = [],
  selectedDate = '2026-09-30',
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formatDateHeading = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Wednesday, 30 Sep 2026';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'DSA':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
      case 'SQL':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25';
      case 'Core CS':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/25';
      case 'Frontend':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      case 'Aptitude':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
      case 'Mock Interview':
        return 'bg-pink-500/15 text-pink-400 border border-pink-500/25';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-500/15 border border-red-500/25';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/15 border border-amber-500/25';
      case 'Low':
        return 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/25';
      default:
        return 'text-slate-400 bg-slate-800 border border-slate-700';
    }
  };

  const getActionDetails = (task) => {
    if (task.category === 'DSA') return { route: '/dsa', label: task.completed ? 'Start Again' : 'Start' };
    if (task.category === 'SQL') return { route: '/sql', label: task.completed ? 'Start Again' : 'Start' };
    return { route: '/study-plan', label: task.completed ? 'View' : 'Start' };
  };

  return (
    <div className="space-y-3">
      {/* Day Header & Progress Bar */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs">✦</span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {formatDateHeading(selectedDate)}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>
              <strong className="text-white">{completedCount}</strong> / {totalCount} completed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-36 sm:w-48">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="font-bold text-cyan-400">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isCompleted = task.completed;
          const action = getActionDetails(task);
          const isMenuOpen = activeMenuTaskId === task.id;

          return (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <span className={`text-xs font-semibold truncate ${isCompleted ? 'text-slate-300' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 relative">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${getCategoryBadgeClass(task.category)}`}>
                  {task.category || 'DSA'}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${getPriorityBadgeClass(task.priority || 'Medium')}`}>
                  {task.priority || 'Medium'}
                </span>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {task.duration || '30 min'}
                </span>

                <Link
                  to={action.route}
                  className="text-xs font-medium px-3 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-200 border border-slate-700/60 transition-colors"
                >
                  {action.label}
                </Link>

                <button
                  onClick={() => setActiveMenuTaskId(isMenuOpen ? null : task.id)}
                  className="p-1 text-slate-500 hover:text-slate-300"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-8 w-44 rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl z-30 py-1 text-xs">
                    <button
                      onClick={() => {
                        setActiveMenuTaskId(null);
                        setEditingTask(task);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-200"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenuTaskId(null);
                        setDeletingTask(task);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-400"
                    >
                      Remove Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={onAddTask}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={onUpdateTask}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onConfirm={onDeleteTask}
      />
    </div>
  );
}
