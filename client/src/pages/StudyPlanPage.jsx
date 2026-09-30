import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyPlanApi, dashboardApi } from '../services/api';

// Subcomponents
import StudyPlanHeader from '../components/studyPlan/StudyPlanHeader';
import PlanSummaryCards from '../components/studyPlan/PlanSummaryCards';
import PlanTabs from '../components/studyPlan/PlanTabs';
import RoadmapTab from '../components/studyPlan/RoadmapTab';
import DailyPlanTab from '../components/studyPlan/DailyPlanTab';
import WeeklyPlanTab from '../components/studyPlan/WeeklyPlanTab';
import TopicsTab from '../components/studyPlan/TopicsTab';
import ResourcesTab from '../components/studyPlan/ResourcesTab';
import AIStudyPlanner from '../components/studyPlan/AIStudyPlanner';
import PlanRegenerationModal from '../components/studyPlan/PlanRegenerationModal';
import StudyTimeEditorModal from '../components/studyPlan/StudyTimeEditorModal';
import PreparationFocusModal from '../components/studyPlan/PreparationFocusModal';
import TargetMismatchAlert from '../components/studyPlan/TargetMismatchAlert';
import AddTaskModal from '../components/studyPlan/AddTaskModal';

import {
  Sparkles,
  RefreshCw,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';

const GENERATION_STEPS = [
  'Analyzing student profile & career aspirations...',
  'Analyzing Accenture benchmark evaluation patterns...',
  'Balancing available study hours across 26 days...',
  'Synthesizing diagnostic weak areas into structured phases...',
  'Generating personalized roadmap and daily task schedules...'
];

export default function StudyPlanPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'daily' | 'weekly' | 'topics' | 'resources'

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);

  // Modals state
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isMobileAiOpen, setIsMobileAiOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');
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

  // Handle plan generation / regeneration
  const handleGenerate = async ({ dailyStudyHours = 2, preserveCompleted = true } = {}) => {
    try {
      setIsGenerating(true);
      setGenerationStepIndex(0);

      const interval = setInterval(() => {
        setGenerationStepIndex((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);

      const res = await studyPlanApi.generatePlan({
        dailyStudyHours,
        preserveCompleted
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
    }
  };

  // Toggle task completion status
  const handleToggleTask = async (taskId) => {
    try {
      // Optimistic update
      setPlanData((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...prev, tasks: updatedTasks };
      });

      const res = await dashboardApi.toggleTask(taskId);
      if (res.success && res.task) {
        setPlanData((prev) => {
          if (!prev) return prev;
          const syncedTasks = prev.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: res.task.completed } : t
          );
          return { ...prev, tasks: syncedTasks };
        });
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      // Revert on error
      fetchStudyPlan();
    }
  };

  // Add Task
  const handleAddTask = async (taskData) => {
    const res = await studyPlanApi.createTask(taskData);
    if (res.success && res.task) {
      setPlanData((prev) => ({
        ...prev,
        tasks: [res.task, ...(prev?.tasks || [])]
      }));
      setSuccessBanner(`Added "${res.task.title}" to today's schedule!`);
      setTimeout(() => setSuccessBanner(''), 3500);
    }
  };

  // Update Task
  const handleUpdateTask = async (taskId, updates) => {
    const res = await studyPlanApi.updateTask(taskId, updates);
    if (res.success && res.task) {
      setPlanData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...res.task } : t))
      }));
      setSuccessBanner('Task updated successfully.');
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const res = await studyPlanApi.deleteTask(taskId);
    if (res.success) {
      setPlanData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId)
      }));
      setSuccessBanner('Task removed from plan.');
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

  // Topic Added Callback from TopicsTab
  const handleTopicAdded = (newTask) => {
    if (newTask) {
      setPlanData((prev) => ({
        ...prev,
        tasks: [newTask, ...(prev?.tasks || [])]
      }));
    }
    fetchStudyPlan();
  };

  // Plan Updated from AI planner
  const handleAiPlanUpdated = (refreshedData) => {
    if (refreshedData) {
      setPlanData((prev) => ({
        ...prev,
        hasPlan: true,
        plan: refreshedData.plan || prev?.plan,
        phases: refreshedData.phases || prev?.phases,
        tasks: refreshedData.tasks || prev?.tasks
      }));
    } else {
      fetchStudyPlan();
    }
  };

  // 1. Loading State
  if (loading && !planData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
          Loading your personalized preparation plan...
        </p>
      </div>
    );
  }

  // 2. Generation in progress animation
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 mb-5 animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Generating AI Study Plan</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Constructing your customized multi-phase placement roadmap.
        </p>
        <div className="w-full bg-card border border-border p-4 rounded-xl shadow-xs space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{GENERATION_STEPS[generationStepIndex]}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{ width: `${((generationStepIndex + 1) / GENERATION_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. No Plan State
  if (!planData?.hasPlan) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Let's create your personalized placement roadmap</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          PlacementPilot will analyze your target company ({profile?.target_companies?.split(',')[0] || 'Accenture'}), role, interview timeline, and available hours to build a custom roadmap.
        </p>
        <button
          onClick={() => handleGenerate()}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate My Plan</span>
        </button>
      </div>
    );
  }

  const tasksList = planData?.tasks || [];
  const completedCount = tasksList.filter((t) => t.completed).length;

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <StudyPlanHeader
        plan={planData.plan}
        onRegenerateClick={() => setIsRegenerateModalOpen(true)}
        onOpenHoursModal={() => setIsHoursModalOpen(true)}
      />

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm text-emerald-400 font-medium flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Target Mismatch Alert */}
      {planData.profileMismatch && (
        <TargetMismatchAlert
          mismatch={planData.profileMismatch}
          onRegenerate={() => setIsRegenerateModalOpen(true)}
          onDismiss={() => setPlanData((prev) => ({ ...prev, profileMismatch: null }))}
        />
      )}

      {/* Personalized Plan Summary: 4 Compact Cards */}
      <PlanSummaryCards
        goal={planData.goal}
        plan={planData.plan}
        profile={profile}
        onEditHours={() => setIsHoursModalOpen(true)}
        onEditFocus={() => setIsFocusModalOpen(true)}
      />

      {/* 3-Column Desktop Layout: Center Main Workspace & Right Persistent AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Study Plan Workspace (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Plan Navigation Tabs */}
          <PlanTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            tasksCount={tasksList.length}
            completedTasksCount={completedCount}
          />

          {/* Tab Content Display */}
          <div className="pt-1">
            {activeTab === 'roadmap' && (
              <RoadmapTab
                plan={planData.plan}
                phases={planData.phases}
                tasks={planData.tasks}
                onToggleTask={handleToggleTask}
                onOpenAddTask={() => setIsAddTaskModalOpen(true)}
                onOpenQuickAction={(action) => {
                  if (action === 'add_topic') setActiveTab('topics');
                  else if (action === 'remove_topic') setQuickPrompt('Remove Operating Systems from my study plan.');
                  else if (action === 'adjust_time') setIsHoursModalOpen(true);
                  else if (action === 'focus_weak') setQuickPrompt('Focus on weak areas: Binary Search and SQL Joins.');
                }}
              />
            )}

            {activeTab === 'daily' && (
              <DailyPlanTab
                tasks={tasksList}
                selectedDate="2026-09-30"
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === 'weekly' && (
              <WeeklyPlanTab
                tasks={tasksList}
                onToggleTask={handleToggleTask}
              />
            )}

            {activeTab === 'topics' && (
              <TopicsTab onTopicAdded={handleTopicAdded} />
            )}

            {activeTab === 'resources' && (
              <ResourcesTab />
            )}
          </div>
        </div>

        {/* Right Persistent AI Study Planner Panel (4 Cols on Desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 h-[calc(100vh-6.5rem)]">
          <AIStudyPlanner
            userName={user?.full_name?.split(' ')[0] || 'Ritika'}
            onPlanUpdated={handleAiPlanUpdated}
            quickTriggerPrompt={quickPrompt}
          />
        </div>
      </div>

      {/* Floating Trigger Button for AI Planner on Tablet / Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileAiOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-xs shadow-xl active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>✨ AI Planner</span>
        </button>
      </div>

      {/* Mobile AI Planner Drawer / Modal */}
      {isMobileAiOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-3 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-lg h-[85vh] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <AIStudyPlanner
              userName={user?.full_name?.split(' ')[0] || 'Ritika'}
              onPlanUpdated={handleAiPlanUpdated}
              isMobileDrawer={true}
              onCloseDrawer={() => setIsMobileAiOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Controlled Plan Regeneration Modal */}
      <PlanRegenerationModal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        onConfirmRegenerate={handleGenerate}
        completedTasksCount={completedCount}
      />

      {/* Study Time Editor Modal */}
      <StudyTimeEditorModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        currentWeekdayHours={planData?.plan?.daily_study_hours || 2}
        onSave={handleHoursChange}
      />

      {/* Preparation Focus Selector Modal */}
      <PreparationFocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onSave={() => {
          setSuccessBanner('Preparation focus tags updated.');
          setTimeout(() => setSuccessBanner(''), 3000);
        }}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
