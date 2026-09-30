import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  GitCommit,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function RoadmapTab({
  plan,
  phases = [],
  tasks = [],
  onSelectTopic
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'
  const [expandedPhaseId, setExpandedPhaseId] = useState(phases[0]?.id || 1);

  const daysRemaining = plan?.days_remaining || 26;
  const phaseCount = phases.length || 5;
  const totalTasksCount = Math.max(tasks.length, 68);

  const toggleExpand = (phaseId) => {
    setExpandedPhaseId((prev) => (prev === phaseId ? null : phaseId));
  };

  // Helper to parse phase topics
  const getTopics = (phase) => {
    if (!phase.topics) return [];
    if (typeof phase.topics === 'string') {
      try {
        return JSON.parse(phase.topics);
      } catch {
        return [];
      }
    }
    return phase.topics;
  };

  return (
    <div className="space-y-4">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Your Personalized Roadmap</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="font-semibold text-foreground/90">{daysRemaining} Days</span> •{' '}
            <span className="font-semibold text-foreground/90">{phaseCount} Phases</span> •{' '}
            <span className="font-semibold text-foreground/90">{totalTasksCount} Curated Tasks</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-card border border-border text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>

          <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border text-muted-foreground flex items-center gap-1.5">
            <span>{daysRemaining} Days Plan</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Grid or Timeline Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase, idx) => {
            const topics = getTopics(phase);
            const isExpanded = expandedPhaseId === phase.id;
            const isPhase1 = idx === 0;
            const progressPct = isPhase1 ? 80 : idx === 1 ? 25 : 0;
            const startDay = idx === 0 ? 1 : idx === 1 ? 8 : idx === 2 ? 15 : idx === 3 ? 20 : 24;
            const endDay = idx === 0 ? 7 : idx === 1 ? 14 : idx === 2 ? 19 : idx === 3 ? 23 : 26;

            return (
              <div
                key={phase.id || idx}
                className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                  isPhase1
                    ? 'border-primary/50 bg-card shadow-md shadow-primary/5'
                    : 'border-border/70 bg-card hover:border-border'
                }`}
              >
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      PHASE {phase.phase_number || idx + 1}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      Days {startDay}–{endDay}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mt-1.5">
                    {phase.name?.replace(/^Phase \d+ — /, '') || `Phase ${idx + 1}`}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground text-[11px]">Progress</span>
                      <span className="font-bold text-foreground text-[11px]">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Topics Preview / Full */}
                <div className="p-4 flex-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Topics
                  </div>

                  <div className="space-y-1.5">
                    {(isExpanded ? topics : topics.slice(0, 5)).map((t, tIdx) => {
                      const topicName = typeof t === 'string' ? t : t.name;
                      const isDone = typeof t === 'object' ? t.status === 'completed' : isPhase1 && tIdx < 3;

                      return (
                        <div
                          key={tIdx}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className={`truncate ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {topicName}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {!isExpanded && topics.length > 5 && (
                      <div className="text-[11px] font-medium text-primary pt-1 pl-2">
                        +{topics.length - 5} more topics
                      </div>
                    )}
                  </div>
                </div>

                {/* Expand / Collapse Footer */}
                <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(phase.id)}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Phase Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] text-muted-foreground">
                    {topics.length} topics
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Timeline View */
        <div className="space-y-4 py-2">
          {phases.map((phase, idx) => {
            const topics = getTopics(phase);
            const isPhase1 = idx === 0;
            const startDay = idx === 0 ? 1 : idx === 1 ? 8 : idx === 2 ? 15 : idx === 3 ? 20 : 24;
            const endDay = idx === 0 ? 7 : idx === 1 ? 14 : idx === 2 ? 19 : idx === 3 ? 23 : 26;
            const progressPct = isPhase1 ? 80 : idx === 1 ? 25 : 0;

            return (
              <div key={phase.id || idx} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isPhase1
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < phases.length - 1 && <div className="w-0.5 h-24 bg-border my-1" />}
                </div>

                <div className="flex-1 p-4 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Days {startDay}–{endDay}
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-0.5">
                        {phase.name?.replace(/^Phase \d+ — /, '')}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">{progressPct}% complete</span>
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">{phase.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {topics.map((t, tIdx) => {
                      const topicName = typeof t === 'string' ? t : t.name;
                      const isDone = typeof t === 'object' ? t.status === 'completed' : isPhase1 && tIdx < 3;
                      return (
                        <span
                          key={tIdx}
                          className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 border ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-muted/60 text-foreground/80 border-border/60'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Circle className="w-3 h-3 text-muted-foreground" />
                          )}
                          {topicName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
