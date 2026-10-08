import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { subjects } from '../data/subjects.js';
import { assignments } from '../data/assignments.js';
import { Subject } from '../types/index.js';

function enrichSubjectWithStats(subject: Subject, userId: string): Subject {
  const subjectAssignments = assignments.filter(
    (a) => (a.userId === userId || a.userId === 'user-demo-1') && a.subject.toLowerCase() === subject.name.toLowerCase()
  );
  const total = subjectAssignments.length;
  const completed = subjectAssignments.filter((a) => a.status === 'Completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    ...subject,
    assignmentsCount: total,
    completedCount: completed,
    progressPercentage: percentage,
  };
}

export async function getSubjects(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'user-demo-1';
    const userSubjects = subjects.filter((s) => s.userId === userId || s.userId === 'user-demo-1');

    const enriched = userSubjects.map((s) => enrichSubjectWithStats(s, userId));
    res.status(200).json({ subjects: enriched });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve subjects.' });
  }
}

export async function getSubjectById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'user-demo-1';
    const subject = subjects.find((s) => s.id === id);

    if (!subject) {
      res.status(404).json({ message: 'Subject not found.' });
      return;
    }

    res.status(200).json({ subject: enrichSubjectWithStats(subject, userId) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subject.' });
  }
}

export async function createSubject(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'user-demo-1';
    const { name, code, teacher, color, credits } = req.body;

    if (!name || !teacher) {
      res.status(400).json({ message: 'Subject name and teacher are required.' });
      return;
    }

    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      userId,
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : undefined,
      teacher: teacher.trim(),
      color: color || '#6366F1',
      credits: credits ? Number(credits) : 3,
      createdAt: new Date().toISOString(),
    };

    subjects.push(newSubject);
    res.status(201).json({
      message: 'Subject added successfully',
      subject: enrichSubjectWithStats(newSubject, userId),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject.' });
  }
}

export async function updateSubject(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'user-demo-1';
    const index = subjects.findIndex((s) => s.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Subject not found.' });
      return;
    }

    const { name, code, teacher, color, credits } = req.body;
    const oldName = subjects[index].name;

    subjects[index] = {
      ...subjects[index],
      ...(name !== undefined && { name: name.trim() }),
      ...(code !== undefined && { code: code.trim().toUpperCase() }),
      ...(teacher !== undefined && { teacher: teacher.trim() }),
      ...(color !== undefined && { color }),
      ...(credits !== undefined && { credits: Number(credits) }),
    };

    // If subject name changed, update corresponding assignments and notes
    if (name && name.trim() !== oldName) {
      const newName = name.trim();
      assignments.forEach((a) => {
        if (a.subject.toLowerCase() === oldName.toLowerCase()) {
          a.subject = newName;
        }
      });
    }

    res.status(200).json({
      message: 'Subject updated successfully',
      subject: enrichSubjectWithStats(subjects[index], userId),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subject.' });
  }
}

export async function deleteSubject(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const index = subjects.findIndex((s) => s.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Subject not found.' });
      return;
    }

    subjects.splice(index, 1);
    res.status(200).json({
      message: 'Subject deleted successfully',
      id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subject.' });
  }
}
