import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';

export default function StudyTimeEditorModal({
  isOpen,
  onClose,
  currentWeekdayHours = 2,
  onSave
}) {
  const [weekdayHours, setWeekdayHours] = useState(currentWeekdayHours);
  const [weekendHours, setWeekendHours] = useState(Math.min(6, currentWeekdayHours + 2));
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(weekdayHours);
      onClose();
    } catch (err) {
      console.error('Failed to update study hours:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/25">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Adjust Study Time</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Monday – Friday (Weekdays)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setWeekdayHours(hrs)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    weekdayHours === hrs
                      ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                      : 'bg-[#131b2e] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Saturday – Sunday (Weekends)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 6].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setWeekendHours(hrs)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    weekendHours === hrs
                      ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                      : 'bg-[#131b2e] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors"
          >
            {saving ? 'Saving...' : 'Save Study Hours'}
          </button>
        </div>
      </div>
    </div>
  );
}
