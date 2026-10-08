import React from 'react';
import { Sun, Moon, LogOut, Shield, Laptop, Monitor } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { useToast } from '../components/Toast.js';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, user, logout } = useAuth();
  const { info } = useToast();

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage workspace display preferences and active session security
        </p>
      </div>

      {/* Appearance Settings */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
          Appearance
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Select how StudySync looks on your device
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => {
              if (theme === 'dark') toggleTheme();
              info('Switched to Light Mode');
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Sun className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Light Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clean white & slate palette
            </p>
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => {
              if (theme === 'light') toggleTheme();
              info('Switched to Dark Mode');
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <Moon className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deep navy & slate palette
            </p>
          </button>
        </div>
      </Card>

      {/* Account & Session Settings */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
          Account & Authentication
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Manage your logged in session and security credentials
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Signed in as <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authenticated with JWT Bearer Token
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
};
