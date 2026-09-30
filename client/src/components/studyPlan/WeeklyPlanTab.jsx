import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight as ArrowRightIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyPlanTab({
  tasks = [],
  onToggleTask
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Monday is index 0

  const weekDays = [
    { day: 'Mon 28', tasksCount: '4 tasks', completed: 2 },
    { day: 'Tue 29', tasksCount: '4 tasks', completed: 3 },
    { day: 'Wed 30', tasksCount: '4 tasks', completed: 4 },
    { day: 'Thu 1', tasksCount: '4 tasks', completed: 0 },
    { day: 'Fri 2', tasksCount: '4 tasks', completed: 0 },
    { day: 'Sat 3', tasksCount: '5 tasks', completed: 0 },
    { day: 'Sun 4', tasksCount: '5 tasks', completed: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">✦</span>
          <h2 className="text-sm sm:text-base font-bold text-white">This Week’s Plan</h2>
          <span className="text-xs text-slate-400">28 Sep – 4 Oct 2026</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedDayIndex(0)}
            className="px-2.5 py-1 rounded bg-[#11192e] text-slate-300 hover:text-white border border-slate-800/80 text-xs font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
            className="p-1 rounded bg-[#11192e] text-slate-400 hover:text-white border border-slate-800/80 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSelectedDayIndex((prev) => Math.min(weekDays.length - 1, prev + 1))}
            className="p-1 rounded bg-[#11192e] text-slate-400 hover:text-white border border-slate-800/80 text-xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7 Days Row */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((d, idx) => {
          const isSelected = selectedDayIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                  : 'bg-[#0e1424] border-slate-800/80 hover:border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {d.day}
              </span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                {d.tasksCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Tasks List */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <h3 className="text-xs sm:text-sm font-bold text-white">
            Tasks for {weekDays[selectedDayIndex].day}
          </h3>
          <span className="text-xs text-slate-400">
            {weekDays[selectedDayIndex].tasksCount}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-[#11192e] border border-slate-800/70 hover:border-slate-700/70 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className={`text-xs font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/25">
                  {task.category || 'DSA'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {task.duration || '30 min'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
