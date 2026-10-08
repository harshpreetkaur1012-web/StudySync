import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../components/Toast.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, demoLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      success('Logged in successfully! Welcome back.');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setErrorMsg(msg);
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setEmail('student@studysync.com');
    setPassword('student123');
    setIsLoading(true);
    setErrorMsg('');
    try {
      await demoLogin();
      success('Demo student account connected!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Demo login failed.';
      setErrorMsg(msg);
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            StudySync
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to your academic workspace to track your progress
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 py-8 px-6 sm:px-8 rounded-2xl shadow-sm">
          {/* Quick Demo Access banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Demo Credentials Ready</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                student@studysync.com · student123
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoClick}
              disabled={isLoading}
              className="text-xs bg-white dark:bg-slate-900 shrink-0"
            >
              Try Demo Account
            </Button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="student@studysync.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to StudySync
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
