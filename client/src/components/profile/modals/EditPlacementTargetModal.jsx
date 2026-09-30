import React, { useState, useEffect } from 'react';
import { X, Target, Building2, Calendar, Briefcase, DollarSign, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const COMMON_ROLES = [
  'Software Development Engineer (SDE)',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Engineer',
  'Data Analyst / Scientist',
  'AI / ML Engineer',
  'DevOps / Cloud Engineer',
  'Systems Engineer'
];

const JOB_TYPES = [
  'Full-time (Campus Placement)',
  'Internship (Pre-placement Offer)',
  'Summer Internship',
  'Remote / Hybrid Full-time'
];

export default function EditPlacementTargetModal({ isOpen, onClose, onSave, targetData = null }) {
  const [formData, setFormData] = useState({
    role: 'Software Development Engineer',
    target_date: '',
    readiness: 75,
    target_salary: '',
    job_type: 'Full-time (Campus Placement)',
    preferred_technologies: ''
  });

  const [companies, setCompanies] = useState(['Accenture', 'Google', 'Microsoft']);
  const [newCompany, setNewCompany] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (targetData) {
      setFormData({
        role: targetData.role || targetData.target_role || 'Software Development Engineer',
        target_date: targetData.target_date || targetData.target_interview_date || '',
        readiness: targetData.readiness || 75,
        target_salary: targetData.target_salary || '',
        job_type: targetData.job_type || 'Full-time (Campus Placement)',
        preferred_technologies: Array.isArray(targetData.preferred_technologies)
          ? targetData.preferred_technologies.join(', ')
          : targetData.preferred_technologies || ''
      });

      const comps = targetData.target_companies || targetData.companies || [];
      setCompanies(Array.isArray(comps) && comps.length > 0 ? comps : ['Accenture', 'Google']);
    }
    setErrors({});
  }, [targetData, isOpen]);

  if (!isOpen) return null;

  const handleAddCompany = (e) => {
    e?.preventDefault();
    const trimmed = newCompany.trim();
    if (!trimmed) return;
    if (companies.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrors({ company: 'Company already in target list' });
      return;
    }
    setCompanies([...companies, trimmed]);
    setNewCompany('');
    setErrors({ ...errors, company: null });
  };

  const handleRemoveCompany = (companyToRemove) => {
    setCompanies(companies.filter(c => c !== companyToRemove));
  };

  const validate = () => {
    const errs = {};
    if (!formData.role.trim()) errs.role = 'Target role is required';
    if (companies.length === 0) errs.company = 'Please add at least one target company';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const techArray = formData.preferred_technologies
        ? formData.preferred_technologies.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        role: formData.role.trim(),
        target_role: formData.role.trim(),
        target_companies: companies,
        companies: companies,
        target_date: formData.target_date.trim(),
        readiness: Number(formData.readiness) || 75,
        target_salary: formData.target_salary.trim(),
        job_type: formData.job_type,
        preferred_technologies: techArray
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save placement target. Please try again.' });
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
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Update Placement Target</h3>
              <p className="text-xs text-slate-400">Configure your dream roles, target companies, and timeline</p>
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

          {/* Target Role */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Role <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              list="role-suggestions"
              placeholder="e.g. Software Development Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.role ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            <datalist id="role-suggestions">
              {COMMON_ROLES.map(r => (
                <option key={r} value={r} />
              ))}
            </datalist>
            {errors.role && <p className="text-xs text-rose-400 mt-1">{errors.role}</p>}
          </div>

          {/* Target Companies (Chips) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Companies <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft, Accenture, Amazon"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCompany();
                    }
                  }}
                  className="w-full pl-9 pr-3.5 py-2 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCompany}
                className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {errors.company && <p className="text-xs text-rose-400 mb-2">{errors.company}</p>}

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#131b2e]/60 border border-slate-800/80 rounded-xl min-h-[46px] items-center">
              {companies.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-[#1e293b] border border-slate-700/80 rounded-lg group"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(c)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {companies.length === 0 && (
                <span className="text-xs text-slate-500 italic">No target companies added yet</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Interview Date / Deadline
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Dec 2026 or 12/2026"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Compensation / CTC
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 14 - 22 LPA"
                  value={formData.target_salary}
                  onChange={(e) => setFormData({ ...formData, target_salary: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Preferred Job Type
              </label>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
              >
                {JOB_TYPES.map(jt => (
                  <option key={jt} value={jt} className="bg-[#0e1424] text-slate-200">{jt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Self-Assessed Readiness ({formData.readiness}%)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={formData.readiness}
                onChange={(e) => setFormData({ ...formData, readiness: e.target.value })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Preferred Technologies & Focus Areas
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures, React, Node.js, System Design"
              value={formData.preferred_technologies}
              onChange={(e) => setFormData({ ...formData, preferred_technologies: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* AI Synchronization Note */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
            <p className="font-semibold text-indigo-200 flex items-center gap-1.5">
              <span>⚡</span> Automatic AI Study Plan Synchronization
            </p>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">
              Updating your target role or companies will trigger an intelligent prompt in your AI Study Plan so you can review recommended roadmaps without losing your current preparation progress.
            </p>
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
