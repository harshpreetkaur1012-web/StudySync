import React from 'react';
import { Menu, Sun, Moon, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { user, theme, toggleTheme } = useAuth();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile hamburger & Greetings */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              Here&apos;s what&apos;s happening with your studies today.
            </p>
          </div>
        </div>

        {/* Right: Date badge & Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-600 dark:text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-mono">{formattedDate}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
