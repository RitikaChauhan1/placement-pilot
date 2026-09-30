import React, { useState, useEffect } from 'react';
import { X, Code2, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

const CODING_PLATFORMS = [
  'LeetCode',
  'CodeChef',
  'Codeforces',
  'HackerRank',
  'GeeksforGeeks',
  'GitHub',
  'Other'
];

export default function EditCodingProfileModal({ isOpen, onClose, onSave, profileItem = null }) {
  const [formData, setFormData] = useState({
    platform: 'LeetCode',
    username: '',
    url: '',
    rating: '',
    solved: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileItem) {
      setFormData({
        platform: profileItem.platform || 'LeetCode',
        username: profileItem.username || '',
        url: profileItem.url || '',
        rating: profileItem.rating || '',
        solved: profileItem.solved || profileItem.solved_count || ''
      });
    } else {
      setFormData({
        platform: 'LeetCode',
        username: '',
        url: '',
        rating: '',
        solved: ''
      });
    }
    setErrors({});
  }, [profileItem, isOpen]);

  if (!isOpen) return null;

  const validateUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username / handle is required';
    if (!formData.url.trim()) {
      errs.url = 'Profile URL is required';
    } else if (!validateUrl(formData.url.trim())) {
      errs.url = 'Please enter a valid URL (e.g. https://leetcode.com/...)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        platform: formData.platform,
        username: formData.username.trim(),
        url: formData.url.trim(),
        rating: formData.rating ? String(formData.rating).trim() : null,
        solved: formData.solved ? Number(formData.solved) || formData.solved : null,
        solved_count: formData.solved ? Number(formData.solved) || formData.solved : null
      };

      await onSave(payload, profileItem?.id);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save coding profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#11182c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {profileItem ? 'Edit Coding Profile' : 'Add Coding Profile'}
              </h3>
              <p className="text-xs text-slate-400">Link your competitive programming & coding platform accounts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-200">
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Platform <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {CODING_PLATFORMS.map(p => (
                <option key={p} value={p} className="bg-[#0e1424] text-slate-200">{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Username / Handle <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ritika_codes"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.username ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Profile URL <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://leetcode.com/u/ritika_codes"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
            </div>
            {errors.url && <p className="text-xs text-rose-400 mt-1">{errors.url}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Rating / Rank <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1850 (Knight), 4-Star"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Problems Solved <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 240"
                value={formData.solved}
                onChange={(e) => setFormData({ ...formData, solved: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-[#11182c]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
