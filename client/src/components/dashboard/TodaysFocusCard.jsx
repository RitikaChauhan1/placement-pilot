import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Code2,
  Zap,
  Target
} from 'lucide-react';
import { DEFAULT_TODAYS_FOCUS } from '../../data/mockFocus';

export default function TodaysFocusCard({ focus = DEFAULT_TODAYS_FOCUS }) {
  const navigate = useNavigate();

  const data = focus || DEFAULT_TODAYS_FOCUS;

  const handleStartSession = () => {
    navigate(data.targetRoute || '/dsa', {
      state: {
        focusTopic: data.title,
        category: data.category,
        difficulty: data.difficulty
      }
    });
  };

  // Color mapping for difficulty
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50';
      case 'hard':
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/50';
      case 'medium':
      default:
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-colors relative overflow-hidden group hover:border-brand-300 dark:hover:border-brand-700/60 transition-all">
      {/* Subtle background glow highlight */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>TODAY'S FOCUS</span>
        </div>

        {/* AI Recommended Badge */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60 shadow-2xs">
          <Sparkles className="w-2.5 h-2.5 text-brand-600 dark:text-brand-400" />
          <span>{data.badge || 'AI RECOMMENDED'}</span>
        </span>
      </div>

      {/* Main Content: Topic Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {data.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Metadata Pill Strip */}
      <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
        {/* Category Pill */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
          <Code2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>{data.category}</span>
        </span>

        {/* Difficulty Pill */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] border ${getDifficultyBadge(data.difficulty)}`}>
          {data.difficulty}
        </span>

        {/* Separator Bullet */}
        <span className="text-slate-300 dark:text-slate-700 select-none">•</span>

        {/* Problem Count */}
        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11.5px]">
          {data.taskCount} {data.taskCount === 1 ? 'Problem' : 'Problems'}
        </span>

        {/* Separator Bullet */}
        <span className="text-slate-300 dark:text-slate-700 select-none">•</span>

        {/* Estimated Duration */}
        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11.5px]">
          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span>{data.estimatedMinutes} min</span>
        </span>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleStartSession}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-lg shadow-sm shadow-brand-500/15 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer w-full sm:w-auto"
        >
          <span>Start Session</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
