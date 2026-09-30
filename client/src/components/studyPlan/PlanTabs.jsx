import React from 'react';
import { Map, Calendar, CalendarDays, BookOpen, Layers } from 'lucide-react';

export default function PlanTabs({
  activeTab,
  onSelectTab,
  tasksCount = 0,
  completedTasksCount = 0
}) {
  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    {
      id: 'daily',
      label: 'Daily Plan',
      icon: Calendar,
      badge: `${completedTasksCount}/${tasksCount}`
    },
    { id: 'weekly', label: 'Weekly Plan', icon: CalendarDays },
    { id: 'topics', label: 'Topics', icon: Layers },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <div className="border-b border-border/70 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all relative border-b-2 whitespace-nowrap ${
              isActive
                ? 'text-primary border-primary bg-primary/5'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
