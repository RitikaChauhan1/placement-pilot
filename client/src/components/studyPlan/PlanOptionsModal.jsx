import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  RotateCcw,
  Clock,
  Building2,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function PlanOptionsModal({
  isOpen,
  onClose,
  plan,
  onRegenerate,
  onAdjustHours,
  isRegenerating = false
}) {
  const [showConfirmRegen, setShowConfirmRegen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(plan?.daily_study_hours || 2);
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Preparation Plan Options
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {showConfirmRegen ? (
            /* Confirmation for Regenerate */
            <div className="space-y-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200">
                    Confirm Roadmap Regeneration
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11.5px]">
                    Regenerating your roadmap may reorganize upcoming phases and tasks according to your latest profile. <strong>Completed tasks will remain safely preserved in your history.</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                <button
                  type="button"
                  onClick={() => setShowConfirmRegen(false)}
                  className="btn-compact-secondary py-1 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isRegenerating}
                  onClick={() => {
                    onRegenerate();
                    setShowConfirmRegen(false);
                    onClose();
                  }}
                  className="btn-compact-primary py-1 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isRegenerating ? 'Regenerating...' : 'Yes, Regenerate Plan'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Option 1: Regenerate Plan */}
              <button
                type="button"
                onClick={() => setShowConfirmRegen(true)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      Regenerate Roadmap
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Re-synthesize timeline & daily tasks based on latest progress
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Adjust Study Time */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Adjust Daily Study Hours
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setSelectedHours(h);
                        onAdjustHours(h);
                      }}
                      className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-all ${
                        selectedHours === h
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {h === 4 ? '4+ h' : `${h}h`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Change Target Company / Role */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/profile');
                }}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      Change Placement Target
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Update company, role, or target interview date
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d121c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-compact-secondary py-1 px-3 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
