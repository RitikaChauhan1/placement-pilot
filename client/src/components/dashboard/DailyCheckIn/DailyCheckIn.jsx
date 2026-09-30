import React, { useState } from 'react';
import ActivityCalendar from './ActivityCalendar';
import StreakSummary from './StreakSummary';
import MonthlyActivity from './MonthlyActivity';
import WeeklyGoal from './WeeklyGoal';

export default function DailyCheckIn({ dailyCheckIn = {} }) {
  const [selectedDate, setSelectedDate] = useState('2026-09-30');

  const {
    monthLabel = 'September 2026',
    streak = 7,
    bestStreak = 12,
    monthlyActiveDays = 18,
    monthlyTotalSessions = 24,
    monthlyPercentage = 60,
    weeklyGoal = { completedDays: 4, targetDays: 5, percentage: 80 },
    activitiesByDate = {}
  } = dailyCheckIn;

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-4 transition-all">
      {/* 1. Activity Calendar with Day Inspection */}
      <ActivityCalendar
        monthLabel={monthLabel}
        activitiesByDate={activitiesByDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* 2. Streak Summary */}
      <StreakSummary streak={streak} bestStreak={bestStreak} />

      {/* 3. Monthly Activity Tracking */}
      <MonthlyActivity
        activeDays={monthlyActiveDays}
        totalSessions={monthlyTotalSessions}
        percentage={monthlyPercentage}
      />

      {/* 4. Weekly Goal Tracking */}
      <WeeklyGoal
        completedDays={weeklyGoal?.completedDays ?? 4}
        targetDays={weeklyGoal?.targetDays ?? 5}
        percentage={weeklyGoal?.percentage ?? 80}
      />
    </div>
  );
}
