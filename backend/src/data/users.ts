import bcrypt from 'bcryptjs';
import { User } from '../types/index.js';

// Pre-hashed 'student123'
const defaultHashedPassword = bcrypt.hashSync('student123', 10);

export const users: User[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Rivera',
    email: 'student@studysync.com',
    password: defaultHashedPassword,
    college: 'Institute of Technology & Science',
    course: 'B.Tech Computer Science & Engineering',
    academicYear: '3rd Year (Semester 6)',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
];
