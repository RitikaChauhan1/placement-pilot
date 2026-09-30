import React from 'react';
import {
  Target,
  Building2,
  Briefcase,
  TrendingUp,
  ExternalLink,
  FileText,
  Code2,
  CheckCircle2,
  Upload,
  Download,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { PlatformIcons } from './ProfileSocialLinks';

export default function ProfileSummary({
  profile = {},
  onEditGoal,
  onOpenResumeModal,
  onDeleteResume
}) {
  const targetRole = profile.target_role || profile.placement_target?.role || 'Software Development Engineer';
  const targetCompanies = Array.isArray(profile.target_companies) && profile.target_companies.length > 0
    ? profile.target_companies
    : (profile.target_company ? [profile.target_company] : ['Accenture', 'Google']);
  const readiness = profile.readiness_percentage ?? profile.placement_target?.readiness ?? 75;

  const resume = profile.resume || (profile.resume_url ? {
    name: 'Ritika_Chauhan_Resume.pdf',
    size: '1.24 MB',
    uploaded_at: 'Oct 2024',
    url: profile.resume_url
  } : null);

  // Build Quick Links based ONLY on what is configured
  const quickLinks = [];

  const rawSocials = profile.socials_list || [];
  if (Array.isArray(rawSocials) && rawSocials.length > 0) {
    rawSocials.forEach(s => {
      const platKey = (s.platform || '').toLowerCase();
      quickLinks.push({
        label: `${s.label || s.platform} Profile`,
        url: s.url,
        icon: PlatformIcons[platKey] || ExternalLink
      });
    });
  } else if (profile.socials) {
    if (profile.socials.github) {
      quickLinks.push({
        label: 'GitHub Profile',
        url: profile.socials.github,
        icon: PlatformIcons.github,
      });
    }
    if (profile.socials.linkedin) {
      quickLinks.push({
        label: 'LinkedIn Profile',
        url: profile.socials.linkedin,
        icon: PlatformIcons.linkedin,
      });
    }
    if (profile.socials.leetcode) {
      quickLinks.push({
        label: 'LeetCode Portfolio',
        url: profile.socials.leetcode,
        icon: PlatformIcons.leetcode,
      });
    }
    if (profile.socials.codechef) {
      quickLinks.push({
        label: 'CodeChef Handle',
        url: profile.socials.codechef,
        icon: PlatformIcons.codechef,
      });
    }
    if (profile.socials.gfg) {
      quickLinks.push({
        label: 'GeeksForGeeks',
        url: profile.socials.gfg,
        icon: PlatformIcons.geeksforgeeks,
      });
    }
  }

  // Quick skills chips
  const keySkills = Array.isArray(profile.skills_list) && profile.skills_list.length > 0
    ? profile.skills_list.slice(0, 6).map(s => typeof s === 'string' ? s : s.name)
    : Array.isArray(profile.skills)
    ? profile.skills.slice(0, 6)
    : typeof profile.skills === 'string'
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
    : ['React', 'Node.js', 'C++', 'Java', 'PostgreSQL', 'Docker'];

  return (
    <div className="space-y-4">
      {/* 1. Current Placement Goal Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Placement Target
            </span>
          </div>

          {onEditGoal && (
            <button
              type="button"
              onClick={onEditGoal}
              className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors cursor-pointer"
            >
              Update
            </button>
          )}
        </div>

        <div className="space-y-3 pt-3">
          {/* Target Role */}
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Target Role
            </span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {targetRole}
              </span>
            </div>
          </div>

          {/* Target Companies */}
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Target Companies ({targetCompanies.length})
            </span>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              {targetCompanies.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60"
                >
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Placement Readiness Gauge */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Placement Readiness
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {readiness}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, readiness))}%` }}
              />
            </div>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1">
              Synchronized with AI Study Plan & Daily Prep.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Resume Card (Section 13) */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Placement Resume
            </span>
          </div>

          {resume ? (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Resume uploaded ✓
            </span>
          ) : (
            <span className="text-[10.5px] text-slate-400 italic">
              No resume
            </span>
          )}
        </div>

        <div className="pt-3">
          {resume ? (
            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {resume.name || 'Student_Resume.pdf'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {resume.size || '1.2 MB'} • {resume.uploaded_at || 'Recently uploaded'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions: View, Download, Replace, Delete */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <div className="flex items-center gap-1.5">
                  {resume.url && (
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </a>
                  )}
                  {resume.url && (
                    <a
                      href={resume.url}
                      download={resume.name || 'Resume.pdf'}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onOpenResumeModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteResume}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-slate-400">No resume uploaded yet.</p>
              <button
                type="button"
                onClick={onOpenResumeModal}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Resume (PDF)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Quick Links Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Links
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {quickLinks.length} verified
          </span>
        </div>

        <div className="space-y-1.5 pt-2.5">
          {quickLinks.length > 0 ? (
            quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/70 transition-all text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-xs font-semibold">
                    →
                  </span>
                </a>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center">
              No quick links added yet. Edit profile to configure.
            </p>
          )}
        </div>
      </div>

      {/* 4. Core Competencies Snapshot */}
      {keySkills.length > 0 && (
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
          <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Top Skills Snapshot</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-3">
            {keySkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200/70 dark:border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
