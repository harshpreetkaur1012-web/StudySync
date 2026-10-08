import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart2,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { Navbar } from '../components/Navbar.js';
import { Button } from '../components/Button.js';
import { Card } from '../components/Card.js';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Assignment Management',
      description: 'Track assignments from creation to completion with priorities and live status updates.',
    },
    {
      icon: Clock,
      title: 'Deadline Tracking',
      description: 'Never miss important academic deadlines with automatic countdowns and calendar views.',
    },
    {
      icon: Layers,
      title: 'Subject Organization',
      description: 'Keep academic work neatly organized by course, instructor, and semester credits.',
    },
    {
      icon: BarChart2,
      title: 'Productivity Insights',
      description: 'Understand your study progress and weekly completion rates using rich analytical charts.',
    },
    {
      icon: FileText,
      title: 'Personal Notes',
      description: 'Keep important study notes, algorithms, and lecture summaries in one unified place.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Account',
      description: 'Protect your personal academic workspace with encrypted credentials and JWT sessions.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create your account',
      description: 'Sign up in seconds or explore right away with our one-click interactive demo student profile.',
    },
    {
      step: '02',
      title: 'Organize your academic work',
      description: 'Add your semester subjects, log upcoming assignments, and attach key study notes effortlessly.',
    },
    {
      step: '03',
      title: 'Track your progress',
      description: 'Visualize completion trends, stay ahead of deadlines, and ace your coursework with confidence.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Next-Gen Student Academic Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Stay organized. <br />
                <span className="text-indigo-600 dark:text-indigo-400">Study smarter.</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Manage assignments, deadlines, subjects and study progress — all in one simple workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link to="/register">
                  <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Get Started
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </a>
              </div>

              {/* Trust markers */}
              <div className="mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Free demo account</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>JWT secured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Full-stack REST API</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic StudySync UI Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-indigo-500/20 via-slate-200/40 dark:via-slate-800/40 to-slate-200/10 shadow-2xl">
                <div className="bg-slate-900 text-white rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                  {/* Mock Window Titlebar */}
                  <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">studysync.workspace / live</span>
                    <div className="text-[11px] text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/60">
                      Active Term
                    </div>
                  </div>

                  {/* Mock Workspace Content */}
                  <div className="p-5 space-y-4 font-sans bg-slate-900/95">
                    {/* Stat Badges row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                        <p className="text-lg font-bold font-mono text-white mt-0.5">8</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50">
                        <span className="text-[10px] text-amber-300 uppercase font-semibold">Pending</span>
                        <p className="text-lg font-bold font-mono text-amber-200 mt-0.5">3</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50">
                        <span className="text-[10px] text-emerald-300 uppercase font-semibold">Done</span>
                        <p className="text-lg font-bold font-mono text-emerald-200 mt-0.5">2</p>
                      </div>
                    </div>

                    {/* Mock assignment list */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                        <span>Upcoming Academic Deadlines</span>
                        <span className="text-indigo-400 hover:underline">View All</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            Binary Search Implementation
                          </p>
                          <p className="text-[11px] text-slate-400">Data Structures · Due Oct 15</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-medium shrink-0">
                          In Progress
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            Relational Schema Normalization
                          </p>
                          <p className="text-[11px] text-slate-400">DBMS · Due Oct 18</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-medium shrink-0">
                          Pending
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            TCP/IP Socket Programming Lab
                          </p>
                          <p className="text-[11px] text-slate-400">Computer Networks · Oct 11</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-medium shrink-0">
                          Completed
                        </span>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-400">Semester Coursework Completion</span>
                        <span className="font-mono text-indigo-400 font-semibold">68%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2">
              Powerful Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
              Everything a student needs to stay on top of coursework
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Streamline academic deadlines, lecture notes, and performance tracking into one clutter-free system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} hoverEffect className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                    {feat.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2">
              Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              How It Works
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Three clear steps to take back control of your academic schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st) => (
              <div
                key={st.step}
                className="relative p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-3xl font-extrabold text-indigo-600/30 dark:text-indigo-400/20 block mb-3">
                    {st.step}
                  </span>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {st.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-indigo-50/50 dark:from-slate-900/50 dark:to-indigo-950/20 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Take control of your academic journey.
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join thousands of organized students managing deadlines with precision and peace of mind.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Start Using StudySync
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">StudySync</span>
            <span className="text-xs text-slate-400 hidden sm:inline">· Your academic workspace, simplified.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <a href="#home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Login
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 StudySync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
