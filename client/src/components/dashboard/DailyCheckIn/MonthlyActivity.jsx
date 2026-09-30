import React from 'react';

export default function MonthlyActivity({
  activeDays = 18,
  totalSessions = 24,
  percentage = 60
}) {
  return (
    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          This Month
        </span>
        <span className="font-bold text-brand-600 dark:text-brand-400">
          {percentage}%
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>{activeDays} days active</span>
        <span>•</span>
        <span>{totalSessions} total sessions</span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
