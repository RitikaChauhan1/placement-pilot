import React from 'react';
import { Flame, Award } from 'lucide-react';

export default function StreakSummary({ streak = 7, bestStreak = 12 }) {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-500/15 dark:via-orange-500/10 rounded-xl p-3.5 border border-amber-200/70 dark:border-amber-900/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {streak} Day Streak
              </h4>
              <span className="text-xs">🔥</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You've been consistent for {streak} days!
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Best Record
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
            <Award className="w-3 h-3" />
            {bestStreak} days
          </span>
        </div>
      </div>
    </div>
  );
}
