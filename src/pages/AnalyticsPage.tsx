import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Percent,
  Layers,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../services/api.js';
import { AnalyticsData } from '../types/index.js';
import { Card } from '../components/Card.js';
import { StatsCard } from '../components/StatsCard.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { useToast } from '../components/Toast.js';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { error } = useToast();

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await api.analytics.get();
      setAnalytics(res.analytics);
    } catch (err: any) {
      error('Failed to load analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const pieData = analytics
    ? [
        { name: 'Completed', value: analytics.completedAssignments, color: '#10B981' },
        { name: 'In Progress', value: analytics.inProgressAssignments, color: '#3B82F6' },
        { name: 'Pending', value: analytics.pendingAssignments, color: '#F59E0B' },
        { name: 'Overdue', value: analytics.overdueAssignments, color: '#EF4444' },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Productivity & Academic Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Data-driven insights on your coursework completion rates and study discipline
        </p>
      </div>

      {/* Top Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Milestones"
            value={analytics?.totalAssignments ?? 0}
            description="Overall coursework"
            icon={<Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            colorClass="bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400"
          />

          <StatsCard
            title="Completed"
            value={analytics?.completedAssignments ?? 0}
            description="Submitted deliverables"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            trendType="positive"
            colorClass="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          />

          <StatsCard
            title="Pending"
            value={analytics?.pendingAssignments ?? 0}
            description="In queue"
            icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            colorClass="bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400"
          />

          <StatsCard
            title="Overdue"
            value={analytics?.overdueAssignments ?? 0}
            description="Missed targets"
            icon={<AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            trendType="negative"
            colorClass="bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400"
          />

          <StatsCard
            title="Completion Rate"
            value={`${analytics?.completionRate ?? 0}%`}
            description="Target: 80%+"
            icon={<Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            trend={analytics && analytics.completionRate >= 70 ? 'On Track' : 'Needs Focus'}
            trendType={analytics && analytics.completionRate >= 70 ? 'positive' : 'negative'}
            colorClass="bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400"
          />
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Productivity Flow */}
        <Card className="lg:col-span-8 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Weekly Productivity & Study Rhythm
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparison of assignments completed versus scheduled workload
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Scheduled Target</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            {isLoading ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.weeklyCompletion || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="due"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorDue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Assignment Status Breakdown Donut */}
        <Card className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Status Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proportion of coursework across lifecycle states
            </p>

            <div className="h-52 w-full mt-4 flex items-center justify-center">
              {isLoading ? (
                <div className="h-40 w-40 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ) : pieData.length === 0 ? (
                <p className="text-xs text-slate-400">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {item.value} ({analytics?.totalAssignments ? Math.round((item.value / analytics.totalAssignments) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Course Completion Breakdown Bar */}
      <Card className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
          Coursework Completion By Registered Subject
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Compare relative progress between all academic disciplines
        </p>

        <div className="h-64 w-full">
          {isLoading ? (
            <div className="h-full bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.subjectProgress || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  dataKey="subject"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Completion Rate']}
                />
                <Bar dataKey="percentage" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
};
