import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check, Info } from 'lucide-react';

export default function ActivityCalendar({
  monthLabel = 'September 2026',
  activitiesByDate = {},
  selectedDate = '2026-09-30',
  onSelectDate
}) {
  const [internalSelectedDate, setInternalSelectedDate] = useState('2026-09-30');
  const activeSelected = selectedDate || internalSelectedDate;

  // September 2026: 30 days
  // 2026-09-01 was a Tuesday
  // Monday: 0 (empty prefix), Tuesday: day 1
  const daysInMonth = 30;
  const startDayOffset = 1; // 0 for Mon, 1 for Tue
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayClick = (dateStr) => {
    setInternalSelectedDate(dateStr);
    if (onSelectDate) onSelectDate(dateStr);
  };

  // Helper to get formatted minutes: e.g. 80 -> "1h 20m"
  const formatMinutes = (mins) => {
    if (!mins || mins <= 0) return '0m';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0 && remainingMins > 0) return `${hours}h ${remainingMins}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMins}m`;
  };

  // Resolve active day info
  const selectedActivity = activitiesByDate[activeSelected];
  const selectedDayNum = parseInt(activeSelected.split('-')[2], 10);

  // Month name from monthLabel
  const monthName = monthLabel.split(' ')[0] || 'September';

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Daily Check-in</span>
            </h3>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Your preparation consistency
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
            {monthLabel}
          </span>
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className="bg-slate-50/60 dark:bg-[#0a0e17] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {weekDays.map((d) => (
            <span
              key={d}
              className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before Sept 1 (Tue) */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7 w-full" />
          ))}

          {/* Days 1 to 30 */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
            const activity = activitiesByDate[dateStr];
            const isSelected = activeSelected === dateStr;
            const isToday = dateStr === '2026-09-30';

            // Determine intensity styling
            let intensityClass = 'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border border-transparent';
            let dotClass = '';

            if (activity && activity.studyMinutes > 0) {
              if (activity.level === 'high' || activity.studyMinutes > 75) {
                intensityClass = 'bg-brand-600 dark:bg-brand-500 text-white font-bold shadow-xs';
                dotClass = 'bg-white';
              } else if (activity.level === 'medium' || activity.studyMinutes > 45) {
                intensityClass = 'bg-brand-500/70 dark:bg-brand-600/80 text-white font-medium';
                dotClass = 'bg-white';
              } else {
                // Light
                intensityClass = 'bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60';
                dotClass = 'bg-brand-500';
              }
            }

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDayClick(dateStr)}
                title={`${monthName} ${dayNum}: ${activity ? formatMinutes(activity.studyMinutes) : 'No study activity'}`}
                className={`relative h-7 w-full rounded-md flex flex-col items-center justify-center text-[11px] transition-all cursor-pointer ${intensityClass} ${
                  isSelected
                    ? 'ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-[#111827] scale-105 z-10'
                    : 'hover:opacity-85'
                }`}
              >
                <span>{dayNum}</span>
                {activity && activity.studyMinutes > 0 && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${dotClass || 'bg-brand-500'}`} />
                )}
                {isToday && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>Activity</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xs">None</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" />
            <span className="w-2.5 h-2.5 rounded bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800/60" />
            <span className="w-2.5 h-2.5 rounded bg-brand-500/70" />
            <span className="w-2.5 h-2.5 rounded bg-brand-600 dark:bg-brand-500" />
            <span className="text-2xs">High</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Inspection Detail for Selected Day */}
      <div className="p-3 bg-slate-50/80 dark:bg-[#0e1422] rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs transition-all space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
          <span className="font-bold text-slate-900 dark:text-white">
            {monthName} {selectedDayNum}
            {activeSelected === '2026-09-30' && (
              <span className="ml-1.5 text-2xs font-semibold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                Today
              </span>
            )}
          </span>
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Study time: {selectedActivity ? formatMinutes(selectedActivity.studyMinutes) : '0m'}
          </span>
        </div>

        {selectedActivity && selectedActivity.studyMinutes > 0 ? (
          <div className="space-y-1.5">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Completed
            </span>
            <div className="space-y-1">
              {selectedActivity.completedItems && selectedActivity.completedItems.length > 0 ? (
                selectedActivity.completedItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>
                    {selectedActivity.dsaProblems > 0 && `${selectedActivity.dsaProblems} DSA problems `}
                    {selectedActivity.sqlQuestions > 0 && `${selectedActivity.sqlQuestions} SQL questions `}
                    {selectedActivity.quizCount > 0 && `${selectedActivity.quizCount} Quiz `}
                    session
                  </span>
                </div>
              )}
            </div>

            <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
              <span>Total study duration</span>
              <strong className="text-slate-700 dark:text-slate-300">
                {formatMinutes(selectedActivity.studyMinutes)}
              </strong>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-slate-400 dark:text-slate-500 text-xs">
            No study activity
          </div>
        )}
      </div>
    </div>
  );
}
