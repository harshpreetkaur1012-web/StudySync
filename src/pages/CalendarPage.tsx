import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Check,
  Plus,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Assignment } from '../types/index.js';
import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { Badge } from '../components/Badge.js';
import { Modal } from '../components/Modal.js';
import { useToast } from '../components/Toast.js';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)); // October 2026 default
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const { success, error } = useToast();

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const res = await api.assignments.getAll();
      setAssignments(res.assignments);
    } catch (err: any) {
      error('Failed to load assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 8)); // current simulation date October 2026
  };

  // Month calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map assignments to YYYY-MM-DD
  const assignmentsByDate = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    assignments.forEach((asg) => {
      if (!map[asg.dueDate]) map[asg.dueDate] = [];
      map[asg.dueDate].push(asg);
    });
    return map;
  }, [assignments]);

  const handleToggleStatus = async (item: Assignment) => {
    const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.assignments.updateStatus(item.id, newStatus);
      success(`Assignment marked as ${newStatus}`);
      await loadAssignments();
      setSelectedAssignment(null);
    } catch (err: any) {
      error('Failed to update assignment.');
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Month Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Academic Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monthly schedule of course submissions and exam deadlines
          </p>
        </div>

        {/* Month selector toolbar */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white font-mono min-w-[130px] text-center">
              {monthName} {year}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend strip */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Overdue</span>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <Card className="overflow-hidden p-3 sm:p-5">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-slate-200/80 dark:border-slate-800/80 pb-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {weekDays.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[85px] sm:min-h-[110px] p-1 rounded-xl bg-slate-50/40 dark:bg-slate-950/20 border border-transparent"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const dayAssignments = assignmentsByDate[formattedDateStr] || [];
            const isToday = dayNum === 8 && month === 9 && year === 2026;

            return (
              <div
                key={dayNum}
                className={`min-h-[85px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl border transition-colors flex flex-col justify-between ${
                  isToday
                    ? 'border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayAssignments.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      {dayAssignments.length}
                    </span>
                  )}
                </div>

                {/* Assignment items */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px]">
                  {dayAssignments.map((asg) => {
                    const statusColor = {
                      Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
                      'In Progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
                      Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
                      Overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
                    }[asg.status] || 'bg-slate-100 text-slate-700';

                    return (
                      <button
                        key={asg.id}
                        onClick={() => setSelectedAssignment(asg)}
                        className={`w-full text-left px-1.5 py-1 rounded text-[11px] font-medium border truncate block transition-transform hover:scale-[1.02] cursor-pointer ${statusColor}`}
                        title={`${asg.title} (${asg.subject})`}
                      >
                        {asg.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assignment Detail Modal */}
      <Modal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        title="Calendar Assignment"
        maxWidth="md"
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                {selectedAssignment.subject}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedAssignment.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge status={selectedAssignment.status} />
              <Badge priority={selectedAssignment.priority} />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                Deadline: {selectedAssignment.dueDate}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Instructions & Rubric
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedAssignment.description || 'No detailed instructions added.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAssignment(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => handleToggleStatus(selectedAssignment)}
              >
                {selectedAssignment.status === 'Completed'
                  ? 'Mark as Pending'
                  : 'Mark as Completed'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
