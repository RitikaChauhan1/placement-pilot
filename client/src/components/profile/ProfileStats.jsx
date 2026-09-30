import React from 'react';
import { Code2, FolderGit2, Award, Trophy, ArrowUpRight } from 'lucide-react';

export default function ProfileStats({ stats = {}, onStatClick }) {
  // Graceful fallback to default values if not yet loaded from backend
  const dsaCount = stats.dsa_problems ?? stats.dsaProblems ?? 124;
  const projectsCount = stats.projects ?? 5;
  const certsCount = stats.certifications ?? 4;
  const achievementsCount = stats.achievements ?? 8;

  const statItems = [
    {
      id: 'dsa',
      label: 'DSA Problems',
      value: dsaCount,
      sublabel: 'Across all platforms',
      icon: Code2,
      tab: 'Coding Profiles',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-100 dark:border-indigo-900/40',
    },
    {
      id: 'projects',
      label: 'Projects',
      value: projectsCount,
      sublabel: 'Full-stack & systems',
      icon: FolderGit2,
      tab: 'Projects',
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/50',
      borderColor: 'border-brand-100 dark:border-brand-900/40',
    },
    {
      id: 'certifications',
      label: 'Certifications',
      value: certsCount,
      sublabel: 'Verified credentials',
      icon: Award,
      tab: 'Achievements',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      value: achievementsCount,
      sublabel: 'Contests & honors',
      icon: Trophy,
      tab: 'Achievements',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onStatClick && onStatClick(item.tab)}
            className="group relative bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 text-left shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.bgColor} ${item.borderColor} border flex items-center justify-center`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {item.label}
              </span>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {item.value}
              </div>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate">
                {item.sublabel}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
