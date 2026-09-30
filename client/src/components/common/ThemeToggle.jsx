import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-lg border text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-colors duration-150 cursor-pointer ${
        isSmall ? 'p-1.5' : 'p-2'
      } ${className}`}
    >
      {isDark ? (
        <Sun className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-400 hover:text-amber-300 transition-transform duration-200`} />
      ) : (
        <Moon className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-600 hover:text-slate-900 transition-transform duration-200`} />
      )}
    </button>
  );
}

