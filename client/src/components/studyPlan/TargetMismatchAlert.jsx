import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export default function TargetMismatchAlert({
  mismatch,
  onAdapt,
  onKeep,
  isAdapting = false
}) {
  if (!mismatch) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl p-4 shadow-xs space-y-3 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
            Target Mismatch Detected
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
            Your active roadmap was generated for{' '}
            <strong className="font-semibold underline">{mismatch.planTargetCompany} ({mismatch.planTargetRole})</strong>,
            but your profile target is now set to{' '}
            <strong className="font-semibold underline">{mismatch.currentProfileCompany} ({mismatch.currentProfileRole})</strong>.
          </p>
          <p className="text-[11.5px] text-amber-700 dark:text-amber-400 mt-1">
            Would you like to adapt your upcoming preparation plan while preserving your completed tasks?
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pl-11">
        <button
          type="button"
          disabled={isAdapting}
          onClick={onAdapt}
          className="btn-compact-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAdapting ? 'animate-spin' : ''}`} />
          <span>{isAdapting ? 'Adapting Plan...' : `Adapt Plan for ${mismatch.currentProfileCompany}`}</span>
        </button>
        <button
          type="button"
          disabled={isAdapting}
          onClick={onKeep}
          className="btn-compact-secondary text-xs py-1.5 px-3"
        >
          Keep Current Plan
        </button>
      </div>
    </div>
  );
}
