import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Clock,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  CalendarCheck2,
  ExternalLink
} from 'lucide-react';

export default function TodaysPlan({
  tasks = [],
  summary = {},
  continueLearning = {},
  onToggleTask,
  onAddTask,
  isToggling = false
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('DSA');
  const [newTaskDuration, setNewTaskDuration] = useState('30 min');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Resolve category badges
  const getCategoryStyles = (category) => {
    switch (category?.toUpperCase()) {
      case 'DSA':
        return 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60';
      case 'SQL':
      case 'DATABASE':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      case 'CORE CS':
      case 'OS':
      case 'NETWORKS':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60';
      case 'APTITUDE':
        return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  // Resolve route from category
  const getCategoryRoute = (category) => {
    switch (category?.toUpperCase()) {
      case 'DSA':
        return '/dsa';
      case 'SQL':
      case 'DATABASE':
        return '/sql';
      case 'CORE CS':
      case 'APTITUDE':
        return '/study-plan';
      default:
        return '/dsa';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddTask({
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        duration: newTaskDuration || '30 min',
      });
      setNewTaskTitle('');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve continue learning resume link
  const firstUnfinishedTask = tasks.find((t) => !t.completed);
  const continueRoute = continueLearning?.route || (firstUnfinishedTask ? getCategoryRoute(firstUnfinishedTask.category) : '/dsa');
  const continueActivityTitle = continueLearning?.title || (firstUnfinishedTask ? firstUnfinishedTask.title : 'Binary Search — Question 3 of 5');

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-4 transition-all">
      {/* 1. Header with title & completion count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              PRIMARY GOAL FOR TODAY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              TODAY'S PLAN
            </h2>
            <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300">
              {completedCount} / {totalCount} completed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-compact-secondary text-xs"
            aria-label="Add custom task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* 2. Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Daily Completion</span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">{completionPercentage}%</span>
        </div>
      </div>

      {/* 3. Continue Learning CTA Card (Prominent) */}
      <div className="bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-white dark:from-brand-950/40 dark:via-indigo-950/30 dark:to-[#111827] rounded-lg p-3 sm:p-3.5 border border-brand-200/70 dark:border-brand-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Continue Learning</span>
            </div>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white mt-0.5">
              {continueActivityTitle}
            </p>
          </div>
        </div>

        <Link
          to={continueRoute}
          className="btn-compact-primary self-start sm:self-center text-xs whitespace-nowrap group"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4. Add Task Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleFormSubmit}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2.5 animate-fadeIn"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Solve 3 Binary Tree problems or Revise SQL Window Functions"
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md outline-none focus:ring-1 focus:ring-brand-500"
            required
            autoFocus
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md outline-none"
              >
                <option value="DSA">DSA</option>
                <option value="SQL">SQL</option>
                <option value="Core CS">Core CS</option>
                <option value="Aptitude">Aptitude</option>
              </select>
              <input
                type="text"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                placeholder="Duration (e.g. 30 min)"
                className="w-24 px-2 py-1 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-compact-primary py-1 text-xs"
              >
                {isSubmitting ? 'Adding...' : 'Save Task'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 5. Today's Task Items List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your day is clear 🎉</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Create your first study task or generate a preparation plan to start building your streak.
            </p>
            <div className="pt-1">
              <Link to="/study-plan" className="btn-compact-primary text-xs">
                Create Study Plan
              </Link>
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const categoryRoute = getCategoryRoute(task.category);
            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                  task.completed
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/15 border-emerald-100/80 dark:border-emerald-900/30'
                    : 'bg-white dark:bg-[#0d121e] hover:bg-slate-50/90 dark:hover:bg-slate-800/50 border-slate-200/90 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Completion Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                    className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Task Content */}
                  <div
                    onClick={() => onToggleTask(task.id)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p
                      className={`text-xs sm:text-[13px] font-medium leading-snug transition-colors ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300'
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                  {/* Category Pill */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryStyles(
                      task.category
                    )}`}
                  >
                    {task.category}
                  </span>

                  {/* Estimated Time */}
                  <span className="hidden xs:flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{task.duration || '30 min'}</span>
                  </span>

                  {/* Practice Shortcut Link */}
                  <Link
                    to={categoryRoute}
                    title={`Practice ${task.category}`}
                    className="p-1 rounded text-slate-400 hover:text-brand-600 dark:text-slate-500 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
