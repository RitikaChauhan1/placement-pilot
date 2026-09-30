import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateProfileCompletion } from '../../utils/profileCompletion';

export default function ProfileCompletion({ profile = {}, onNavigateTab, onCompleteClick }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const completion = calculateProfileCompletion(profile);

  const handleAction = () => {
    if (onCompleteClick) {
      onCompleteClick(completion.nextIncomplete);
    } else if (completion.nextIncomplete && onNavigateTab) {
      onNavigateTab(completion.nextIncomplete.tab);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Title + Bar + Description */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Profile Completion
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                {completion.completedCount}/{completion.totalCount} completed
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {completion.percentage}%
              </span>
              <button
                type="button"
                onClick={() => setShowBreakdown((prev) => !prev)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                title="Toggle completion breakdown"
              >
                {showBreakdown ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, Math.min(100, completion.percentage))}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete your profile to improve your placement profile and recruiter discovery.
          </p>
        </div>

        {/* Right: CTA Button */}
        <div className="flex-shrink-0 sm:self-center">
          <button
            type="button"
            onClick={handleAction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800/60 transition-all shadow-2xs hover:gap-2 cursor-pointer"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 animate-fadeIn">
          {completion.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateTab && onNavigateTab(item.tab)}
              className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors cursor-pointer group"
            >
              {item.isFilled ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0 group-hover:text-brand-500" />
              )}
              <span
                className={`text-[11px] truncate ${
                  item.isFilled
                    ? 'text-slate-700 dark:text-slate-300 font-medium'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
