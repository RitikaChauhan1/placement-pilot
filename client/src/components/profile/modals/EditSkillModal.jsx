import React, { useState, useEffect } from 'react';
import { X, Code2 } from 'lucide-react';

export default function EditSkillModal({
  isOpen,
  onClose,
  initialData = null,
  onSave
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    'Programming Languages',
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'AI/ML',
    'Tools',
    'Other'
  ];

  const proficiencies = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Frontend');
      setProficiency(initialData.proficiency || 'Intermediate');
    } else {
      setName('');
      setCategory('Frontend');
      setProficiency('Intermediate');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Skill name is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      await onSave({
        name: name.trim(),
        category,
        proficiency
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to save skill.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1424] border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Skill' : 'Add New Skill'}
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
              Skill Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React, Node.js, C++, Docker"
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder:text-slate-500 outline-hidden text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1 text-xs">Domain / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#131b2e] border border-slate-800 focus:border-indigo-500 text-slate-100 outline-hidden text-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5 text-xs">Proficiency Level</label>
            <div className="grid grid-cols-3 gap-2">
              {proficiencies.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProficiency(p)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    proficiency === p
                      ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                      : 'bg-[#131b2e] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
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
              disabled={saving || !name.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : initialData ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
