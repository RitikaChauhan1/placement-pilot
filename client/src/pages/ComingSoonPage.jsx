import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Code2,
  Database,
  Video,
  TrendingUp,
  Settings,
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle2
} from 'lucide-react';

const MODULE_CONFIG = {
  '/study-plan': {
    title: 'Personalized Study Plan',
    subtitle: 'Adaptive 30-day and 60-day placement preparation calendars',
    icon: Calendar,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50',
    roadmap: [
      'Day-by-day curated curriculum tailored to your target company date',
      'Daily milestone tracking across Aptitude, DSA, and Core CS',
      'Automatic readjustment based on your daily quiz scores',
    ],
  },
  '/dsa': {
    title: 'DSA Practice Sheets',
    subtitle: 'Curated 150+ coding problems categorized by pattern and company',
    icon: Code2,
    color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-900/50',
    roadmap: [
      'Array, Two Pointers, Sliding Window, Trees, and DP tracks',
      'Previous placement questions asked in Accenture, TCS Digital, and Google',
      'In-browser code editor and automated test-case runner',
    ],
  },
  '/dsa-practice': {
    title: 'DSA Practice Sheets',
    subtitle: 'Curated 150+ coding problems categorized by pattern and company',
    icon: Code2,
    color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-900/50',
    roadmap: [
      'Array, Two Pointers, Sliding Window, Trees, and DP tracks',
      'Previous placement questions asked in Accenture, TCS Digital, and Google',
      'In-browser code editor and automated test-case runner',
    ],
  },
  '/sql': {
    title: 'SQL Practice Arena',
    subtitle: 'Interactive database query challenges and schema interview questions',
    icon: Database,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
    roadmap: [
      'Master Joins, Subqueries, Aggregations, and Window Functions',
      'Real-world mock placement schemas (E-Commerce, Banking, HRMS)',
      'Instant query execution with visual table output and validation',
    ],
  },
  '/sql-practice': {
    title: 'SQL Practice Arena',
    subtitle: 'Interactive database query challenges and schema interview questions',
    icon: Database,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
    roadmap: [
      'Master Joins, Subqueries, Aggregations, and Window Functions',
      'Real-world mock placement schemas (E-Commerce, Banking, HRMS)',
      'Instant query execution with visual table output and validation',
    ],
  },
  '/mock-interviews': {
    title: 'Mock Technical Interviews',
    subtitle: 'Simulated 1-on-1 placement interview rounds with immediate feedback',
    icon: Video,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50',
    roadmap: [
      'Simulate technical, HR, and managerial campus rounds',
      'Real-time coding whiteboard with technical follow-up questions',
      'Performance evaluation across communication, logic, and complexity',
    ],
  },
  '/progress': {
    title: 'Detailed Progress & Analytics',
    subtitle: 'Comprehensive performance breakdown across placement competencies',
    icon: TrendingUp,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
    roadmap: [
      'Topic-level mastery heatmaps and problem-solving velocity',
      'Benchmarking against peers applying for similar roles',
      'Predicted percentile for upcoming campus drives',
    ],
  },
  '/settings': {
    title: 'Account Settings',
    subtitle: 'Notification preferences, security settings, and profile controls',
    icon: Settings,
    color: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    roadmap: [
      'Manage login credentials and two-factor authentication',
      'Campus drive reminder email and SMS alerts',
      'Export preparation report for college placement coordinators',
    ],
  },
};

export default function ComingSoonPage() {
  const location = useLocation();
  const moduleInfo = MODULE_CONFIG[location.pathname] || {
    title: 'Module Under Development',
    subtitle: 'This feature is being crafted for an upcoming release of PlacementPilot',
    icon: Sparkles,
    color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-900/50',
    roadmap: ['Detailed module roadmap and interactive tools launching soon.'],
  };

  const Icon = moduleInfo.icon;

  return (
    <div className="max-w-3xl mx-auto py-5 space-y-4 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Active Focus Session Banner if navigated from Today's Focus */}
      {location.state?.focusTopic && (
        <div className="p-3 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 rounded-xl flex items-center justify-between text-xs text-brand-900 dark:text-brand-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Active Session: <strong>{location.state.focusTopic}</strong> ({location.state.difficulty || 'Medium'})</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">Recommended Topic</span>
        </div>
      )}

      {/* Main Feature Announcement Card */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 sm:p-8 text-center space-y-4 transition-colors duration-200">
        <div className="flex justify-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-2xs ${moduleInfo.color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 rounded-full text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            <span>Coming in Next Milestone</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {moduleInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {moduleInfo.subtitle}
          </p>
        </div>

        {/* Feature Roadmap Preview Box */}
        <div className="max-w-md mx-auto text-left bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-3.5 border border-slate-200/90 dark:border-slate-700/80 space-y-2">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            What is coming in this module:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {moduleInfo.roadmap.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all"
          >
            <span>Return to Student Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
