import React from 'react';
import { Map, Calendar, CalendarDays, BookOpen, Layers } from 'lucide-react';

export default function PlanTabs({
  activeTab,
  onSelectTab
}) {
  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'daily', label: 'Daily Plan', icon: Calendar },
    { id: 'weekly', label: 'Weekly Plan', icon: CalendarDays },
    { id: 'topics', label: 'Topics', icon: Layers },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
