import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  User,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Subject } from '../types/index.js';
import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { Modal } from '../components/Modal.js';
import { Input } from '../components/Input.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { EmptyState } from '../components/EmptyState.js';
import { CardSkeleton } from '../components/LoadingSkeleton.js';
import { useToast } from '../components/Toast.js';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    credits: 3,
    color: '#6366F1',
  });

  const { success, error } = useToast();

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.subjects.getAll();
      setSubjects(res.subjects);
    } catch (err: any) {
      error(err.message || 'Failed to load subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleOpenModal = (item?: Subject) => {
    if (item) {
      setEditingSubject(item);
      setFormData({
        name: item.name,
        code: item.code || '',
        teacher: item.teacher,
        credits: item.credits || 3,
        color: item.color || '#6366F1',
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        teacher: '',
        credits: 3,
        color: '#6366F1',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacher) {
      error('Please fill in subject name and teacher name.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await api.subjects.update(editingSubject.id, formData);
        success('Subject updated successfully.');
      } else {
        await api.subjects.create(formData);
        success('Subject added successfully.');
      }
      setIsModalOpen(false);
      await loadSubjects();
    } catch (err: any) {
      error(err.message || 'Failed to save subject.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.subjects.delete(deleteId);
      success('Subject deleted successfully.');
      setDeleteId(null);
      await loadSubjects();
    } catch (err: any) {
      error('Failed to delete subject.');
    } finally {
      setIsDeleting(false);
    }
  };

  const colorPalette = [
    { label: 'Indigo', value: '#6366F1' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Emerald', value: '#10B981' },
    { label: 'Cyan', value: '#06B6D4' },
    { label: 'Amber', value: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Subjects & Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your registered coursework, teachers, and completion progress
          </p>
        </div>

        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          + Add Subject
        </Button>
      </div>

      {/* Grid of Subject Cards */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : subjects.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="No subjects registered"
            description="Add your semester subjects to start organizing coursework and tracking progress."
            actionText="+ Add Subject"
            onAction={() => handleOpenModal()}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => {
            const progress = sub.progressPercentage ?? 0;
            const assignmentsCount = sub.assignmentsCount ?? 0;
            const completedCount = sub.completedCount ?? 0;

            return (
              <Card
                key={sub.id}
                hoverEffect
                className="p-5.5 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: sub.color || '#6366F1' }}
                />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      {sub.code && (
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {sub.code}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {sub.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(sub.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.teacher}</span>
                    {sub.credits && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{sub.credits} Credits</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bar & metrics */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">
                      {completedCount} of {assignmentsCount} tasks done
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(progress, assignmentsCount > 0 ? 5 : 0)}%`,
                        backgroundColor: sub.color || '#6366F1',
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        description="Enter course information and instructor details."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Operating Systems"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Code"
              placeholder="e.g. CS302"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />

            <Input
              label="Credits"
              type="number"
              min="1"
              max="10"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Instructor / Teacher"
            placeholder="e.g. Prof. Williamjeet Singh"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {colorPalette.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    formData.color === c.value
                      ? 'scale-115 border-slate-900 dark:border-white'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
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
              {editingSubject ? 'Save Changes' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Are you sure you want to delete this subject? Note that assignments under this subject will remain."
      />
    </div>
  );
};
