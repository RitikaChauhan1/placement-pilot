import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

export default function EditAboutModal({
  isOpen,
  onClose,
  initialBio = '',
  onSave
}) {
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const maxLength = 1000;

  useEffect(() => {
    setBio(initialBio || '');
  }, [initialBio]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({ bio: bio.trim() });
      onClose();
    } catch (err) {
      console.error('Failed to save bio:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Edit About Me</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-medium text-slate-300 text-xs">
                About / Professional Summary
              </label>
              <span className={`text-[11px] ${bio.length > maxLength * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
                {bio.length} / {maxLength} characters
              </span>
            </div>
            <textarea
              rows={6}
              maxLength={maxLength}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your background, core strengths, career goals, and what you're passionate about building..."
              className="w-full p-3 rounded-xl bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#131b2e] hover:bg-[#1a253e] text-slate-300 border border-slate-700/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
