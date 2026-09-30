import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Plus,
  Play,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle
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

  // Filter tasks for this date (or fallback to all if tasks don't have explicit dates)
  const dayTasks = tasks;
  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Format date display
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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SQL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Core CS':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Frontend':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Aptitude':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Mock Interview':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getActionDetails = (task) => {
    if (task.action_route) {
      return { route: task.action_route, label: task.completed ? 'Review' : 'Start Practice' };
    }
    if (task.category === 'DSA') {
      return { route: '/dsa', label: task.completed ? 'Review' : 'Start Practice' };
    }
    if (task.category === 'SQL') {
      return { route: '/sql', label: task.completed ? 'Review' : 'Start Practice' };
    }
    if (task.category === 'Mock Interview') {
      return { route: '/mock-interviews', label: 'View Simulation' };
    }
    return { route: '/study-plan', label: task.completed ? 'Review' : 'View' };
  };

  return (
    <div className="space-y-4">
      {/* Day Header & Progress Bar */}
      <div className="p-4 rounded-xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {formatDateHeading(selectedDate)}
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{completedCount}</strong> / {totalCount} completed
            </span>
            <span>•</span>
            <span>{Math.round(totalCount * 0.5 * 10) / 10} hrs planned</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-36 sm:w-48">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">Day Progress</span>
              <span className="font-bold text-primary">{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      {dayTasks.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-card border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Task
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dayTasks.map((task) => {
            const isCompleted = task.completed;
            const action = getActionDetails(task);
            const isMenuOpen = activeMenuTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-card/40 border-border/40 opacity-80'
                    : 'bg-card border-border/70 hover:border-primary/40 shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Title + Badges */}
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 sm:mt-0 text-muted-foreground hover:text-primary transition-colors shrink-0"
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/60 hover:text-primary" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px]">
                      {/* Category Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium border ${getCategoryBadgeClass(
                          task.category
                        )}`}
                      >
                        {task.category || 'DSA'}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium border ${getPriorityBadgeClass(
                          task.priority || 'Medium'
                        )}`}
                      >
                        {task.priority || 'Medium'}
                      </span>

                      {/* Duration */}
                      <span className="flex items-center gap-1 text-muted-foreground font-medium">
                        <Clock className="w-3 h-3" />
                        {task.duration || '30 min'}
                      </span>

                      {task.source === 'ai_generated' && (
                        <span className="flex items-center gap-0.5 text-primary text-[10px] font-semibold">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Action Button + Three-dot Menu */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 relative">
                  <Link
                    to={action.route}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25'
                    }`}
                  >
                    <span>{action.label}</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>

                  {/* Three-dot dropdown menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuTaskId(isMenuOpen ? null : task.id)}
                      className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Task options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-1 w-44 rounded-xl bg-card border border-border shadow-xl z-30 py-1 text-xs animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            setEditingTask(task);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-muted text-foreground transition-colors"
                        >
                          Edit Task
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onUpdateTask(task.id, {
                              scheduled_date: '2026-10-01'
                            });
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-muted text-foreground transition-colors"
                        >
                          Reschedule to Tomorrow
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onUpdateTask(task.id, {
                              priority: task.priority === 'High' ? 'Medium' : 'High'
                            });
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-muted text-foreground transition-colors"
                        >
                          Toggle Priority
                        </button>
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            setDeletingTask(task);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          Remove Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={onAddTask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={onUpdateTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onConfirm={onDeleteTask}
      />
    </div>
  );
}
