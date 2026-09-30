import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export default function PlanSummaryCards({
  goal,
  plan,
  profile,
  onEditHours,
  onEditFocus
}) {
  const targetCompany = plan?.target_company || goal?.targetCompany || 'Accenture';
  const targetRole = plan?.target_role || goal?.targetRole || 'Software Development Engineer';
  const interviewDate = plan?.interview_date || goal?.interviewDate || '2026-10-26';
  const daysRemaining = plan?.days_remaining || goal?.daysRemaining || 30;
  const dailyHours = plan?.daily_study_hours || goal?.dailyStudyHours || 2;

  const focusTags = [
    { name: 'DSA', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
    { name: 'SQL', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    { name: 'Core CS', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
    { name: 'Aptitude', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    { name: 'Frontend', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    { name: 'Projects', color: 'bg-pink-500/15 text-pink-400 border-pink-500/25' },
    { name: 'Mock interview', color: 'bg-red-500/15 text-red-400 border-red-500/25' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* CARD 1: Target Company */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xs">
        <span className="text-[11px] font-medium text-slate-400 tracking-wider">
          Target Company
        </span>
        <div className="flex items-center gap-3 mt-2.5">
          {/* Accenture Purple Chevron Logo Box */}
          <div className="w-9 h-9 rounded-lg bg-[#27123d] text-[#c084fc] flex items-center justify-center font-black text-xl border border-purple-500/20 shrink-0">
            <span>&gt;</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {targetCompany}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {targetRole}
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: Interview Date */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xs">
        <span className="text-[11px] font-medium text-slate-400 tracking-wider">
          Interview Date
        </span>
        <div className="flex items-center gap-3 mt-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              26 Oct 2026
            </div>
            <div className="text-[11px] font-semibold text-cyan-400 mt-0.5">
              {daysRemaining} days remaining
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Available Study Time */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 tracking-wider">
            Available Study Time
          </span>
          <button
            onClick={onEditHours}
            className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2.5">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {dailyHours} hours/day
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              (Mon–Fri), 4 hours/day (Sat–Sun)
            </div>
          </div>
        </div>
      </div>

      {/* CARD 4: Preparation Focus */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 tracking-wider">
            Preparation Focus
          </span>
          <button
            onClick={onEditFocus}
            className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="mt-2.5">
          <div className="flex flex-wrap gap-1">
            {focusTags.map((tag) => (
              <span
                key={tag.name}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
