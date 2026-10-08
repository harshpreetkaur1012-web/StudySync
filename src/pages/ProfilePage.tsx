import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Card } from '../components/Card.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';
import { useToast } from '../components/Toast.js';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || 'Institute of Technology & Science',
    course: user?.course || 'B.Tech Computer Science & Engineering',
    academicYear: user?.academicYear || '3rd Year (Semester 6)',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      error('Full Name is required.');
      return;
    }

    setIsSaving(true);
    try {
      await updateUser(formData);
      success('Student profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SS';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View and update your enrolled academic credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Summary Avatar Card */}
        <Card className="p-6 flex flex-col items-center text-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            {initials}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {user?.name || 'Student Name'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 w-full text-left space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Active Student
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Workspace Role
              </span>
              <span>Primary Student Account</span>
            </div>
          </div>
        </Card>

        {/* Right: Editable Form Card */}
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Academic Information
            </h4>

            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              value={formData.email}
              disabled
              icon={<Mail className="w-4 h-4" />}
              helperText="Email address cannot be changed in demo mode"
            />

            <Input
              label="College / University"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              icon={<GraduationCap className="w-4 h-4" />}
              placeholder="e.g. Stanford University"
            />

            <Input
              label="Degree / Course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              icon={<BookOpen className="w-4 h-4" />}
              placeholder="e.g. B.S. Computer Science"
            />

            <Input
              label="Academic Year / Term"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              icon={<Calendar className="w-4 h-4" />}
              placeholder="e.g. 3rd Year (Semester 6)"
            />

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                isLoading={isSaving}
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
