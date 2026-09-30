import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Calendar,
  Code2,
  Database,
  Video,
  TrendingUp,
  Settings,
  LogOut,
  Compass,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      label: 'PREP',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
        { name: 'My Profile', path: '/profile', icon: User, badge: null },
        { name: 'Study Plan', path: '/study-plan', icon: Calendar, badge: 'AI' },
      ],
    },
    {
      label: 'PRACTICE',
      items: [
        { name: 'DSA Practice', path: '/dsa', icon: Code2, badge: 'Soon' },
        { name: 'SQL Practice', path: '/sql', icon: Database, badge: 'Soon' },
        { name: 'Mock Interviews', path: '/mock-interviews', icon: Video, badge: 'Soon' },
        { name: 'Progress', path: '/progress', icon: TrendingUp, badge: 'Soon' },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings, badge: null },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white dark:bg-[#0d121c] text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/90 flex flex-col justify-between transition-colors duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 dark:border-slate-800/90">
            <NavLink to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Placement<span className="text-brand-600 dark:text-brand-400">Pilot</span>
              </span>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Grouped by Section */}
          <div className="px-2.5 py-3 space-y-4">
            {navSections.map((section) => (
              <div key={section.label} className="space-y-0.5">
                <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.label}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-300 border border-slate-200 dark:border-brand-500/20 rounded">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User Card & Logout at Bottom */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/90 bg-slate-50/80 dark:bg-[#080c14]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Student Pilot'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {profile?.college || user?.email || 'Engineering Student'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-md transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

