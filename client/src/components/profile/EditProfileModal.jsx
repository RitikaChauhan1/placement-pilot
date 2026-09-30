import React, { useState } from 'react';
import {
  X,
  Save,
  User,
  GraduationCap,
  Target,
  Code2,
  Share2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { profileApi } from '../../services/api';

export default function EditProfileModal({ isOpen, onClose, profile = {}, onProfileUpdated }) {
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: profile.name || '',
    title: profile.title || 'Software Developer / Computer Science Student',
    location: profile.location || 'India',
    college: profile.college || 'National Institute of Technology',
    degree: profile.degree || 'B.Tech in Computer Science',
    graduation_year: profile.graduation_year || '2026',
    target_role: profile.target_role || 'Software Development Engineer',
    target_company: profile.target_company || 'Accenture',
    bio: profile.bio || '',
    skills: Array.isArray(profile.skills)
      ? profile.skills.join(', ')
      : profile.skills || '',
    programming_languages: Array.isArray(profile.programming_languages)
      ? profile.programming_languages.join(', ')
      : profile.programming_languages || '',
    github: profile.socials?.github || '',
    linkedin: profile.socials?.linkedin || '',
    leetcode: profile.socials?.leetcode || '',
    codechef: profile.socials?.codechef || '',
    gfg: profile.socials?.gfg || '',
    portfolio: profile.socials?.portfolio || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Prepare payload for the existing backend API
      const apiPayload = {
        name: formData.name,
        college: formData.college,
        degree: formData.degree,
        graduation_year: formData.graduation_year,
        skills: formData.skills,
        programming_languages: formData.programming_languages,
        target_role: formData.target_role,
        target_companies: formData.target_company,
        readiness_percentage: profile.readiness_percentage || 65,
      };

      await profileApi.updateProfile(apiPayload);

      // 2. Build full updated developer profile object
      const updatedProfile = {
        ...profile,
        name: formData.name,
        title: formData.title,
        location: formData.location,
        college: formData.college,
        degree: formData.degree,
        graduation_year: formData.graduation_year,
        target_role: formData.target_role,
        target_company: formData.target_company,
        bio: formData.bio,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        programming_languages: formData.programming_languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        socials: {
          ...profile.socials,
          github: formData.github,
          linkedin: formData.linkedin,
          leetcode: formData.leetcode,
          codechef: formData.codechef,
          gfg: formData.gfg,
          portfolio: formData.portfolio,
        },
      };

      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Edit Developer Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveFormTab('basic')}
            className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeFormTab === 'basic'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Basic & Academics
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('career')}
            className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeFormTab === 'career'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Placement Goals & Skills
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('socials')}
            className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeFormTab === 'socials'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Socials & Coding Handles
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeFormTab === 'basic' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Professional Title / Headline
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer / Computer Science Student"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Degree & Specialization
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Graduation Year
                  </label>
                  <select
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a concise developer summary..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          {activeFormTab === 'career' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    name="target_role"
                    value={formData.target_role}
                    onChange={handleChange}
                    placeholder="e.g. Software Development Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Target Dream Company
                  </label>
                  <input
                    type="text"
                    name="target_company"
                    value={formData.target_company}
                    onChange={handleChange}
                    placeholder="e.g. Accenture, Google, Microsoft"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Programming Languages (Comma-separated)
                </label>
                <input
                  type="text"
                  name="programming_languages"
                  value={formData.programming_languages}
                  onChange={handleChange}
                  placeholder="e.g. C++, Java, Python, JavaScript, SQL"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Technical Skills & Domains (Comma-separated)
                </label>
                <textarea
                  name="skills"
                  rows={3}
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures, Algorithms, React.js, Node.js, PostgreSQL, System Design"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          {activeFormTab === 'socials' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  LeetCode Profile URL
                </label>
                <input
                  type="url"
                  name="leetcode"
                  value={formData.leetcode}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/username"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  CodeChef Profile URL
                </label>
                <input
                  type="url"
                  name="codechef"
                  value={formData.codechef}
                  onChange={handleChange}
                  placeholder="https://codechef.com/users/username"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  GeeksForGeeks Profile URL
                </label>
                <input
                  type="url"
                  name="gfg"
                  value={formData.gfg}
                  onChange={handleChange}
                  placeholder="https://geeksforgeeks.org/user/username"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Portfolio / Website URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
