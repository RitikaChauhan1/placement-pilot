import React from 'react';
import TargetSummary from './TargetSummary';

export default function DashboardHeader({ user, target }) {
  // Determine greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Ritika';
  const greeting = getGreeting();

  return (
    <section className="space-y-3.5">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{greeting}, {firstName}</span>
            <span className="inline-block hover:animate-bounce origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Let's make consistent progress toward your placement goals.
          </p>
        </div>
      </div>

      {/* Target Summary Banner */}
      <TargetSummary target={target} />
    </section>
  );
}
