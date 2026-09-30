import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';

// Subcomponents
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TodaysPlan from '../components/dashboard/TodaysPlan';
import PreparationProgress from '../components/dashboard/PreparationProgress';
import RecommendedForYou from '../components/dashboard/RecommendedForYou';
import QuickPractice from '../components/dashboard/QuickPractice';
import DailyCheckIn from '../components/dashboard/DailyCheckIn/DailyCheckIn';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  // Fetch full dashboard summary
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardApi.getSummary();
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        throw new Error(res.message || 'Failed to retrieve dashboard data.');
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError(err.message || 'We couldn\'t load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Centralized interactive task toggle
  const handleToggleTask = async (taskId) => {
    if (!dashboardData) return;

    // Previous state snapshot for rollback if needed
    const previousData = { ...dashboardData };

    try {
      setTogglingTaskId(taskId);

      // 1. Optimistic central state update
      setDashboardData((prev) => {
        if (!prev) return prev;

        const updatedTasks = prev.todaysTasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });

        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const total = updatedTasks.length || 1;
        const completionRate = Math.round((completedCount / total) * 100);

        // Dynamic readiness shift
        const targetTask = prev.todaysTasks.find((t) => t.id === taskId);
        const wasCompleted = targetTask ? targetTask.completed : false;
        const readinessDelta = wasCompleted ? -2 : 2;
        const newOverallReady = Math.min(
          100,
          Math.max(20, (prev.preparationProgress?.overallReady || 65) + readinessDelta)
        );

        // Update today's daily activity (Sep 30, 2026)
        const todayKey = '2026-09-30';
        const currentDaily = prev.dailyCheckIn?.activitiesByDate?.[todayKey] || {
          date: todayKey,
          studyMinutes: 80,
          level: 'high',
          dsaProblems: 3,
          sqlQuestions: 2,
          quizCount: 1,
          sessionsCompleted: 2,
          completedItems: []
        };

        let updatedCompletedItems = [...(currentDaily.completedItems || [])];
        let updatedStudyMins = currentDaily.studyMinutes || 80;

        if (!wasCompleted) {
          // Marking as completed
          if (targetTask && !updatedCompletedItems.includes(targetTask.title)) {
            updatedCompletedItems.push(targetTask.title);
          }
          updatedStudyMins += 25;
        } else {
          // Unchecking
          if (targetTask) {
            updatedCompletedItems = updatedCompletedItems.filter((item) => item !== targetTask.title);
          }
          updatedStudyMins = Math.max(20, updatedStudyMins - 25);
        }

        const updatedActivitiesByDate = {
          ...prev.dailyCheckIn?.activitiesByDate,
          [todayKey]: {
            ...currentDaily,
            studyMinutes: updatedStudyMins,
            completedItems: updatedCompletedItems,
            level: updatedStudyMins > 75 ? 'high' : updatedStudyMins > 45 ? 'medium' : 'light'
          }
        };

        return {
          ...prev,
          todaysTasks: updatedTasks,
          tasksSummary: {
            ...prev.tasksSummary,
            completed: completedCount,
            pending: total - completedCount,
            completionRate
          },
          preparationProgress: {
            ...prev.preparationProgress,
            overallReady: newOverallReady
          },
          dailyCheckIn: {
            ...prev.dailyCheckIn,
            activitiesByDate: updatedActivitiesByDate
          }
        };
      });

      // 2. Call backend PATCH endpoint
      await dashboardApi.toggleTask(taskId);

      // 3. Silent re-sync
      const refreshRes = await dashboardApi.getSummary();
      if (refreshRes.success && refreshRes.data) {
        setDashboardData(refreshRes.data);
      }
    } catch (err) {
      console.error('Failed to toggle task status:', err);
      // Rollback to previous state
      setDashboardData(previousData);
    } finally {
      setTogglingTaskId(null);
    }
  };

  // Add new task handler
  const handleAddTask = async (taskPayload) => {
    try {
      const res = await dashboardApi.addTask(taskPayload);
      if (res.success) {
        // Refresh summary
        const refreshRes = await dashboardApi.getSummary();
        if (refreshRes.success && refreshRes.data) {
          setDashboardData(refreshRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  // 1. Loading Skeleton State
  if (loading && !dashboardData) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-800/80 rounded-lg w-1/3" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800/70 rounded-xl w-full" />

        {/* 3-Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main workspace skeleton */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="h-56 bg-slate-200 dark:bg-slate-800/70 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-48 bg-slate-200 dark:bg-slate-800/70 rounded-xl" />
              <div className="h-48 bg-slate-200 dark:bg-slate-800/70 rounded-xl" />
            </div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800/70 rounded-xl" />
          </div>

          {/* Right calendar skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="h-96 bg-slate-200 dark:bg-slate-800/70 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error && !dashboardData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            We couldn't load your dashboard.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {error || 'An unexpected error occurred while communicating with the server.'}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchDashboardData}
          className="btn-compact-primary text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const data = dashboardData || {};
  const activeUser = data.user || user;
  const target = data.target || {
    company: profile?.target_companies?.split(',')[0]?.trim() || 'Accenture',
    role: profile?.target_role || 'Software Development Engineer',
    daysRemaining: data.daysUntilInterview || 30,
    targetDate: '26 Oct 2026',
    planRoute: '/study-plan'
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 3-AREA DESKTOP LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CENTER COLUMN: Main Student Preparation Workspace (8 cols on desktop) */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-5 min-w-0">
          {/* 1. Welcome Header & Dynamic Target Summary */}
          <DashboardHeader user={activeUser} target={target} />

          {/* 2. Today's Plan — PRIMARY FEATURE */}
          <TodaysPlan
            tasks={data.todaysTasks || []}
            summary={data.tasksSummary || {}}
            continueLearning={data.continueLearning}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            isToggling={!!togglingTaskId}
          />

          {/* 3. Preparation Progress & AI Recommendation (Compact Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <PreparationProgress progress={data.preparationProgress} />
            <RecommendedForYou recommendation={data.aiRecommendation} />
          </div>

          {/* 4. Quick Practice Shortcuts */}
          <QuickPractice />
        </section>

        {/* RIGHT COLUMN: ONLY Daily Check-in / Activity Calendar (4 cols on desktop) */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-0">
          <DailyCheckIn dailyCheckIn={data.dailyCheckIn || {}} />
        </aside>
      </div>
    </div>
  );
}