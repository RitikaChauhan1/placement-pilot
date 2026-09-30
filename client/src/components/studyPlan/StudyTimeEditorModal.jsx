import React, { useState } from 'react';
import { Clock, X, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-foreground">Adjust Study Time</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-foreground mb-1.5">
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
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1.5">
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
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {hrs} hr{hrs > 1 ? 's' : ''}/d
                </button>
              ))}
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            {saving ? 'Saving...' : 'Save Study Hours'}
          </button>
        </div>
      </div>
    </div>
  );
}
