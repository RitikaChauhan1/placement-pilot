import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import ThemeToggle from '../common/ThemeToggle';
import HeaderSearch from '../common/HeaderSearch';
import {
  Menu,
  Bell,
  Search,
  User as UserIcon,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, loading, user, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f17]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading PlacementPilot...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get readable page name from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/profile') return 'My Profile';
    if (path === '/study-plan') return 'Study Plan';
    if (path === '/dsa' || path === '/dsa-practice') return 'DSA Practice';
    if (path === '/sql' || path === '/sql-practice') return 'SQL Practice';
    if (path === '/mock-interviews') return 'Mock Interviews';
    if (path === '/progress') return 'Progress Tracking';
    if (path === '/settings') return 'Settings';
    return 'PlacementPilot';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-14 flex items-center justify-between px-4 sm:px-6 transition-colors">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{getPageTitle()}</span>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm mx-4">
            <HeaderSearch />
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Target Role & Drive Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Target: <strong className="font-semibold">{profile?.target_role || 'SDE'}</strong></span>
            </div>

            {/* Global Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Notification Bell */}
            <button
              title="Notifications"
              className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-600 rounded-full" />
            </button>

            {/* Quick Profile Link with Name & Graduation Year */}
            <Link
              to="/profile"
              title="View Student Profile"
              className="flex items-center gap-2 pl-1 py-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {user?.name ? user.name.split(' ')[0] : 'Ritika'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                  {profile?.graduation_year ? `Class of '${profile.graduation_year.slice(-2)}` : 'Class of \'26'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


