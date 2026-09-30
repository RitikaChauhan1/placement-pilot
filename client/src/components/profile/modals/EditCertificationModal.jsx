import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ExternalLink, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditCertificationModal({ isOpen, onClose, onSave, certItem = null }) {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (certItem) {
      setFormData({
        name: certItem.name || certItem.title || '',
        issuer: certItem.issuer || certItem.organization || '',
        issue_date: certItem.issue_date || certItem.date || '',
        expiry_date: certItem.expiry_date || '',
        credential_id: certItem.credential_id || '',
        credential_url: certItem.credential_url || certItem.url || ''
      });
    } else {
      setFormData({
        name: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: ''
      });
    }
    setErrors({});
  }, [certItem, isOpen]);

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
    if (!formData.name.trim()) errs.name = 'Certification name is required';
    if (!formData.issuer.trim()) errs.issuer = 'Issuing organization is required';
    if (!formData.issue_date.trim()) errs.issue_date = 'Issue date is required';
    if (formData.credential_url && !validateUrl(formData.credential_url)) {
      errs.credential_url = 'Please enter a valid URL (e.g. https://...)';
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
        name: formData.name.trim(),
        title: formData.name.trim(),
        issuer: formData.issuer.trim(),
        organization: formData.issuer.trim(),
        issue_date: formData.issue_date.trim(),
        date: formData.issue_date.trim(),
        expiry_date: formData.expiry_date.trim(),
        credential_id: formData.credential_id.trim(),
        credential_url: formData.credential_url.trim(),
        url: formData.credential_url.trim()
      };

      await onSave(payload, certItem?.id);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save certification. Please try again.' });
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
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {certItem ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <p className="text-xs text-slate-400">Add verified badges, licenses, and course completions</p>
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
              Certification Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AWS Certified Cloud Practitioner, Meta Frontend Developer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.name ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Issuing Organization <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Amazon Web Services, Coursera, Google"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.issuer ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.issuer && <p className="text-xs text-rose-400 mt-1">{errors.issuer}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Issue Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. June 2024 or 06/2024"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.issue_date ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs`}
              />
              {errors.issue_date && <p className="text-xs text-rose-400 mt-1">{errors.issue_date}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Expiry Date <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. June 2027 or No Expiry"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Credential ID <span className="text-slate-500 text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AWS-CCP-1234567"
              value={formData.credential_id}
              onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Credential / Verification URL
            </label>
            <div className="relative">
              <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://www.credly.com/badges/..."
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.credential_url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
            </div>
            {errors.credential_url && <p className="text-xs text-rose-400 mt-1">{errors.credential_url}</p>}
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
