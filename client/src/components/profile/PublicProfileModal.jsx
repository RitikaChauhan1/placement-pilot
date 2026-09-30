import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, ShieldCheck, Globe } from 'lucide-react';
import ProfileSocialLinks from './ProfileSocialLinks';

export default function PublicProfileModal({ isOpen, onClose, profile = {} }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/profile/${profile.username || 'ritika-chauhan'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Public Developer Profile
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

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Shareable Link
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                Live & Recruiter-Ready
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 select-all outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Mini Preview Box */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                {(profile.name || 'RC').substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {profile.name || 'Ritika Chauhan'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {profile.title || 'Software Developer'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-[11px]">Configured Platforms:</span>
              <ProfileSocialLinks socials={profile.socials} size="sm" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
