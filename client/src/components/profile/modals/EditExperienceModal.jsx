import React, { useState, useEffect } from 'react';
import { X, Briefcase, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const EMPLOYMENT_TYPES = [
  'Internship',
  'Full-time',
  'Part-time',
  'Freelance',
  'Contract'
];

export default function EditExperienceModal({ isOpen, onClose, onSave, experienceItem = null }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    type: 'Internship',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: '',
    technologies: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (experienceItem) {
      setFormData({
        company: experienceItem.company || '',
        role: experienceItem.role || '',
        type: experienceItem.type || 'Internship',
        location: experienceItem.location || '',
        start_date: experienceItem.start_date || '',
        end_date: experienceItem.end_date || '',
        currently_working: experienceItem.currently_working || false,
        description: experienceItem.description || '',
        technologies: Array.isArray(experienceItem.technologies)
          ? experienceItem.technologies.join(', ')
          : experienceItem.technologies || ''
      });
    } else {
      setFormData({
        company: '',
        role: '',
        type: 'Internship',
        location: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        description: '',
        technologies: ''
      });
    }
    setErrors({});
  }, [experienceItem, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.role.trim()) errs.role = 'Role / Job title is required';
    if (!formData.start_date.trim()) errs.start_date = 'Start date is required';
    if (!formData.currently_working && !formData.end_date.trim()) {
      errs.end_date = 'End date is required (or check Currently Working)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const techArray = formData.technologies
        ? formData.technologies.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        company: formData.company.trim(),
        role: formData.role.trim(),
        type: formData.type,
        location: formData.location.trim(),
        start_date: formData.start_date.trim(),
        end_date: formData.currently_working ? 'Present' : formData.end_date.trim(),
        currently_working: formData.currently_working,
        description: formData.description.trim(),
        technologies: techArray
      };

      await onSave(payload, experienceItem?.id);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save experience. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#11182c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {experienceItem ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              <p className="text-xs text-slate-400">Add internships, freelance, or full-time roles</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role / Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SDE Intern, Frontend Developer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.role ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.role && <p className="text-xs text-rose-400 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Company / Organization <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Google, TechCorp Labs"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.company ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.company && <p className="text-xs text-rose-400 mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {EMPLOYMENT_TYPES.map(t => (
                  <option key={t} value={t} className="bg-[#0e1424] text-slate-200">{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Remote, Hybrid"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Dates & Currently working toggle */}
          <div className="p-4 bg-[#11182c]/80 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currently_working"
                checked={formData.currently_working}
                onChange={(e) => setFormData({ ...formData, currently_working: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#131b2e]"
              />
              <label htmlFor="currently_working" className="text-xs font-medium text-slate-300 cursor-pointer select-none">
                I am currently working in this role
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Start Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. May 2024 or 05/2024"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full px-3.5 py-2 bg-[#131b2e] border ${errors.start_date ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs`}
                />
                {errors.start_date && <p className="text-xs text-rose-400 mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  End Date {!formData.currently_working && <span className="text-rose-400">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={formData.currently_working ? "Present" : "e.g. Jul 2024 or Present"}
                  disabled={formData.currently_working}
                  value={formData.currently_working ? 'Present' : formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`w-full px-3.5 py-2 bg-[#131b2e] border ${errors.end_date ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs ${formData.currently_working ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {errors.end_date && <p className="text-xs text-rose-400 mt-1">{errors.end_date}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description & Key Accomplishments
            </label>
            <textarea
              rows={4}
              placeholder="Describe your responsibilities, projects delivered, metrics improved, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Technologies Used (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, PostgreSQL, Docker, AWS"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
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
