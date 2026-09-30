import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  task,
  onConfirm
}) {
  if (!isOpen || !task) return null;

  const isCompleted = task.completed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-destructive/30 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-destructive">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <h3 className="text-base font-bold text-foreground">Remove Study Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-semibold text-foreground">"{task.title}"</span> from your study plan?
          </p>

          {isCompleted && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
              ⚠️ <strong>Note:</strong> This task has already been completed. Removing it from your daily schedule will NOT erase your completed practice history or streak points.
            </div>
          )}
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
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors"
          >
            Yes, Remove Task
          </button>
        </div>
      </div>
    </div>
  );
}
