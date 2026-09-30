import React from 'react';
import {
  Sparkles,
  X,
  MinusCircle,
  PlusCircle,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AIChangePreviewModal({
  isOpen,
  onClose,
  proposal,
  onApply,
  isApplying
}) {
  if (!isOpen || !proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">AI Plan Change Diff</h3>
              <p className="text-[11px] text-muted-foreground">Preview proposed modifications before applying</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Sections */}
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-1 text-xs sm:text-sm">
          {/* Removals */}
          {proposal.removals && proposal.removals.length > 0 && (
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-1.5 font-bold text-red-400 text-xs uppercase tracking-wider mb-2">
                <MinusCircle className="w-3.5 h-3.5" />
                <span>Remove From Roadmap</span>
              </div>
              <div className="space-y-1.5">
                {proposal.removals.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-card/60">
                    <span className="font-semibold text-foreground/90">{r.topic}</span>
                    <span className="text-muted-foreground text-[11px]">{r.sessionsCount} sessions</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additions */}
          {proposal.additions && proposal.additions.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add To Roadmap</span>
              </div>
              <div className="space-y-1.5">
                {proposal.additions.map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-card/60">
                    <span className="font-semibold text-foreground/90">{a.topic}</span>
                    <span className="text-emerald-400 text-[11px] font-medium">
                      {a.sessionsCount} sessions • {a.duration || '30 min'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reschedules */}
          {proposal.reschedules && proposal.reschedules.length > 0 && (
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-1.5 font-bold text-blue-400 text-xs uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Rescheduled Sessions</span>
              </div>
              <div className="space-y-1.5">
                {proposal.reschedules.map((resch, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-card/60">
                    <span className="text-foreground/90">{resch.taskTitle}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      {resch.fromDay} <ArrowRight className="w-2.5 h-2.5" /> {resch.toDay}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule & Time */}
          {proposal.schedule && (
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-400 text-xs uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Target Study Pacing</span>
              </div>
              <div className="text-foreground/90 flex flex-col gap-1">
                <div>• Monday–Friday: <strong className="text-foreground">{proposal.schedule.weekdayHours} hours/day</strong></div>
                <div>• Saturday–Sunday: <strong className="text-foreground">{proposal.schedule.weekendHours} hours/day</strong></div>
              </div>
            </div>
          )}

          {/* Impact */}
          <div className="p-3 rounded-xl bg-card border border-border text-xs">
            <span className="font-semibold text-muted-foreground uppercase text-[10px] block mb-1">
              Estimated Plan Impact
            </span>
            <p className="text-foreground font-medium">
              {proposal.timeImpact || 'No deadline extension required. All sessions fit comfortably inside your 26-day timeline.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={isApplying}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center gap-1.5"
          >
            {isApplying ? (
              <span>Applying Changes...</span>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
