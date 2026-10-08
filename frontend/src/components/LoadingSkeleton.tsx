import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-800/50 w-full"
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-5 space-y-3"
        >
          <div className="h-5 bg-slate-200 dark:bg-slate-700/60 rounded w-2/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/2" />
          <div className="pt-4 h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-full" />
        </div>
      ))}
    </div>
  );
};
