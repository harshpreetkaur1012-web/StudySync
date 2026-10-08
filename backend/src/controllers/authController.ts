import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { users } from '../data/users.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { User } from '../types/index.js';

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      college: req.body.college || 'State Technical University',
      course: req.body.course || 'B.Tech Computer Science',
      academicYear: req.body.academicYear || '3rd Year',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user || !user.password) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = users.find((u) => u.id === req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userIndex = users.findIndex((u) => u.id === req.user?.userId);
    if (userIndex === -1) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { name, college, course, academicYear } = req.body;
    if (name) users[userIndex].name = name.trim();
    if (college !== undefined) users[userIndex].college = college;
    if (course !== undefined) users[userIndex].course = course;
    if (academicYear !== undefined) users[userIndex].academicYear = academicYear;

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
}
