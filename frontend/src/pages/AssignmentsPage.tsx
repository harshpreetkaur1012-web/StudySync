import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Check,
  Eye,
  Calendar,
  Layers,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Assignment, Subject, Priority, AssignmentStatus } from '../types/index.js';
import { Card } from '../components/Card.js';
import { Badge } from '../components/Badge.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';
import { Select } from '../components/Select.js';
import { Modal } from '../components/Modal.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { EmptyState } from '../components/EmptyState.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { useToast } from '../components/Toast.js';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate_asc' | 'dueDate_desc' | 'priority'>('dueDate_asc');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [detailAssignment, setDetailAssignment] = useState<Assignment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'Medium' as Priority,
    status: 'Pending' as AssignmentStatus,
  });

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [asgRes, subRes] = await Promise.all([
        api.assignments.getAll({
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
          priority: selectedPriority !== 'all' ? selectedPriority : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchQuery || undefined,
          sortBy,
        }),
        api.subjects.getAll(),
      ]);
      setAssignments(asgRes.assignments);
      setSubjects(subRes.subjects);
    } catch (err: any) {
      error(err.message || 'Failed to fetch assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSubject, selectedPriority, selectedStatus, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleOpenModal = (item?: Assignment) => {
    if (item) {
      setEditingAssignment(item);
      setFormData({
        title: item.title,
        description: item.description,
        subject: item.subject,
        dueDate: item.dueDate,
        priority: item.priority,
        status: item.status,
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        subject: subjects[0]?.name || 'Data Structures & Algorithms',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.dueDate) {
      error('Please fill in title, subject and due date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAssignment) {
        await api.assignments.update(editingAssignment.id, formData);
        success('Assignment updated successfully.');
      } else {
        await api.assignments.create(formData);
        success('Assignment created successfully.');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: Assignment) => {
    const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.assignments.updateStatus(item.id, newStatus);
      success(`Status updated to ${newStatus}`);
      await loadData();
    } catch (err: any) {
      error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.assignments.delete(deleteId);
      success('Assignment deleted successfully.');
      setDeleteId(null);
      await loadData();
    } catch (err: any) {
      error('Failed to delete assignment.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Assignments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize, prioritize and track all your academic deliverables
          </p>
        </div>

        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          + Add Assignment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search assignments by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Subject Filter */}
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...subjects.map((s) => ({ value: s.name, label: s.name })),
            ]}
          />

          {/* Priority Filter */}
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </div>

        {/* Sort & Count strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium font-mono tabular-nums">
            Showing {assignments.length} assignments
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="dueDate_asc">Due Date (Earliest)</option>
              <option value="dueDate_desc">Due Date (Latest)</option>
              <option value="priority">Priority (High to Low)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments Table / List */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} />
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<CheckSquare className="w-8 h-8" />}
              title="No assignments found"
              description={
                searchQuery || selectedSubject !== 'all' || selectedStatus !== 'all'
                  ? 'Try clearing your search filters to find what you are looking for.'
                  : 'You have no assignments logged yet. Create your first assignment to begin.'
              }
              actionText="+ Add Assignment"
              onAction={() => handleOpenModal()}
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
                {assignments.map((asg) => (
                  <tr
                    key={asg.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(asg)}
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
                            onClick={() => setDetailAssignment(asg)}
                            className={`font-medium text-left hover:text-indigo-600 dark:hover:text-indigo-400 truncate block max-w-sm transition-colors ${
                              asg.status === 'Completed'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {asg.title}
                          </button>
                          {asg.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-sm mt-0.5">
                              {asg.description}
                            </p>
                          )}
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
                          onClick={() => setDetailAssignment(asg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(asg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(asg.id)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
        description="Provide comprehensive details and deadlines."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Implement Dijkstra Algorithm"
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
                setFormData({ ...formData, priority: e.target.value as Priority })
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
                setFormData({ ...formData, status: e.target.value as AssignmentStatus })
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
              Description & Notes
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400"
              placeholder="Enter instructions, rubrics, or link references..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              {editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assignment Detail Modal */}
      <Modal
        isOpen={Boolean(detailAssignment)}
        onClose={() => setDetailAssignment(null)}
        title="Assignment Details"
        maxWidth="md"
      >
        {detailAssignment && (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                {detailAssignment.subject}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {detailAssignment.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge status={detailAssignment.status} />
              <Badge priority={detailAssignment.priority} />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                Due: {detailAssignment.dueDate}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {detailAssignment.description || 'No detailed instructions provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const item = detailAssignment;
                  setDetailAssignment(null);
                  handleOpenModal(item);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleToggleStatus(detailAssignment);
                  setDetailAssignment(null);
                }}
              >
                {detailAssignment.status === 'Completed'
                  ? 'Mark Pending'
                  : 'Mark Completed'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Are you sure you want to delete this assignment? It will be removed permanently from your academic records."
      />
    </div>
  );
};
