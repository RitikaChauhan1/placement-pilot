import React, { useState } from 'react';
import { Sparkles, RefreshCw, MoreVertical, Download, Sliders, Calendar } from 'lucide-react';

export default function StudyPlanHeader({
  onRegenerateClick,
  onOpenHoursModal,
  plan
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 flex items-center justify-center border border-primary/30 text-primary">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Study Plan</h1>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/25">
            Personalized v{plan?.version || 1}.0
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
          Get a personalized roadmap, daily tasks and continuous AI guidance for your placement preparation.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto relative">
        <button
          onClick={onRegenerateClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-[0.98]"
          title="Regenerate plan with updated profile benchmarks while preserving completed progress"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate Plan</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl z-30 py-1 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenHoursModal();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Adjust Study Hours</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  window.print();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Export / Print Roadmap</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
