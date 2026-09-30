import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Calendar, Clock, AlertTriangle, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

export default function PreparationGoalCard({
  goal = {},
  missingFields = [],
  dailyHours = 2,
  onHoursChange,
  isUpdatingHours = false
}) {
  const {
    targetCompany = 'Accenture',
    targetRole = 'Software Development Engineer',
    interviewDate = '2026-10-26',
    daysRemaining = 26
  } = goal;

  const hoursOptions = [1, 2, 3, 4];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-4 transition-all">
      {/* Missing essential info banner */}
      {missingFields.length > 0 && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Complete your profile to generate a personalized roadmap</span>
          </div>
          <div className="text-amber-700 dark:text-amber-400 pl-6">
            <p className="font-medium mb-1">Missing required information:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11.5px]">
              {missingFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </div>
          <div className="pt-1 pl-6">
            <Link
              to="/profile"
              className="btn-compact-primary text-xs inline-flex items-center gap-1.5"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Header and Goal Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              CAMPUS PLACEMENT TARGET
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Your Preparation Goal
          </h2>
        </div>

        <Link
          to="/profile"
          className="btn-compact-secondary text-xs self-start md:self-auto"
        >
          <span>Edit Target Settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Target Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Company */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Target Company
          </span>
          <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <span className="truncate">{targetCompany}</span>
          </div>
        </div>

        {/* Role */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Target Role
          </span>
          <div className="mt-1 font-bold text-slate-900 dark:text-white text-xs sm:text-[13px] truncate" title={targetRole}>
            {targetRole}
          </div>
        </div>

        {/* Interview Date */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Interview Date
          </span>
          <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900 dark:text-white text-xs sm:text-[13px]">
            <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>{interviewDate}</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Timeline
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {daysRemaining}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              days remaining
            </span>
          </div>
        </div>
      </div>

      {/* Available Study Time Configurator */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Daily Study Capacity
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              AI balances your daily roadmap so you never burn out
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {hoursOptions.map((hrs) => {
            const isSelected = dailyHours === hrs;
            return (
              <button
                key={hrs}
                type="button"
                disabled={isUpdatingHours}
                onClick={() => onHoursChange(hrs)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {hrs === 4 ? '4+ hours' : `${hrs} hour${hrs > 1 ? 's' : ''}`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
