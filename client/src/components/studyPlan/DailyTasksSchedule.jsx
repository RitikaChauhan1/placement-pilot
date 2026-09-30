import React from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Clock,
  ExternalLink,
  CalendarCheck,
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export default function DailyTasksSchedule({
  tasks = [],
  onToggleTask,
  isToggling = false,
  dailyHours = 2
}) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const totalEstimatedMins = tasks.reduce((acc, t) => acc + (t.estimated_minutes || parseInt(t.duration, 10) || 30), 0);

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </span>
        );
    }
  };

  const getActionRoute = (task) => {
    if (task.action_route) return task.action_route;
    switch (task.category?.toUpperCase()) {
      case 'DSA':
        return '/dsa';
      case 'SQL':
      case 'DATABASE':
        return '/sql';
      case 'APTITUDE':
      case 'MOCK INTERVIEW':
        return '/mock-interviews';
      default:
        return '/dsa';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-4 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              SYNCHRONIZED DAILY ACTIONS
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              • Synced with Dashboard
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Today's Scheduled Tasks
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Total: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{totalEstimatedMins} min</strong> (~{dailyHours}h allocated)</span>
        </div>
      </div>

      {/* Adaptive Balance Notice */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Adaptive Schedule Active
          </span>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Tasks are dynamically curated from Phase 1 of your roadmap. As you check off tasks here or on your dashboard, your daily check-in activity and consistency streak update automatically.
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const route = getActionRoute(task);
          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/15 border-emerald-100/80 dark:border-emerald-900/30'
                  : 'bg-white dark:bg-[#0d121e] hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200/90 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                  className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'border border-slate-300 dark:border-slate-600 hover:border-brand-500'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Title & Description */}
                <div
                  onClick={() => onToggleTask(task.id)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <p
                    className={`text-xs sm:text-[13px] font-medium leading-snug transition-colors ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority, Duration & Action Link */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                {getPriorityBadge(task.priority)}

                <span className="hidden xs:flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{task.duration || `${task.estimated_minutes} min`}</span>
                </span>

                <Link
                  to={route}
                  className="btn-compact-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-700"
                >
                  <span>Practice</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
