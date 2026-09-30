import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function PreparationProgress({ progress }) {
  const overallReady = progress?.overallReady ?? 65;
  const categories = progress?.categories || [
    { name: 'DSA', score: 72, total: '48 / 65 Problems', route: '/dsa' },
    { name: 'SQL', score: 64, total: '32 / 50 Queries', route: '/sql' },
    { name: 'Core CS', score: 51, total: '24 / 45 Topics', route: '/study-plan' },
    { name: 'System Design', score: 58, total: '12 / 20 Concepts', route: '/study-plan' },
  ];

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-emerald-500 text-emerald-600 dark:text-emerald-400';
    if (score >= 55) return 'bg-brand-500 text-brand-600 dark:text-brand-400';
    return 'bg-amber-500 text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Readiness Status
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Preparation Progress
            </h3>
          </div>
          <div className="flex items-baseline gap-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {overallReady}%
            </span>
            <span className="text-2xs font-medium text-emerald-700 dark:text-emerald-300">
              Overall Ready
            </span>
          </div>
        </div>

        {/* Overall compact indicator */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallReady}%` }}
          />
        </div>

        {/* Category breakdown with compact progress bars */}
        <div className="space-y-3 pt-3.5">
          {categories.map((cat) => {
            const colorClass = getScoreColor(cat.score).split(' ')[0];
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {cat.total && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                        {cat.total}
                      </span>
                    )}
                    <span className="font-semibold text-slate-900 dark:text-white text-[11.5px]">
                      {cat.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/90 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${colorClass} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
        <Link
          to="/progress"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
