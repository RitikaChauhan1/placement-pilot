import React, { useState, useEffect } from 'react';
import { X, FolderGit2, GitBranch, ExternalLink, Star, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditProjectModal({ isOpen, onClose, onSave, projectItem = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
    technologies: '',
    github_url: '',
    live_url: '',
    start_date: '',
    end_date: '',
    featured: false,
    image_url: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectItem) {
      setFormData({
        title: projectItem.title || projectItem.name || '',
        description: projectItem.description || '',
        role: projectItem.role || '',
        technologies: Array.isArray(projectItem.technologies)
          ? projectItem.technologies.join(', ')
          : projectItem.technologies || '',
        github_url: projectItem.github_url || projectItem.github || '',
        live_url: projectItem.live_url || projectItem.demo || '',
        start_date: projectItem.start_date || '',
        end_date: projectItem.end_date || '',
        featured: Boolean(projectItem.featured),
        image_url: projectItem.image_url || projectItem.image || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        role: '',
        technologies: '',
        github_url: '',
        live_url: '',
        start_date: '',
        end_date: '',
        featured: false,
        image_url: ''
      });
    }
    setErrors({});
  }, [projectItem, isOpen]);

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
    if (!formData.title.trim()) errs.title = 'Project title is required';
    if (!formData.description.trim()) errs.description = 'Project description is required';
    if (formData.github_url && !validateUrl(formData.github_url)) {
      errs.github_url = 'Please enter a valid GitHub URL (e.g. https://github.com/...)';
    }
    if (formData.live_url && !validateUrl(formData.live_url)) {
      errs.live_url = 'Please enter a valid Live Demo URL (e.g. https://...)';
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
        title: formData.title.trim(),
        name: formData.title.trim(),
        description: formData.description.trim(),
        role: formData.role.trim(),
        technologies: techArray,
        github_url: formData.github_url.trim(),
        github: formData.github_url.trim(),
        live_url: formData.live_url.trim(),
        demo: formData.live_url.trim(),
        start_date: formData.start_date.trim(),
        end_date: formData.end_date.trim(),
        featured: formData.featured,
        image_url: formData.image_url.trim()
      };

      await onSave(payload, projectItem?.id);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to save project. Please try again.' });
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
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {projectItem ? 'Edit Project' : 'Add Project'}
              </h3>
              <p className="text-xs text-slate-400">Showcase your technical projects, repositories, and live demos</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PlacementPilot AI, CloudOps Monitor"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.title ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Role
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Developer, Solo"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="What problem does this project solve? What architecture or key features did you build?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-[#131b2e] border ${errors.description ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed`}
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Technologies Used (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Express, PostgreSQL, AI"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Repository URL
              </label>
              <div className="relative">
                <GitBranch className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.github_url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {errors.github_url && <p className="text-xs text-rose-400 mt-1">{errors.github_url}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Live Demo / Deployment URL
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://myproject.vercel.app"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-[#131b2e] border ${errors.live_url ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {errors.live_url && <p className="text-xs text-rose-400 mt-1">{errors.live_url}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="text"
                placeholder="e.g. Jan 2024"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="text"
                placeholder="e.g. Mar 2024 or Present"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#131b2e] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="p-4 bg-[#11182c]/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Mark as Featured Project</p>
                <p className="text-[11px] text-slate-400">Featured projects will be highlighted at the top of your portfolio</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
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
