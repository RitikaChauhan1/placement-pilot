import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  Trophy,
  Briefcase,
  FolderGit2,
  Terminal,
  Share2,
  ExternalLink,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Star,
  Flame,
  FileText
} from 'lucide-react';
import { PlatformIcons } from './ProfileSocialLinks';

export default function ProfileSection({ activeTab, profile = {}, onEditSection }) {
  const [copiedLink, setCopiedLink] = useState('');

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  // Section 1: About
  if (activeTab === 'About') {
    return (
      <div className="space-y-4">
        {/* Bio Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <User className="w-4 h-4 text-brand-500" />
              <h2 className="text-sm font-bold tracking-tight">Professional Summary</h2>
            </div>
            {onEditSection && (
              <button
                type="button"
                onClick={() => onEditSection('About')}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>

          <div className="pt-3 space-y-3">
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
              {profile.bio ||
                'Computer Science undergraduate passionate about building scalable web applications and algorithmic problem solving. Actively practicing Data Structures & Algorithms, System Design fundamentals, and modern web architectures. Seeking software engineering internships and full-time SDE roles.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                  Primary Domain
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Full-Stack Engineering & Algorithms
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                  Interview Readiness
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Campus Placement Candidate ({profile.readiness_percentage ?? 65}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective & Preferences */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Placement Preferences & Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Target Role
              </span>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {profile.target_role || 'Software Development Engineer'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Dream Company
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {profile.target_company || 'Accenture'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
              <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 mb-0.5">
                Target Grad Year
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Batch of {profile.graduation_year || '2026'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section 2: Education
  if (activeTab === 'Education') {
    const educationList = profile.education || [];

    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <GraduationCap className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold tracking-tight">Academic Background</h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {educationList.length} Records
          </span>
        </div>

        <div className="space-y-4">
          {educationList.length > 0 ? (
            educationList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.institution}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 self-start sm:self-auto">
                    {item.grade}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>{item.degree}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.period}
                  </span>
                </div>

                {item.coursework && (
                  <div className="pt-1.5 flex flex-wrap gap-1">
                    {item.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No education records found.</p>
          )}
        </div>
      </div>
    );
  }

  // Section 3: Skills
  if (activeTab === 'Skills') {
    const cats = profile.categorized_skills || {};

    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Code2 className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold tracking-tight">Technical Skills & Competencies</h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Categorized Stack
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Programming Languages */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(cats.languages || ['C++', 'Java', 'Python', 'JavaScript', 'SQL']).map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Frameworks & Libraries */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Frameworks & Libraries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(cats.frameworks || ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS']).map(
                (fw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60"
                  >
                    {fw}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Databases & Tools */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Databases, Cloud & Dev Tools
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(cats.database_tools || ['PostgreSQL', 'MongoDB', 'Git', 'Docker', 'Postman']).map(
                (tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
                  >
                    {tool}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Core CS Fundamentals */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Core CS Fundamentals
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(cats.fundamentals || [
                'Data Structures & Algorithms',
                'Object-Oriented Programming (OOP)',
                'Database Management Systems',
                'Operating Systems',
                'Computer Networks',
              ]).map((fund, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60"
                >
                  {fund}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section 4: Achievements
  if (activeTab === 'Achievements') {
    const list = profile.achievements || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold tracking-tight">Honors & Achievements</h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {list.length} Verified
          </span>
        </div>

        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  {item.title}
                </h3>
                <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                  {item.date}
                </span>
              </div>
              <p className="text-[11px] font-medium text-brand-600 dark:text-brand-400">
                {item.issuer}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Section 5: Experience
  if (activeTab === 'Experience') {
    const list = profile.experience || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Briefcase className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold tracking-tight">Experience & Internships</h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {list.length} Experiences
          </span>
        </div>

        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.role}
                  </h3>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {item.company}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.period}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {item.skills && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Section 6: Projects
  if (activeTab === 'Projects') {
    const list = profile.projects || [];
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FolderGit2 className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold tracking-tight">Featured Developer Projects</h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {list.length} Projects
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-2 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.featured && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200/70 dark:border-slate-700 shadow-2xs transition-colors"
                      title="View GitHub Repository"
                    >
                      <PlatformIcons.github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {item.live && item.live !== '#' && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/70 dark:border-slate-700 shadow-2xs transition-colors"
                      title="Live Deployment"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10.5px] rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Section 7: Coding Profiles
  if (activeTab === 'Coding Profiles') {
    const cp = profile.coding_profiles || {};

    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Terminal className="w-4 h-4 text-brand-500" />
              <h2 className="text-sm font-bold tracking-tight">Competitive Coding Statistics</h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Live Handles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* LeetCode Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcons.leetcode className="w-4 h-4 text-[#FFA116]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    LeetCode
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  {cp.leetcode?.badge || 'Knight'}
                </span>
              </div>

              <div>
                <span className="block text-[10.5px] text-slate-400 dark:text-slate-500">
                  Contest Rating
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {cp.leetcode?.rating || '1782'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                <div className="p-1 rounded bg-white dark:bg-slate-800">
                  <span className="block text-[9.5px] font-semibold text-emerald-600">Easy</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {cp.leetcode?.easy || 52}
                  </span>
                </div>
                <div className="p-1 rounded bg-white dark:bg-slate-800">
                  <span className="block text-[9.5px] font-semibold text-amber-600">Med</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {cp.leetcode?.medium || 58}
                  </span>
                </div>
                <div className="p-1 rounded bg-white dark:bg-slate-800">
                  <span className="block text-[9.5px] font-semibold text-rose-600">Hard</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {cp.leetcode?.hard || 14}
                  </span>
                </div>
              </div>

              {cp.leetcode?.url && (
                <a
                  href={cp.leetcode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                >
                  <span>View LeetCode Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* CodeChef Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcons.codechef className="w-4 h-4 text-[#8B5A2B] dark:text-[#d4a373]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    CodeChef
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  {cp.codechef?.stars || '3★'}
                </span>
              </div>

              <div>
                <span className="block text-[10.5px] text-slate-400 dark:text-slate-500">
                  Peak Rating
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {cp.codechef?.rating || '1640'}
                </span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">Problems Solved</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cp.codechef?.solved || 85}
                </span>
              </div>

              {cp.codechef?.url && (
                <a
                  href={cp.codechef.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                >
                  <span>View CodeChef Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* GeeksForGeeks Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcons.geeksforgeeks className="w-4 h-4 text-[#2F8D46]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    GeeksForGeeks
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  Rank #{cp.gfg?.instituteRank || 12}
                </span>
              </div>

              <div>
                <span className="block text-[10.5px] text-slate-400 dark:text-slate-500">
                  Coding Score
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {cp.gfg?.score || '412'}
                </span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">Problems Solved</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cp.gfg?.problemsSolved || 96}
                </span>
              </div>

              {cp.gfg?.url && (
                <a
                  href={cp.gfg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                >
                  <span>View GFG Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section 8: Socials
  if (activeTab === 'Socials') {
    const socials = profile.socials || {};
    const socialList = [
      {
        key: 'github',
        label: 'GitHub',
        icon: PlatformIcons.github,
        url: socials.github,
        placeholder: 'https://github.com/username',
      },
      {
        key: 'linkedin',
        label: 'LinkedIn',
        icon: PlatformIcons.linkedin,
        url: socials.linkedin,
        placeholder: 'https://linkedin.com/in/username',
      },
      {
        key: 'leetcode',
        label: 'LeetCode',
        icon: PlatformIcons.leetcode,
        url: socials.leetcode,
        placeholder: 'https://leetcode.com/username',
      },
      {
        key: 'codechef',
        label: 'CodeChef',
        icon: PlatformIcons.codechef,
        url: socials.codechef,
        placeholder: 'https://codechef.com/users/username',
      },
      {
        key: 'gfg',
        label: 'GeeksForGeeks',
        icon: PlatformIcons.geeksforgeeks,
        url: socials.gfg || socials.geeksforgeeks,
        placeholder: 'https://geeksforgeeks.org/user/username',
      },
      {
        key: 'portfolio',
        label: 'Personal Portfolio',
        icon: (props) => <ExternalLink {...props} />,
        url: socials.portfolio,
        placeholder: 'https://yourportfolio.dev',
      },
    ];

    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Share2 className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold tracking-tight">Public Profiles & Social Handles</h2>
          </div>
          {onEditSection && (
            <button
              type="button"
              onClick={() => onEditSection('Socials')}
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              Edit Links
            </button>
          )}
        </div>

        <div className="space-y-3">
          {socialList.map((item) => {
            const Icon = item.icon;
            const isConfigured = Boolean(item.url && item.url.trim());

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/70 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">
                      {item.url || 'Not configured'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isConfigured && (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url, item.key)}
                      className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                      title="Copy link"
                    >
                      {copiedLink === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {isConfigured ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800/60 transition-colors cursor-pointer"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Unlinked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
