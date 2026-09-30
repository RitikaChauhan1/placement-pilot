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
    'Mock Interview',
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
    'Mock Interview'
  ]);

  if (!isOpen) return null;

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-foreground">Select Preparation Focus</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
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
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{area}</span>
                </button>
              );
            })}
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
            onClick={() => {
              if (onSave) onSave(selectedAreas);
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            Save Focus Areas
          </button>
        </div>
      </div>
    </div>
  );
}
