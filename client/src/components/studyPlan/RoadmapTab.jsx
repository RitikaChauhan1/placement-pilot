import React from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  LayoutGrid,
  GitCommit,
  Sparkles,
  Plus,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadmapTab({
  plan,
  phases = [],
  tasks = [],
  onToggleTask,
  onOpenAddTask,
  onOpenQuickAction
}) {
  const daysRemaining = plan?.days_remaining || 26;

  // Curated 5 phases matching the reference image
  const phaseCards = [
    {
      number: 1,
      name: 'DSA Foundations',
      days: 'Days 1 – 7',
      progress: 80,
      color: 'cyan',
      circleBg: 'bg-cyan-500 text-slate-950',
      progressBar: 'bg-cyan-400',
      activeBorder: 'border-cyan-500/50 shadow-sm shadow-cyan-500/10',
      topics: [
        { name: 'Arrays', completed: true },
        { name: 'Strings', completed: true },
        { name: 'Hashing', completed: true },
        { name: 'Binary Search', completed: false },
        { name: 'Sliding Window', completed: false },
      ],
      moreCount: 2,
      moreColor: 'text-cyan-400'
    },
    {
      number: 2,
      name: 'Core CS',
      days: 'Days 8 – 14',
      progress: 45,
      color: 'purple',
      circleBg: 'bg-purple-600 text-white',
      progressBar: 'bg-purple-500',
      activeBorder: 'border-slate-800/80',
      topics: [
        { name: 'DBMS', completed: true },
        { name: 'Operating Systems', completed: false },
        { name: 'Computer Networks', completed: false },
        { name: 'OOP', completed: false },
        { name: 'CN Revision', completed: false },
      ],
      moreCount: 1,
      moreColor: 'text-purple-400'
    },
    {
      number: 3,
      name: 'SQL + Programming',
      days: 'Days 15 – 19',
      progress: 30,
      color: 'amber',
      circleBg: 'bg-amber-500 text-slate-950',
      progressBar: 'bg-amber-400',
      activeBorder: 'border-slate-800/80',
      topics: [
        { name: 'SQL Joins', completed: false },
        { name: 'Subqueries', completed: false },
        { name: 'Window Functions', completed: false },
        { name: 'Python / Java', completed: false },
        { name: 'React Basics', completed: false },
      ],
      moreCount: 2,
      moreColor: 'text-amber-400'
    },
    {
      number: 4,
      name: 'Mock Interviews',
      days: 'Days 20 – 23',
      progress: 0,
      color: 'pink',
      circleBg: 'bg-pink-600 text-white',
      progressBar: 'bg-pink-500',
      activeBorder: 'border-slate-800/80',
      topics: [
        { name: 'Technical Mock', completed: false },
        { name: 'HR Mock', completed: false },
        { name: 'Company Specific', completed: false },
        { name: 'Resume Review', completed: false },
        { name: 'Project Discussion', completed: false },
      ],
      moreCount: 0
    },
    {
      number: 5,
      name: 'Final Revision',
      days: 'Days 24 – 26',
      progress: 0,
      color: 'red',
      circleBg: 'bg-red-500 text-white',
      progressBar: 'bg-red-500',
      activeBorder: 'border-slate-800/80',
      topics: [
        { name: 'Weak Topics', completed: false },
        { name: 'Previous Papers', completed: false },
        { name: 'Aptitude Revision', completed: false },
        { name: 'Key Formulas', completed: false },
        { name: 'Final Mock', completed: false },
      ],
      moreCount: 0
    }
  ];

  // Week days matching reference image
  const weekDays = [
    { day: 'Mon 28', tasks: '4 tasks', active: true },
    { day: 'Tue 29', tasks: '4 tasks', active: false },
    { day: 'Wed 30', tasks: '4 tasks', active: false },
    { day: 'Thu 1', tasks: '4 tasks', active: false },
    { day: 'Fri 2', tasks: '4 tasks', active: false },
    { day: 'Sat 3', tasks: '5 tasks', active: false },
    { day: 'Sun 4', tasks: '5 tasks', active: false },
  ];

  // Daily tasks matching reference image
  const dailyTasks = [
    {
      id: 1,
      title: 'Solve 3 Binary Search problems',
      category: 'DSA',
      categoryColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
      priority: 'High',
      priorityColor: 'bg-red-500/15 text-red-400 border border-red-500/25',
      duration: '45 min',
      completed: true,
      actionBtn: 'Start Again',
      route: '/dsa'
    },
    {
      id: 2,
      title: 'Revise SQL Joins',
      category: 'SQL',
      categoryColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
      priority: 'High',
      priorityColor: 'bg-red-500/15 text-red-400 border border-red-500/25',
      duration: '30 min',
      completed: false,
      actionBtn: 'Start',
      route: '/sql'
    },
    {
      id: 3,
      title: 'Complete DBMS Normalization Quiz',
      category: 'Core CS',
      categoryColor: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
      priority: 'Medium',
      priorityColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
      duration: '20 min',
      completed: false,
      actionBtn: 'Start',
      route: '/study-plan'
    },
    {
      id: 4,
      title: 'React Basics – Components & Props',
      category: 'Frontend',
      categoryColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
      priority: 'Medium',
      priorityColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
      duration: '30 min',
      completed: true,
      actionBtn: 'View',
      route: '/study-plan'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. ROADMAP SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-white">Your Personalized Roadmap</h2>
          <span className="text-xs text-slate-400">26 Days • 5 Phases • 68 Tasks</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11192e] hover:bg-[#16223d] text-slate-300 border border-slate-800/80 text-xs font-medium transition-colors">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>View as Timeline</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11192e] hover:bg-[#16223d] text-slate-300 border border-slate-800/80 text-xs font-medium transition-colors">
            <span>26 Days Plan</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. FIVE HORIZONTAL PHASE CARDS (5-COL GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {phaseCards.map((phase) => (
          <div
            key={phase.number}
            className={`p-3.5 rounded-xl bg-[#0e1424] border ${phase.activeBorder} flex flex-col justify-between transition-all`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${phase.circleBg} flex items-center justify-center font-bold text-[10px] shrink-0`}>
                  {phase.number}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium leading-none">
                    Phase {phase.number}
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {phase.name}
                  </div>
                </div>
              </div>

              {/* Days & Progress */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5">
                <span>{phase.days}</span>
                <span className="font-semibold text-slate-300">{phase.progress}%</span>
              </div>

              <div className="w-full h-1 rounded-full bg-slate-800/80 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${phase.progressBar}`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              {/* Topic List */}
              <div className="space-y-1.5 mt-3 text-xs">
                {phase.topics.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    {t.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={`text-[11px] truncate ${t.completed ? 'text-slate-300' : 'text-slate-400'}`}>
                      {t.name}
                    </span>
                  </div>
                ))}

                {phase.moreCount > 0 && (
                  <div className={`text-[10px] font-semibold ${phase.moreColor} pt-0.5 pl-5`}>
                    +{phase.moreCount} more
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. THIS WEEK'S PLAN SECTION */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs">✦</span>
            <h3 className="text-xs sm:text-sm font-bold text-white">This Week’s Plan</h3>
            <span className="text-[11px] text-slate-400">28 Sep – 4 Oct 2026</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1 rounded bg-[#11192e] text-slate-300 hover:text-white border border-slate-800/80 text-[11px] font-medium transition-colors">
              Today
            </button>
            <button className="p-1 rounded bg-[#11192e] text-slate-400 hover:text-white border border-slate-800/80 text-xs transition-colors">
              &lt;
            </button>
            <button className="p-1 rounded bg-[#11192e] text-slate-400 hover:text-white border border-slate-800/80 text-xs transition-colors">
              &gt;
            </button>
          </div>
        </div>

        {/* 7 Horizontal Day Cards */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d, idx) => (
            <button
              key={idx}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                d.active
                  ? 'bg-[#1d4ed8] text-white border-blue-500/60 shadow-xs'
                  : 'bg-[#0e1424] border-slate-800/80 hover:border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`text-xs font-bold ${d.active ? 'text-white' : 'text-slate-200'}`}>
                {d.day}
              </span>
              <span className={`text-[10px] mt-0.5 ${d.active ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                {d.tasks}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. DAILY TASK LIST HEADER & PROGRESS */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">✦</span>
              <h3 className="text-xs sm:text-sm font-bold text-white">Monday, 28 Sep 2026</h3>
            </div>
            <span className="text-[11px] text-slate-400">2 / 4 completed</span>
          </div>

          <div className="flex-1 max-w-xs mx-auto hidden sm:block">
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '50%' }} />
            </div>
          </div>

          <div>
            <button
              onClick={onOpenAddTask}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* 4 Daily Tasks List */}
        <div className="space-y-2">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onToggleTask && onToggleTask(task.id)}
                  className="shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <span className={`text-xs font-semibold truncate ${task.completed ? 'text-slate-300' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${task.categoryColor}`}>
                  {task.category}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${task.priorityColor}`}>
                  {task.priority}
                </span>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {task.duration}
                </span>

                <Link
                  to={task.route}
                  className="text-xs font-medium px-3 py-1 rounded-md bg-[#131b2e] hover:bg-[#1a253e] text-slate-200 border border-slate-700/60 transition-colors"
                >
                  {task.actionBtn}
                </Link>

                <button className="p-1 text-slate-500 hover:text-slate-300">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FOUR BOTTOM QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Action 1: Add a Topic */}
        <button
          onClick={() => onOpenQuickAction && onOpenQuickAction('add_topic')}
          className="p-3.5 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-teal-500/40 transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0d282e] text-[#14b8a6] flex items-center justify-center border border-teal-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">Add a Topic</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Include new topics in your plan
            </div>
          </div>
        </button>

        {/* Action 2: Remove a Topic */}
        <button
          onClick={() => onOpenQuickAction && onOpenQuickAction('remove_topic')}
          className="p-3.5 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-pink-500/40 transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2d121e] text-[#f43f5e] flex items-center justify-center border border-pink-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Circle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">Remove a Topic</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Exclude topics you don't need
            </div>
          </div>
        </button>

        {/* Action 3: Adjust Study Time */}
        <button
          onClick={() => onOpenQuickAction && onOpenQuickAction('adjust_time')}
          className="p-3.5 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-blue-500/40 transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0d1d3a] text-[#38bdf8] flex items-center justify-center border border-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">Adjust Study Time</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Change daily study hours
            </div>
          </div>
        </button>

        {/* Action 4: Focus on Weak Areas */}
        <button
          onClick={() => onOpenQuickAction && onOpenQuickAction('focus_weak')}
          className="p-3.5 rounded-xl bg-[#0e1424] border border-slate-800/80 hover:border-amber-500/40 transition-all flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#2d2210] text-[#f59e0b] flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">Focus on Weak Areas</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              Give more practice on weak topics
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
