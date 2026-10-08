export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  academicYear: string;
  avatarUrl?: string;
  createdAt: string;
}

export type Priority = 'Low' | 'Medium' | 'High';
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string;
  teacher: string;
  color?: string;
  credits?: number;
  assignmentsCount?: number;
  completedCount?: number;
  progressPercentage?: number;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyDataPoint {
  day: string;
  completed: number;
  due: number;
}

export interface SubjectProgressPoint {
  subject: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface AnalyticsData {
  totalAssignments: number;
  pendingAssignments: number;
  inProgressAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  completionRate: number;
  weeklyCompletion: WeeklyDataPoint[];
  subjectProgress: SubjectProgressPoint[];
  priorityBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}
