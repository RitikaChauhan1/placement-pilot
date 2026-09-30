import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight as ArrowRightIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyPlanTab({
  tasks = [],
  onToggleTask
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday (Wed 30) is index 2

  const weekDays = [
    { day: 'Mon', date: '28', fullDate: '2026-09-28', tasksCount: 4, completedCount: 4 },
    { day: 'Tue', date: '29', fullDate: '2026-09-29', tasksCount: 4, completedCount: 3 },
    { day: 'Wed', date: '30', fullDate: '2026-09-30', tasksCount: tasks.length || 4, completedCount: tasks.filter(t => t.completed).length, isToday: true },
    { day: 'Thu', date: '1', fullDate: '2026-10-01', tasksCount: 4, completedCount: 0 },
    { day: 'Fri', date: '2', fullDate: '2026-10-02', tasksCount: 4, completedCount: 0 },
    { day: 'Sat', date: '3', fullDate: '2026-10-03', tasksCount: 5, completedCount: 0, isWeekend: true },
    { day: 'Sun', date: '4', fullDate: '2026-10-04', tasksCount: 5, completedCount: 0, isWeekend: true },
  ];

  const currentSelectedDay = weekDays[selectedDayIndex];

  const handlePrev = () => {
    setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedDayIndex((prev) => (prev < weekDays.length - 1 ? prev + 1 : prev));
  };

  const handleToday = () => {
    setSelectedDayIndex(2); // Wed 30 is today
  };

  // Curated task preview for different days to demonstrate true multi-day planning
  const getTasksForDay = (dayIndex) => {
    if (dayIndex === 2) return tasks; // Today's dynamic tasks
    if (dayIndex === 0) {
      return [
        { id: 101, title: 'Arrays & Two Pointers Warmup', category: 'DSA', duration: '30 min', priority: 'High', completed: true },
        { id: 102, title: 'Accenture Assessment Pattern Diagnostic', category: 'Aptitude', duration: '30 min', priority: 'Medium', completed: true },
        { id: 103, title: 'SQL Joins Essentials (INNER & LEFT)', category: 'SQL', duration: '30 min', priority: 'High', completed: true },
        { id: 104, title: 'Operating Systems Process State Notes', category: 'Core CS', duration: '30 min', priority: 'Medium', completed: true },
      ];
    }
    if (dayIndex === 1) {
      return [
        { id: 201, title: 'Sliding Window: Longest Substring Drill', category: 'DSA', duration: '45 min', priority: 'High', completed: true },
        { id: 202, title: 'SQL Aggregations: GROUP BY & HAVING Clauses', category: 'SQL', duration: '30 min', priority: 'High', completed: true },
        { id: 203, title: 'DBMS Normalization 1NF to 3NF Cheatsheet', category: 'Core CS', duration: '20 min', priority: 'Medium', completed: true },
        { id: 204, title: 'Quantitative Speed Drills: Percentages & Ratios', category: 'Aptitude', duration: '25 min', priority: 'Low', completed: false },
      ];
    }
    if (dayIndex === 3) {
      return [
        { id: 301, title: 'Binary Search in Rotated Sorted Array', category: 'DSA', duration: '45 min', priority: 'High', completed: false },
        { id: 302, title: 'SQL Window Functions: ROW_NUMBER & RANK', category: 'SQL', duration: '35 min', priority: 'High', completed: false },
        { id: 303, title: 'TCP/IP 3-Way Handshake & OSI Layers', category: 'Core CS', duration: '25 min', priority: 'Medium', completed: false },
        { id: 304, title: 'STAR Method HR Behavioral Answers Draft', category: 'Mock Interview', duration: '30 min', priority: 'Medium', completed: false },
      ];
    }
    if (dayIndex === 4) {
      return [
        { id: 401, title: 'Two-Sum & 3-Sum Optimal Pointers', category: 'DSA', duration: '45 min', priority: 'High', completed: false },
        { id: 402, title: 'DBMS ACID Properties & Transaction Locking', category: 'Core CS', duration: '30 min', priority: 'Medium', completed: false },
        { id: 403, title: 'Complex Subqueries & EXISTS vs IN', category: 'SQL', duration: '30 min', priority: 'High', completed: false },
        { id: 404, title: 'React Hooks Core: useState & useEffect', category: 'Frontend', duration: '30 min', priority: 'Medium', completed: false },
      ];
    }
    // Weekend days (heavy study time: 4-5 hours)
    return [
      { id: 501, title: 'Accenture Coding Section Simulation (2 Coding Questions)', category: 'DSA', duration: '60 min', priority: 'High', completed: false },
      { id: 502, title: 'Full Length Cognitive & Aptitude Speed Test', category: 'Aptitude', duration: '60 min', priority: 'High', completed: false },
      { id: 503, title: 'Deep Dive: OOP Pillars & Design Patterns (Singleton, Factory)', category: 'Core CS', duration: '45 min', priority: 'Medium', completed: false },
      { id: 504, title: 'Technical Mock Interview Simulation (STAR Round)', category: 'Mock Interview', duration: '45 min', priority: 'High', completed: false },
      { id: 505, title: 'Weekly Weak Topics Consolidation & Error Log Review', category: 'DSA', duration: '30 min', priority: 'Medium', completed: false },
    ];
  };

  const dayTasksList = getTasksForDay(selectedDayIndex);

  return (
    <div className="space-y-4">
      {/* Top Header & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>This Week’s Plan</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            28 Sep – 04 Oct 2026 • 26 total scheduled hours
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg bg-card border border-border">
            <button
              onClick={handlePrev}
              disabled={selectedDayIndex === 0}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-foreground/80">
              {currentSelectedDay.day} {currentSelectedDay.date}
            </span>
            <button
              onClick={handleNext}
              disabled={selectedDayIndex === weekDays.length - 1}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Day Pills Row */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto">
        {weekDays.map((d, idx) => {
          const isSelected = selectedDayIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/30'
                  : 'bg-card border-border/70 hover:border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase">{d.day}</span>
              <span className={`text-base sm:text-lg font-bold my-0.5 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {d.date}
              </span>
              <div className="flex items-center gap-1 mt-1 text-[10px]">
                <span className={`font-semibold ${d.completedCount === d.tasksCount && d.tasksCount > 0 ? 'text-emerald-400' : ''}`}>
                  {d.tasksCount} tasks
                </span>
              </div>
              {d.isToday && (
                <span className="mt-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Task List */}
      <div className="p-4 rounded-xl bg-card border border-border/70 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="text-sm font-bold text-foreground">
            Tasks for {currentSelectedDay.day}, {currentSelectedDay.date} {currentSelectedDay.isWeekend ? '(Extended Weekend Session)' : ''}
          </h3>
          <span className="text-xs text-muted-foreground">
            {currentSelectedDay.completedCount} of {dayTasksList.length} completed
          </span>
        </div>

        <div className="space-y-2">
          {dayTasksList.map((task) => {
            const isCompleted = task.completed;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  isCompleted
                    ? 'bg-card/40 border-border/40 opacity-75'
                    : 'bg-muted/30 border-border/60 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      if (selectedDayIndex === 2 && onToggleTask) {
                        onToggleTask(task.id);
                      }
                    }}
                    className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/60" />
                    )}
                  </button>
                  <div className="truncate">
                    <span className={`text-xs sm:text-sm font-semibold truncate ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground/80">{task.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {task.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    to={task.category === 'DSA' ? '/dsa' : task.category === 'SQL' ? '/sql' : '/study-plan'}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{isCompleted ? 'Review' : 'Practice'}</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
