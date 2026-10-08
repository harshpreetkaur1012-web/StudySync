import React from 'react';
import { AssignmentStatus, Priority } from '../types/index.js';

interface BadgeProps {
  status?: AssignmentStatus;
  priority?: Priority;
  customText?: string;
  variant?: 'status' | 'priority' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  priority,
  customText,
  variant,
  className = '',
}) => {
  if (status) {
    const config = {
      Completed: {
        dot: 'bg-emerald-500',
        text: 'text-emerald-700 dark:text-emerald-400',
        bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40',
        label: 'Completed',
      },
      'In Progress': {
        dot: 'bg-blue-500',
        text: 'text-blue-700 dark:text-blue-400',
        bg: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40',
        label: 'In Progress',
      },
      Pending: {
        dot: 'bg-amber-500',
        text: 'text-amber-700 dark:text-amber-400',
        bg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40',
        label: 'Pending',
      },
      Overdue: {
        dot: 'bg-rose-500',
        text: 'text-rose-700 dark:text-rose-400',
        bg: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40',
        label: 'Overdue',
      },
    }[status] || {
      dot: 'bg-slate-400',
      text: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  if (priority) {
    const config = {
      High: {
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/40',
      },
      Medium: {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40',
      },
      Low: {
        text: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/60',
      },
    }[priority];

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${className}`}
      >
        {priority} Priority
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {customText}
    </span>
  );
};
