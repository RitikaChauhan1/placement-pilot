import React, { useState } from 'react';
import { Sparkles, RefreshCw, MoreVertical, Download, Sliders } from 'lucide-react';

export default function StudyPlanHeader({
  onRegenerateClick,
  onOpenHoursModal,
  plan
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Study Plan</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Get a personalized roadmap, daily tasks and continuous AI guidance for your placement preparation.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto relative">
        <button
          onClick={onRegenerateClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#11192e] hover:bg-[#16223d] text-slate-200 border border-slate-700/60 transition-colors shadow-xs active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Regenerate Plan</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg bg-[#11192e] hover:bg-[#16223d] text-slate-300 border border-slate-700/60 transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl z-30 py-1 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenHoursModal();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span>Adjust Study Hours</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  window.print();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-brand-400" />
                <span>Export / Print Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
