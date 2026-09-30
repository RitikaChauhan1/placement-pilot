import React, { useState, useEffect } from 'react';
import { X, Award, ExternalLink, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditAchievementModal({ isOpen, onClose, onSave, achievementItem = null }) {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    url: '',
    certificate_url: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (achievementItem) {
      setFormData({
        title: achievementItem.title || '',
        organization: achievementItem.organization || achievementItem.issuer || '',
        date: achievementItem.date || achievementItem.year || '',
        description: achievementItem.description || '',
        url: achievementItem.url || '',
        certificate_url: achievementItem.certificate_url || ''
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        date: '',
        description: '',
        url: '',
        certificate_url: ''
      });
    }
    setErrors({});
  }, [achievementItem, isOpen]);

  if (!isOpen) return null;

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Achievement title is required';
    if (!formData.organization.trim()) errs.organization = 'Organization / Issuer is required';
    if (!formData.date.trim()) errs.date = 'Date or year is required';
    if (formData.url && !validateUrl(formData.url)) {
      errs.url = 'Please enter a valid URL';
    }
    if (formData.certificate_url && !validateUrl(formData.certificate_url)) {
      errs.certificate_url = 'Please enter a valid certificate/proof URL';
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
        title: formData.title.trim(),
        organization: formData.organization.trim(),
        issuer: formData.organization.trim(),
        date: formData.date.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        certificate_url: formData.certificate_url.trim()
      };

      await onSave(payload, achievementItem?.id);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save achievement. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#11182c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {achievementItem ? 'Edit Achievement' : 'Add Achievement'}
              </h3>
              <p className="text-xs text-slate-400">Hackathon victories, honors, contest ranks, and recognitions</p>
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
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Winner - Smart India Hackathon, Top 1% Global Rank"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.title ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Organization / Event <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Smart India Hackathon, LeetCode"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.organization ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.organization && <p className="text-xs text-rose-400 mt-1">{errors.organization}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date / Year <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dec 2024 or 2024"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.date ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What did you achieve? Outline team size, problem solved, or prize awarded."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Event / Proof URL
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {errors.url && <p className="text-xs text-rose-400 mt-1">{errors.url}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Certificate URL
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.certificate_url}
                  onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.certificate_url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {errors.certificate_url && <p className="text-xs text-rose-400 mt-1">{errors.certificate_url}</p>}
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
