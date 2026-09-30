import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyPlanApi, dashboardApi } from '../services/api';

// Subcomponents
import PreparationGoalCard from '../components/studyPlan/PreparationGoalCard';
import TargetMismatchAlert from '../components/studyPlan/TargetMismatchAlert';
import RoadmapPhasesView from '../components/studyPlan/RoadmapPhasesView';
import DailyTasksSchedule from '../components/studyPlan/DailyTasksSchedule';
import PlanOptionsModal from '../components/studyPlan/PlanOptionsModal';

import {
  Sparkles,
  RefreshCw,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';

const GENERATION_STEPS = [
  'Analyzing your profile & skills...',
  'Analyzing target company & role benchmarks...',
  'Analyzing preparation timeline & available hours...',
  'Analyzing current topic performance & weak areas...',
  'Synthesizing personalized phases & daily tasks...'
];

export default function StudyPlanPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);

  // Modal & hours
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isUpdatingHours, setIsUpdatingHours] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  // Fetch active study plan
  const fetchStudyPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await studyPlanApi.getStudyPlan();
      if (res.success && res.data) {
        setPlanData(res.data);
      }
    } catch (err) {
      console.error('Error fetching study plan:', err);
      setError(err.message || 'Failed to load study plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  // Handle plan generation / regeneration with multi-step feedback
  const handleGenerate = async (dailyStudyHours = 2) => {
    try {
      setIsGenerating(true);
      setGenerationStepIndex(0);

      // Step animation
      const interval = setInterval(() => {
        setGenerationStepIndex((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);

      const res = await studyPlanApi.generatePlan({
        dailyStudyHours,
        isRegeneration: !!planData?.plan
      });

      clearInterval(interval);

      if (res.success && res.data) {
        setPlanData((prev) => ({
          ...prev,
          hasPlan: true,
          plan: res.data.plan,
          phases: res.data.phases,
          tasks: res.data.tasks,
          profileMismatch: null
        }));
        setSuccessBanner(res.message || 'Personalized roadmap created successfully!');
        setTimeout(() => setSuccessBanner(''), 4500);
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
      setError(err.message || 'Failed to generate study plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Adjust daily study hours
  const handleHoursChange = async (newHours) => {
    try {
      setIsUpdatingHours(true);
      await studyPlanApi.adjustHours(newHours);
      setPlanData((prev) => ({
        ...prev,
        goal: { ...prev.goal, dailyStudyHours: newHours },
        plan: prev.plan ? { ...prev.plan, daily_study_hours: newHours } : prev.plan
      }));
      setSuccessBanner(`Daily preparation workload adjusted to ${newHours} hr${newHours > 1 ? 's' : ''}/day.`);
      setTimeout(() => setSuccessBanner(''), 3500);
    } catch (err) {
      console.error('Failed to adjust hours:', err);
    } finally {
      setIsUpdatingHours(false);
    }
  };

  // Handle task completion toggle from Study Plan
  const handleToggleTask = async (taskId) => {
    try {
      setTogglingTaskId(taskId);

      // Optimistic update
      setPlanData((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return {
          ...prev,
          tasks: updatedTasks
        };
      });

      // Update backend via dashboard API to sync streak & daily check-in
      await dashboardApi.toggleTask(taskId);

      // Re-fetch to guarantee complete sync
      const res = await studyPlanApi.getStudyPlan();
      if (res.success && res.data) {
        setPlanData(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle task in study plan:', err);
    } finally {
      setTogglingTaskId(null);
    }
  };

  // 1. Loading Skeleton
  if (loading && !planData) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="lg:col-span-5 h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error && !planData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          We couldn't load your study plan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error}
        </p>
        <button
          type="button"
          onClick={fetchStudyPlan}
          className="btn-compact-primary text-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    hasPlan,
    plan,
    phases = [],
    tasks = [],
    goal = {},
    missingFields = [],
    canGenerate = true,
    profileMismatch
  } = planData || {};

  return (
    <div className="space-y-5 animate-fadeIn max-w-6xl mx-auto">
      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Target Mismatch Alert */}
      <TargetMismatchAlert
        mismatch={profileMismatch}
        onAdapt={() => handleGenerate(goal.dailyStudyHours)}
        onKeep={() => setPlanData((prev) => ({ ...prev, profileMismatch: null }))}
        isAdapting={isGenerating}
      />

      {/* 1. Preparation Goal Section */}
      <PreparationGoalCard
        goal={goal}
        missingFields={missingFields}
        dailyHours={goal.dailyStudyHours || 2}
        onHoursChange={handleHoursChange}
        isUpdatingHours={isUpdatingHours}
      />

      {/* 2. Generating Step-by-Step Loading Overlay */}
      {isGenerating && (
        <div className="p-8 bg-white dark:bg-[#111827] rounded-2xl border border-brand-300 dark:border-brand-800/80 shadow-premium flex flex-col items-center justify-center space-y-4 animate-fadeIn text-center">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin" />
            <Sparkles className="w-5 h-5 text-amber-500 absolute animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Preparation Engine is Running
            </h3>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {GENERATION_STEPS[generationStepIndex]}
            </p>
          </div>

          <div className="w-64 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${((generationStepIndex + 1) / GENERATION_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Empty State / First-Time Generator */}
      {!hasPlan && !isGenerating && (
        <div className="py-12 px-6 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
            <Target className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Welcome to your personalized preparation roadmap 🎯
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
              PlacementPilot's AI engine will synthesize your target role ({goal.targetRole}), company benchmarks ({goal.targetCompany}), and available time into structured weekly phases and daily tasks.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={!canGenerate || isGenerating}
              onClick={() => handleGenerate(goal.dailyStudyHours || 2)}
              className="btn-compact-primary py-2.5 px-5 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>✨ Generate My Preparation Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Active Plan Display: 2-Column Responsive Layout */}
      {hasPlan && !isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Roadmap Phases View (7 cols) */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <RoadmapPhasesView
              plan={plan}
              phases={phases}
              onOpenOptionsModal={() => setIsOptionsModalOpen(true)}
            />
          </div>

          {/* Right Column: Today's Scheduled Tasks (5 cols) */}
          <div className="lg:col-span-5 space-y-5 min-w-0 lg:sticky lg:top-20">
            <DailyTasksSchedule
              tasks={tasks}
              onToggleTask={handleToggleTask}
              isToggling={!!togglingTaskId}
              dailyHours={goal.dailyStudyHours || 2}
            />
          </div>
        </div>
      )}

      {/* 5. Options Modal */}
      <PlanOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        plan={plan}
        onRegenerate={() => handleGenerate(goal.dailyStudyHours || 2)}
        onAdjustHours={handleHoursChange}
        isRegenerating={isGenerating}
      />
    </div>
  );
}
