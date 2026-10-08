import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { notes } from '../data/notes.js';
import { Note } from '../types/index.js';

export async function getNotes(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'user-demo-1';
    const { search, subject } = req.query;

    let userNotes = notes.filter((n) => n.userId === userId || n.userId === 'user-demo-1');

    if (subject && typeof subject === 'string' && subject !== 'all') {
      userNotes = userNotes.filter((n) => n.subject.toLowerCase() === subject.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      userNotes = userNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.status(200).json({ notes: userNotes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notes.' });
  }
}

export async function getNoteById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const note = notes.find((n) => n.id === id);

    if (!note) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve note.' });
  }
}

export async function createNote(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'user-demo-1';
    const { title, content, subject, tags } = req.body;

    if (!title || !content || !subject) {
      res.status(400).json({ message: 'Title, content, and subject are required.' });
      return;
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      userId,
      title: title.trim(),
      content: content.trim(),
      subject: subject.trim(),
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.unshift(newNote);
    res.status(201).json({
      message: 'Note created successfully',
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note.' });
  }
}

export async function updateNote(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const index = notes.findIndex((n) => n.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    const { title, content, subject, tags } = req.body;

    notes[index] = {
      ...notes[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(subject !== undefined && { subject: subject.trim() }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      message: 'Note updated successfully',
      note: notes[index],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note.' });
  }
}

export async function deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const index = notes.findIndex((n) => n.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    notes.splice(index, 1);
    res.status(200).json({
      message: 'Note deleted successfully',
      id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note.' });
  }
}
