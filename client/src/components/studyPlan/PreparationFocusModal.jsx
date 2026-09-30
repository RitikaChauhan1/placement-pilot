import React, { useState } from 'react';
import { Target, X, Check } from 'lucide-react';

export default function PreparationFocusModal({
  isOpen,
  onClose,
  onSave
}) {
  const allFocusAreas = [
    'DSA',
    'SQL',
    'Core CS',
    'Aptitude',
    'Frontend',
    'Projects',
    'Mock interview',
    'System Design',
    'Java / Python',
    'DBMS'
  ];

  const [selectedAreas, setSelectedAreas] = useState([
    'DSA',
    'SQL',
    'Core CS',
    'Aptitude',
    'Frontend',
    'Projects',
    'Mock interview'
  ]);

  if (!isOpen) return null;

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Select Preparation Focus</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-400">
            Select the domains that should be prioritized in your study roadmap and daily tasks:
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {allFocusAreas.map((area) => {
              const isSelected = selectedAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                      : 'bg-[#131b2e] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{area}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSave) onSave(selectedAreas);
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors"
          >
            Save Focus Areas
          </button>
        </div>
      </div>
    </div>
  );
}
