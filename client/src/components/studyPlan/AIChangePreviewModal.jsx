import React from 'react';
import {
  Sparkles,
  X,
  MinusCircle,
  PlusCircle,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Plan Change Diff</h3>
              <p className="text-[11px] text-slate-400">Preview proposed modifications before applying</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
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
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#131b2e] border border-slate-800/60">
                    <span className="font-semibold text-slate-200">{r.topic}</span>
                    <span className="text-slate-400 text-[11px]">{r.sessionsCount} sessions</span>
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
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#131b2e] border border-slate-800/60">
                    <span className="font-semibold text-slate-200">{a.topic}</span>
                    <span className="text-emerald-400 text-[11px] font-medium">
                      {a.sessionsCount} sessions • {a.duration || '30 min'}
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
              <div className="text-slate-300 flex flex-col gap-1">
                <div>• Monday–Friday: <strong className="text-white">{proposal.schedule.weekdayHours} hours/day</strong></div>
                <div>• Saturday–Sunday: <strong className="text-white">{proposal.schedule.weekendHours} hours/day</strong></div>
              </div>
            </div>
          )}

          {/* Impact */}
          <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800/80 text-xs">
            <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">
              Estimated Plan Impact
            </span>
            <p className="text-slate-200 font-medium">
              {proposal.timeImpact || 'No deadline extension required. Fits comfortably within your timeline.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={isApplying}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-colors flex items-center gap-1.5"
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
