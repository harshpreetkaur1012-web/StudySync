import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  Calendar,
  Layers,
  Tag,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Note, Subject } from '../types/index.js';
import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';
import { Select } from '../components/Select.js';
import { Modal } from '../components/Modal.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { EmptyState } from '../components/EmptyState.js';
import { CardSkeleton } from '../components/LoadingSkeleton.js';
import { useToast } from '../components/Toast.js';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tagsString: '',
  });

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [notesRes, subRes] = await Promise.all([
        api.notes.getAll({
          search: searchQuery || undefined,
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        }),
        api.subjects.getAll(),
      ]);
      setNotes(notesRes.notes);
      setSubjects(subRes.subjects);
    } catch (err: any) {
      error(err.message || 'Failed to load notes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSubject]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenModal = (item?: Note) => {
    if (item) {
      setEditingNote(item);
      setFormData({
        title: item.title,
        content: item.content,
        subject: item.subject,
        tagsString: (item.tags || []).join(', '),
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        content: '',
        subject: subjects[0]?.name || 'Data Structures & Algorithms',
        tagsString: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.subject) {
      error('Please provide a title, subject, and content.');
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      if (editingNote) {
        await api.notes.update(editingNote.id, {
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
        });
        success('Note updated successfully.');
      } else {
        await api.notes.create({
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
        });
        success('Note created successfully.');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.notes.delete(deleteId);
      success('Note deleted successfully.');
      setDeleteId(null);
      await loadData();
    } catch (err: any) {
      error('Failed to delete note.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = (note: Note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    success('Note content copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Personal Notes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Capture lecture summaries, key algorithms, and revision takeaways
          </p>
        </div>

        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          + Create Note
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search notes by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...subjects.map((s) => ({ value: s.name, label: s.name })),
            ]}
          />
        </div>
      </Card>

      {/* Notes Grid */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : notes.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No notes found"
            description={
              searchQuery || selectedSubject !== 'all'
                ? 'No notes matched your search query. Try clearing filters.'
                : 'You have not written any notes yet. Create your first note now.'
            }
            actionText="+ Create Note"
            onAction={() => handleOpenModal()}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {notes.map((note) => {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(note.createdAt));

            return (
              <Card
                key={note.id}
                hoverEffect
                className="p-5.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {note.subject}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy note"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenModal(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(note.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                    {note.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {note.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'Create Note'}
        description="Write concise reference notes for your subjects."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. B-Tree Indexing Tradeoffs"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Content & Notes
            </label>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400"
              placeholder="Type your notes, equations, code explanations or takeaway points..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <Input
            label="Tags (Comma separated)"
            placeholder="e.g. Algorithms, Complexity, Midterms"
            value={formData.tagsString}
            onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
            helperText="Separate tags with commas"
          />

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
              {editingNote ? 'Save Changes' : 'Save Note'}
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
        message="Are you sure you want to delete this study note? It will be removed permanently."
      />
    </div>
  );
};
