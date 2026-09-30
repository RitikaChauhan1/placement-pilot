import React from 'react';
import { Building2, Calendar, Clock, Target, Edit3 } from 'lucide-react';

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
  const daysRemaining = plan?.days_remaining || goal?.daysRemaining || 26;
  const dailyHours = plan?.daily_study_hours || goal?.dailyStudyHours || 2;

  // Format date nicely (e.g. 26 Oct 2026)
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const focusTags = [
    { name: 'DSA', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'SQL', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Core CS', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { name: 'Aptitude', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { name: 'Frontend', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { name: 'Projects', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    { name: 'Mock Interview', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* CARD 1: Target Company & Role */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Target Company
          </span>
          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-base font-bold text-foreground truncate">
            {targetCompany}
          </div>
          <div className="text-xs text-muted-foreground truncate mt-0.5" title={targetRole}>
            Role: <span className="text-foreground/90 font-medium">{targetRole}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Interview Date */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Interview Date
          </span>
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-base font-bold text-foreground">
            {formatDate(interviewDate)}
          </div>
          <div className="text-xs font-semibold text-primary mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping inline-block" />
            {daysRemaining} days remaining
          </div>
        </div>
      </div>

      {/* CARD 3: Available Study Time */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Available Study Time
          </span>
          <button
            onClick={onEditHours}
            className="p-1 rounded text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
            title="Edit Study Hours"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="mt-2.5">
          <div className="text-base font-bold text-foreground">
            {dailyHours} hours/day
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Mon–Fri: {dailyHours}h/day • Sat–Sun: {Math.min(6, dailyHours + 2)}h/day
          </div>
        </div>
      </div>

      {/* CARD 4: Preparation Focus */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Preparation Focus
          </span>
          <button
            onClick={onEditFocus}
            className="p-1 rounded text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
            title="Edit Focus Topics"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="mt-2">
          <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
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
