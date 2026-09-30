import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, History, X, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-foreground">Regenerate Study Plan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          <p className="text-foreground leading-relaxed">
            Your current plan contains <strong>{completedTasksCount} completed tasks</strong> and diagnostic progress. Would you like AI to generate an updated version while preserving your history?
          </p>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveCompleted}
                onChange={(e) => setPreserveCompleted(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="font-semibold text-foreground block">
                  Preserve Completed Tasks & Progress History
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Keeps all already-solved problems and marked check-ins intact.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1 text-xs">
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
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            {isProcessing ? 'Generating AI Plan...' : 'Regenerate Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
