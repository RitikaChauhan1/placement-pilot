import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function PlanRegenerationModal({
  isOpen,
  onClose,
  onConfirmRegenerate,
  completedTasksCount = 0
}) {
  const [preserveCompleted, setPreserveCompleted] = useState(true);
  const [dailyHours, setDailyHours] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirmRegenerate({
        dailyStudyHours: dailyHours,
        preserveCompleted
      });
      onClose();
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Regenerate Study Plan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          <p className="text-slate-300 leading-relaxed">
            Your current plan contains <strong>{completedTasksCount} completed tasks</strong> and progress. Would you like AI to generate an updated version while preserving your history?
          </p>

          <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveCompleted}
                onChange={(e) => setPreserveCompleted(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-white block">
                  Preserve Completed Tasks & Progress History
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Keeps all already-solved problems and marked check-ins intact.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5 text-xs">
              Daily Study Time Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDailyHours(hrs)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    dailyHours === hrs
                      ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                      : 'bg-[#131b2e] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors"
          >
            {isProcessing ? 'Generating...' : 'Regenerate Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
