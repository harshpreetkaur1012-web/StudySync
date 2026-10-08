import React from 'react';
import { Card } from './Card.js';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendType = 'neutral',
  colorClass = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40',
}) => {
  return (
    <Card hoverEffect className="p-5.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight font-mono tabular-nums">
            {value}
          </h4>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${colorClass}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate">{description}</span>
        {trend && (
          <span
            className={`font-medium shrink-0 ml-2 ${
              trendType === 'positive'
                ? 'text-emerald-600 dark:text-emerald-400'
                : trendType === 'negative'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
};
