import React from 'react';
import {
  User,
  GraduationCap,
  Code2,
  Trophy,
  Award,
  Briefcase,
  FolderGit2,
  Terminal,
  Share2
} from 'lucide-react';

export const PROFILE_TABS = [
  { id: 'About', label: 'About', icon: User },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Skills', label: 'Skills', icon: Code2 },
  { id: 'Achievements', label: 'Achievements', icon: Trophy },
  { id: 'Certifications', label: 'Certifications', icon: Award },
  { id: 'Experience', label: 'Experience', icon: Briefcase },
  { id: 'Projects', label: 'Projects', icon: FolderGit2 },
  { id: 'Coding Profiles', label: 'Coding Profiles', icon: Terminal },
  { id: 'Socials', label: 'Socials', icon: Share2 },
];

export default function ProfileNavigation({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className="border-b border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] rounded-xl px-2 sm:px-4 shadow-2xs transition-colors">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto profile-nav-scroll py-1.5 -mb-px">
        {PROFILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group relative inline-flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/70 dark:bg-brand-950/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />
              <span>{tab.label}</span>

              {/* Optional count tag if available */}
              {count !== undefined && count > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-semibold rounded-full ${
                    isActive
                      ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Active Tab Accent Line Indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
