import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { assignments } from '../data/assignments.js';
import { Assignment, AssignmentStatus, Priority } from '../types/index.js';

export async function getAssignments(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { subject, priority, status, search, sortBy } = req.query;

    // Filter by user (allow demo user to see initial data, other users see their own items)
    let userAssignments = assignments.filter((a) => a.userId === userId || a.userId === 'user-demo-1');

    if (subject && typeof subject === 'string' && subject !== 'all') {
      userAssignments = userAssignments.filter((a) => a.subject.toLowerCase() === subject.toLowerCase());
    }

    if (priority && typeof priority === 'string' && priority !== 'all') {
      userAssignments = userAssignments.filter((a) => a.priority.toLowerCase() === priority.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'all') {
      userAssignments = userAssignments.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      userAssignments = userAssignments.filter(
        (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      userAssignments.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortBy === 'dueDate_desc') {
      userAssignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    } else {
      // Default: earliest due date first
      userAssignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    res.status(200).json({ assignments: userAssignments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve assignments.' });
  }
}

export async function getAssignmentById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = assignments.find((a) => a.id === id);

    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    res.status(200).json({ assignment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment.' });
  }
}

export async function createAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'user-demo-1';
    const { title, description, subject, dueDate, priority, status } = req.body;

    if (!title || !subject || !dueDate) {
      res.status(400).json({ message: 'Title, subject, and due date are required.' });
      return;
    }

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      userId,
      title: title.trim(),
      description: (description || '').trim(),
      subject: subject.trim(),
      dueDate,
      priority: (priority as Priority) || 'Medium',
      status: (status as AssignmentStatus) || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assignments.unshift(newAssignment);
    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: newAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assignment.' });
  }
}

export async function updateAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const index = assignments.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    const { title, description, subject, dueDate, priority, status } = req.body;

    assignments[index] = {
      ...assignments[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(subject !== undefined && { subject: subject.trim() }),
      ...(dueDate !== undefined && { dueDate }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      message: 'Assignment updated successfully',
      assignment: assignments[index],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update assignment.' });
  }
}

export async function updateAssignmentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    if (!status) {
      res.status(400).json({ message: 'Status is required.' });
      return;
    }

    assignments[index].status = status as AssignmentStatus;
    assignments[index].updatedAt = new Date().toISOString();

    res.status(200).json({
      message: `Assignment marked as ${status}`,
      assignment: assignments[index],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
}

export async function deleteAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const index = assignments.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    assignments.splice(index, 1);
    res.status(200).json({
      message: 'Assignment deleted successfully',
      id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete assignment.' });
  }
}
