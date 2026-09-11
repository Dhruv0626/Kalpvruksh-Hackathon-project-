import { useState } from 'react';
import {
  BookOpen,
  Radio,
  PlusCircle,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  PlayCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TeacherHome({ user, onLogout, onNavigate, onSelectClass }) {
  // Teacher's created classes
  const [classes] = useState([
    {
      id: 'cls_java101',
      className: 'Java & Object-Oriented Programming',
      classCode: 'JAVA101',
      subject: 'Computer Science',
      topic: 'Inheritance & Polymorphism',
      isLive: true,
      studentsCount: 48,
      unansweredDoubts: 4,
      totalGroups: 6,
    },
    {
      id: 'cls_dbms201',
      className: 'Advanced Database Systems',
      classCode: 'DBMS201',
      subject: 'Computer Science',
      topic: 'Query Optimization & B-Trees',
      isLive: false,
      studentsCount: 52,
      unansweredDoubts: 0,
      totalGroups: 0,
    },
    {
      id: 'cls_ai202',
      className: 'Foundations of Machine Learning',
      classCode: 'AI202',
      subject: 'Computer Science',
      topic: 'Neural Networks & Loss Functions',
      isLive: false,
      studentsCount: 65,
      unansweredDoubts: 0,
      totalGroups: 0,
    },
  ]);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="teacher_home" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/20">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              Live Classroom AI Organizer Suite
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] mb-3">
              Welcome, {user?.name || 'Professor'} 🎓
            </h1>
            <p className="text-sm sm:text-base text-emerald-50 mb-6 leading-relaxed">
              Eliminate repeated classroom questions. Answer 1 AI-grouped doubt to automatically resolve it for 20+ students at once.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('create_class')}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle size={16} /> Create New Class
              </button>
              <button
                type="button"
                onClick={() => onNavigate('teacher_dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Radio size={16} /> Open Live Organizer
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('create_class')}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={22} />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Create Class Session</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Generate a 6-digit class code and setup live question filtering.</p>
          </div>

          <div
            onClick={() => onNavigate('teacher_dashboard')}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-teal-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio size={22} />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Live Question Organizer</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">View real-time AI grouped doubts, class-wide alerts & answer feeds.</p>
          </div>

          <div
            onClick={() => onNavigate('class_summary')}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-cyan-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={22} />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Class Analytics & Summary</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">View most confusing concepts, resolved doubts, and attendance stats.</p>
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Your Teaching Sessions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage live broadcasts and monitor incoming student doubts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {classes.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  c.isLive
                    ? 'bg-white dark:bg-gray-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                    : 'bg-white dark:bg-gray-900/70 border-gray-200 dark:border-white/10 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-xs font-bold">
                      Code: {c.classCode}
                    </span>
                    {c.isLive ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold animate-pulse flex items-center gap-1">
                        <Radio size={12} /> IN SESSION
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Inactive</span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">{c.className}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.subject}</p>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 mb-4 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Topic:</span>
                      <strong className="text-gray-900 dark:text-white">{c.topic}</strong>
                    </div>
                    {c.isLive && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                        <span>Unanswered Doubts:</span>
                        <span>{c.unansweredDoubts} Question Groups</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users size={14} /> {c.studentsCount} Students
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectClass) onSelectClass(c);
                      onNavigate('teacher_dashboard');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      c.isLive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{c.isLive ? 'Launch Live' : 'Start Session'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
