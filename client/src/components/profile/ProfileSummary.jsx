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
  Sparkles
} from 'lucide-react';
import { PlatformIcons } from './ProfileSocialLinks';

export default function ProfileSummary({ profile = {}, onEditGoal }) {
  const targetRole = profile.target_role || 'Software Development Engineer';
  const targetCompany = profile.target_company || 'Accenture';
  const readiness = profile.readiness_percentage ?? 65;

  // Build Quick Links based ONLY on what is configured
  const quickLinks = [];

  if (profile.socials?.github) {
    quickLinks.push({
      label: 'GitHub Profile',
      url: profile.socials.github,
      icon: PlatformIcons.github,
    });
  }

  if (profile.socials?.linkedin) {
    quickLinks.push({
      label: 'LinkedIn Profile',
      url: profile.socials.linkedin,
      icon: PlatformIcons.linkedin,
    });
  }

  if (profile.socials?.leetcode) {
    quickLinks.push({
      label: 'LeetCode Portfolio',
      url: profile.socials.leetcode,
      icon: PlatformIcons.leetcode,
    });
  }

  if (profile.socials?.codechef) {
    quickLinks.push({
      label: 'CodeChef Handle',
      url: profile.socials.codechef,
      icon: PlatformIcons.codechef,
    });
  }

  if (profile.socials?.gfg) {
    quickLinks.push({
      label: 'GeeksForGeeks',
      url: profile.socials.gfg,
      icon: PlatformIcons.geeksforgeeks,
    });
  }

  if (profile.resume?.url || profile.resume_url) {
    quickLinks.push({
      label: 'Download Resume',
      url: profile.resume?.url || profile.resume_url || '#',
      icon: (props) => <FileText {...props} />,
      isResume: true,
    });
  }

  // Quick skills chips
  const keySkills = Array.isArray(profile.skills)
    ? profile.skills.slice(0, 6)
    : typeof profile.skills === 'string'
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6)
    : [];

  return (
    <div className="space-y-4">
      {/* 1. Current Placement Goal Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Placement Target
            </span>
          </div>

          {onEditGoal && (
            <button
              type="button"
              onClick={onEditGoal}
              className="text-[11px] text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors cursor-pointer"
            >
              Update
            </button>
          )}
        </div>

        <div className="space-y-3.5 pt-3">
          {/* Target Role */}
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Target Role
            </span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <Briefcase className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {targetRole}
              </span>
            </div>
          </div>

          {/* Target Company */}
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Target Company
            </span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {targetCompany}
              </span>
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
              On track for campus hiring assessments.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Quick Links Card */}
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
                    <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all text-xs font-semibold">
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

      {/* 3. Core Competencies Snapshot */}
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
