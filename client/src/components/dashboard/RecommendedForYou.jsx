import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, Zap, Target } from 'lucide-react';

export default function RecommendedForYou({ recommendation }) {
  const rec = recommendation || {
    title: 'Revise SQL Joins',
    category: 'SQL',
    accuracy: '61%',
    reason: "Your recent accuracy is 61% and you haven't practiced this topic for 5 days.",
    duration: '30 min',
    route: '/sql',
    badge: 'Recommended for You',
    actionLabel: 'Start Practice'
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all h-full">
      <div>
        {/* Header badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-2xs font-semibold">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Recommended for You</span>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{rec.duration || '30 min'}</span>
          </span>
        </div>

        {/* Topic Title */}
        <div className="mt-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{rec.title}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {rec.category}
            </span>
          </h3>

          {/* Reason / Context */}
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {rec.reason}
          </p>
        </div>

        {/* Insight tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {rec.accuracy && (
            <div className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-[11px] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Topic Accuracy: {rec.accuracy}</span>
            </div>
          )}
          <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
            Campus Drive High-Frequency
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          to={rec.route || '/sql'}
          className="btn-compact-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 group"
        >
          <span>{rec.actionLabel || 'Start Practice'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
