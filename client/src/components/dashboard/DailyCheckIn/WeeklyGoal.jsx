import React from 'react';
import { Target } from 'lucide-react';

export default function WeeklyGoal({ completedDays = 4, targetDays = 5, percentage = 80 }) {
  const calculatedPercent = targetDays > 0 ? Math.min(100, Math.round((completedDays / targetDays) * 100)) : percentage;

  return (
    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Weekly Goal</span>
        </span>
        <span className="font-bold text-slate-900 dark:text-white">
          {completedDays} / {targetDays} days
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${calculatedPercent}%` }}
        />
      </div>
    </div>
  );
}
