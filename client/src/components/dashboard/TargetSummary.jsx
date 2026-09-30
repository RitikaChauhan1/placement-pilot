import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Calendar, ArrowRight } from 'lucide-react';

export default function TargetSummary({ target }) {
  if (!target || !target.company) {
    return (
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Set your target company</h4>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400">Tell us where you are preparing to apply to personalize your roadmap.</p>
        </div>
        <Link
          to="/profile"
          className="btn-compact-primary text-xs"
        >
          <span>Set Target</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const { company, role, daysRemaining, targetDate, planRoute = '/study-plan' } = target;

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-3.5 border border-brand-200/50 dark:border-brand-900/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/70 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Company</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Primary Goal
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mt-0.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🎯 {company}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              • {role}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-brand-600 dark:text-brand-400">{daysRemaining} days remaining</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Target date: <strong className="text-slate-700 dark:text-slate-300 font-medium">{targetDate || '26 Oct 2026'}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 self-end sm:self-center">
        <Link
          to={planRoute}
          className="btn-compact-secondary group flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 border-brand-200/80 dark:border-brand-800/80 hover:bg-brand-50/80 dark:hover:bg-brand-950/50"
        >
          <span>View Preparation Plan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
