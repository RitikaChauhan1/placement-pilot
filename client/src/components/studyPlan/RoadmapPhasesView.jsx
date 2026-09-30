import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  MoreVertical,
  RotateCcw
} from 'lucide-react';

export default function RoadmapPhasesView({
  plan,
  phases = [],
  onOpenOptionsModal
}) {
  // Keep first phase open by default
  const [expandedPhases, setExpandedPhases] = useState({ 0: true });

  const togglePhase = (index) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getTopicIcon = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-emerald-500 font-bold text-xs">✓</span>;
      case 'in_progress':
        return <span className="text-brand-600 dark:text-brand-400 font-bold text-xs">→</span>;
      default:
        return <span className="text-slate-400 dark:text-slate-600 text-xs">○</span>;
    }
  };

  const getPhaseBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-4 transition-all">
      {/* Title & Roadmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              ROADMAP TIMELINE
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              • Version {plan?.version || 1}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Your AI Preparation Roadmap
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenOptionsModal}
            className="btn-compact-secondary text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Plan Options</span>
          </button>
        </div>
      </div>

      {/* AI Explanation Box "Why this plan?" */}
      {plan?.why_this_plan && (
        <div className="p-3.5 bg-gradient-to-r from-brand-50/60 via-indigo-50/40 to-slate-50/50 dark:from-brand-950/40 dark:via-indigo-950/30 dark:to-slate-900/40 border border-brand-200/70 dark:border-brand-800/60 rounded-xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-brand-800 dark:text-brand-300 text-2xs uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Why this plan?</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[12.5px]">
            {plan.why_this_plan}
          </p>
        </div>
      )}

      {/* Phases Accordion List */}
      <div className="space-y-2.5 pt-1">
        {phases.map((phase, idx) => {
          const isExpanded = !!expandedPhases[idx];
          const topics = Array.isArray(phase.topics)
            ? phase.topics
            : typeof phase.topics === 'string'
            ? JSON.parse(phase.topics || '[]')
            : [];

          return (
            <div
              key={phase.id || idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-brand-300 dark:border-brand-800/80 bg-white dark:bg-[#0e1422] shadow-xs'
                  : 'border-slate-200/80 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Header Toggle Button */}
              <button
                type="button"
                onClick={() => togglePhase(idx)}
                className="w-full p-3 sm:p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-white truncate">
                      {phase.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Duration: {phase.duration_days || phase.durationDays} days • {topics.length} core topics
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {getPhaseBadge(phase.status)}
                </div>
              </button>

              {/* Expandable Phase Details */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fadeIn">
                  {phase.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      {phase.description}
                    </p>
                  )}

                  {/* Topics Checklist */}
                  <div className="space-y-1.5">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Topic Breakdown & Progress
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topics.map((t, tIdx) => {
                        const topicName = typeof t === 'string' ? t : t.name;
                        const topicStatus = typeof t === 'string' ? 'upcoming' : t.status || 'upcoming';
                        return (
                          <div
                            key={tIdx}
                            className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              {getTopicIcon(topicStatus)}
                            </div>
                            <span className="truncate">{topicName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
