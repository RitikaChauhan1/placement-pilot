import React, { useState, useEffect } from 'react';
import { X, Camera, User, GraduationCap, MapPin, Phone, Mail, Building2, BookOpen, Calendar } from 'lucide-react';

export default function EditBasicInfoModal({
  isOpen,
  onClose,
  profile = {},
  onSave
}) {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    phone: '',
    email: '',
    college: '',
    degree: '',
    branch: '',
    graduation_year: '',
    avatar_url: ''
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || profile.title || 'Software Developer / Computer Science Student',
        location: profile.location || 'India',
        phone: profile.phone || '',
        email: profile.email || '',
        college: profile.college || 'National Institute of Technology',
        degree: profile.degree || 'B.Tech',
        branch: profile.branch || 'Computer Science & Engineering',
        graduation_year: profile.graduation_year || '2026',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      await onSave({
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        title: formData.headline.trim(),
        location: formData.location.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        branch: formData.branch.trim(),
        graduation_year: formData.graduation_year.trim(),
        avatar_url: formData.avatar_url
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to save basic information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Edit Basic Information</h3>
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
          {/* Photo Upload Area */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#131b2e] border border-slate-800">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div>
              <span className="block text-xs font-semibold text-white">Profile Photo</span>
              <span className="block text-[11px] text-slate-400 mb-2">Upload a professional headshot (JPG, PNG)</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>Change Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ritika Sharma"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, India"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Software Developer / Computer Science Student"
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">College / University</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Branch / Major</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 text-xs">Graduation Year</label>
              <input
                type="text"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                placeholder="e.g. 2026"
                className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
              />
            </div>
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
              disabled={saving || !formData.name.trim()}
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
