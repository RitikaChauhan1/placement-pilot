import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Database, Video, BookOpen, ArrowRight } from 'lucide-react';

export default function QuickPractice() {
  const practiceItems = [
    {
      id: 'dsa',
      title: 'Practice DSA',
      subtitle: 'Top 150 Sheets',
      route: '/dsa',
      icon: Code2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      borderColor: 'hover:border-indigo-300 dark:hover:border-indigo-700/60'
    },
    {
      id: 'sql',
      title: 'Practice SQL',
      subtitle: 'Query Challenges',
      route: '/sql',
      icon: Database,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-700/60'
    },
    {
      id: 'mock',
      title: 'Mock Interview',
      subtitle: 'Technical & HR',
      route: '/mock-interviews',
      icon: Video,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      borderColor: 'hover:border-purple-300 dark:hover:border-purple-700/60'
    },
    {
      id: 'revise',
      title: 'Revise Topics',
      subtitle: 'Core CS Notes',
      route: '/study-plan',
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      borderColor: 'hover:border-amber-300 dark:hover:border-amber-700/60'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-3 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Action Shortcuts
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Quick Practice
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {practiceItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.route}
              className={`p-3 rounded-lg bg-slate-50/70 dark:bg-[#0d121c] border border-slate-200/80 dark:border-slate-800 transition-all group flex flex-col justify-between hover:shadow-subtle ${item.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-md ${item.bgColor} ${item.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-2.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
