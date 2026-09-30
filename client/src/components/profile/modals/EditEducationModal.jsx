import React, { useState, useEffect } from 'react';
import { X, GraduationCap } from 'lucide-react';

export default function EditEducationModal({
  isOpen,
  onClose,
  initialData = null,
  onSave
}) {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: '2022',
    end_year: '2026',
    grade: '',
    location: '',
    description: '',
    coursework: ''
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        institution: initialData.institution || '',
        degree: initialData.degree || '',
        field_of_study: initialData.field_of_study || '',
        start_year: initialData.start_year || (initialData.period ? initialData.period.split('-')[0].trim() : '2022'),
        end_year: initialData.end_year || (initialData.period ? initialData.period.split('-')[1]?.trim() : '2026'),
        grade: initialData.grade || '',
        location: initialData.location || '',
        description: initialData.description || '',
        coursework: Array.isArray(initialData.coursework)
          ? initialData.coursework.join(', ')
          : initialData.coursework || ''
      });
    } else {
      setFormData({
        institution: '',
        degree: '',
        field_of_study: '',
        start_year: '2022',
        end_year: '2026',
        grade: '',
        location: '',
        description: '',
        coursework: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.institution.trim()) {
      setErrorMsg('Institution name is required.');
      return;
    }
    if (!formData.degree.trim()) {
      setErrorMsg('Degree is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      const courseworkArr = formData.coursework
        ? formData.coursework.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      await onSave({
        institution: formData.institution.trim(),
        degree: formData.degree.trim(),
        field_of_study: formData.field_of_study.trim(),
        start_year: formData.start_year.trim(),
        end_year: formData.end_year.trim(),
        period: `${formData.start_year.trim()} - ${formData.end_year.trim()}`,
        grade: formData.grade.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        coursework: courseworkArr
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to save education record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Education' : 'Add Education'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 my-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">
              Institution / University <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g. National Institute of Technology"
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">
                Degree <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="degree"
                required
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Technology"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Field of Study / Branch</label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Start Year</label>
              <input
                type="text"
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
                placeholder="2022"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">End Year</label>
              <input
                type="text"
                name="end_year"
                value={formData.end_year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">CGPA / Percentage</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. 8.85 CGPA or 92%"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Surathkal, Karnataka, India"
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">Description (Optional)</label>
            <textarea
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Key academic projects, societies, or honors..."
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">Key Coursework (comma-separated)</label>
            <input
              type="text"
              name="coursework"
              value={formData.coursework}
              onChange={handleChange}
              placeholder="e.g. Data Structures, Algorithms, DBMS, Operating Systems"
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 mt-5">
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
              {saving ? 'Saving...' : initialData ? 'Save Changes' : 'Add Education'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
