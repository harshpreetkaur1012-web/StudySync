import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Trash2,
  Edit2,
  Calendar,
  Check,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { api } from '../services/api.js';
import { Assignment, AnalyticsData, Subject } from '../types/index.js';
import { StatsCard } from '../components/StatsCard.js';
import { Card } from '../components/Card.js';
import { Badge } from '../components/Badge.js';
import { Button } from '../components/Button.js';
import { Modal } from '../components/Modal.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { EmptyState } from '../components/EmptyState.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { useToast } from '../components/Toast.js';
import { Input } from '../components/Input.js';
import { Select } from '../components/Select.js';

export const DashboardPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed' | 'Overdue',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [asgRes, subRes, analyticsRes] = await Promise.all([
        api.assignments.getAll(),
        api.subjects.getAll(),
        api.analytics.get(),
      ]);
      setAssignments(asgRes.assignments);
      setSubjects(subRes.subjects);
      setAnalytics(analyticsRes.analytics);
    } catch (err: any) {
      error(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenAddModal = (editItem?: Assignment) => {
    if (editItem) {
      setSelectedAssignment(editItem);
      setFormData({
        title: editItem.title,
        description: editItem.description,
        subject: editItem.subject,
        dueDate: editItem.dueDate,
        priority: editItem.priority,
        status: editItem.status,
      });
    } else {
      setSelectedAssignment(null);
      setFormData({
        title: '',
        description: '',
        subject: subjects[0]?.name || 'Data Structures & Algorithms',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.dueDate) {
      error('Please fill in title, subject and due date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedAssignment) {
        await api.assignments.update(selectedAssignment.id, formData);
        success('Assignment updated successfully.');
      } else {
        await api.assignments.create(formData);
        success('Assignment created successfully.');
      }
      setIsAddModalOpen(false);
      await loadDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to save assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (assignment: Assignment) => {
    const newStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.assignments.updateStatus(assignment.id, newStatus);
      success(`Assignment marked as ${newStatus}`);
      await loadDashboardData();
    } catch (err: any) {
      error('Failed to update assignment status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.assignments.delete(deleteTargetId);
      success('Assignment deleted successfully.');
      setDeleteTargetId(null);
      await loadDashboardData();
    } catch (err: any) {
      error('Failed to delete assignment.');
    } finally {
      setIsDeleting(false);
    }
  };

  const upcomingAssignments = assignments.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Academic Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor active coursework, deadlines, and weekly completion metrics
          </p>
        </div>

        <Button
          onClick={() => handleOpenAddModal()}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Add Assignment
        </Button>
      </div>

      {/* 4 Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Assignments"
            value={analytics?.totalAssignments ?? 0}
            description="Active course milestones"
            icon={<CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            trend={`${analytics?.completionRate ?? 0}% completed`}
            trendType="positive"
            colorClass="bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400"
          />

          <StatsCard
            title="Pending"
            value={analytics?.pendingAssignments ?? 0}
            description="To be submitted"
            icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            trend="Needs attention"
            trendType="neutral"
            colorClass="bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400"
          />

          <StatsCard
            title="Completed"
            value={analytics?.completedAssignments ?? 0}
            description="Submitted on schedule"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            trend="+2 this week"
            trendType="positive"
            colorClass="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          />

          <StatsCard
            title="Overdue"
            value={analytics?.overdueAssignments ?? 0}
            description="Past final cutoff"
            icon={<AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            trend={analytics?.overdueAssignments ? 'Urgent priority' : 'All clear'}
            trendType={analytics?.overdueAssignments ? 'negative' : 'positive'}
            colorClass="bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400"
          />
        </div>
      )}

      {/* Analytics Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Assignment Completion */}
        <Card className="lg:col-span-7 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Weekly Assignment Completion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Assignments completed vs due by weekday
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 dark:bg-indigo-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
                <span>Due Target</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.weeklyCompletion || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
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
                      padding: '8px 12px',
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  />
                  <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="due" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Subject Progress */}
        <Card className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Subject Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Completion rate per registered course
                </p>
              </div>
              <Link
                to="/subjects"
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All Subjects</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3.5 mt-5">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : analytics?.subjectProgress?.length ? (
                analytics.subjectProgress.slice(0, 5).map((sp) => (
                  <div key={sp.subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                        {sp.subject}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {sp.completed}/{sp.total} ·{' '}
                        <strong className="text-slate-900 dark:text-white">{sp.percentage}%</strong>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(sp.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No subjects recorded yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall completion rate</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {analytics?.completionRate ?? 0}%
            </span>
          </div>
        </Card>
      </div>

      {/* Upcoming Assignments Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Upcoming Assignments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Coursework due soon with quick status controls
            </p>
          </div>

          <Link to="/assignments">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={4} />
          </div>
        ) : upcomingAssignments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<CheckSquare className="w-6 h-6" />}
              title="No upcoming assignments"
              description="You have completed all current tasks or have not added assignments yet."
              actionText="+ Add Assignment"
              onAction={() => handleOpenAddModal()}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6">Assignment</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingAssignments.map((asg) => (
                  <tr
                    key={asg.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleComplete(asg)}
                          title={
                            asg.status === 'Completed'
                              ? 'Mark as Pending'
                              : 'Mark as Completed'
                          }
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            asg.status === 'Completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                          }`}
                        >
                          {asg.status === 'Completed' && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <button
                            onClick={() => {
                              setSelectedAssignment(asg);
                              setIsDetailModalOpen(true);
                            }}
                            className={`font-medium text-left hover:text-indigo-600 dark:hover:text-indigo-400 truncate block max-w-xs transition-colors ${
                              asg.status === 'Completed'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {asg.title}
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {asg.subject}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {asg.dueDate}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge priority={asg.priority} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge status={asg.status} />
                    </td>

                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedAssignment(asg);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenAddModal(asg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(asg.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Assignment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        description="Enter the coursework specifications and deadlines."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Binary Search Tree Implementation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={
                subjects.length > 0
                  ? subjects.map((s) => ({ value: s.name, label: s.name }))
                  : [{ value: 'General', label: 'General' }]
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as 'Low' | 'Medium' | 'High',
                })
              }
              options={[
                { value: 'Low', label: 'Low Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'High', label: 'High Priority' },
              ]}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | 'Pending'
                    | 'In Progress'
                    | 'Completed'
                    | 'Overdue',
                })
              }
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Overdue', label: 'Overdue' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Description / Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400"
              placeholder="Outline project requirements, lab specifications or resources..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              {selectedAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assignment Details View Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Assignment Details"
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
                Due: {selectedAssignment.dueDate}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Description & Notes
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedAssignment.description || 'No detailed instructions added for this assignment.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenAddModal(selectedAssignment);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleToggleComplete(selectedAssignment);
                  setIsDetailModalOpen(false);
                }}
              >
                {selectedAssignment.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        message="Are you sure you want to delete this assignment? It will be removed from your dashboard and productivity metrics."
      />
    </div>
  );
};
