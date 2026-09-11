import { useState, useEffect } from 'react';
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
import { api } from '../services/api';

export default function TeacherHome({ user, onLogout, onNavigate, onSelectClass }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherClasses() {
      setIsLoading(true);
      try {
        const res = await api.getClasses();
        if (res?.classes) {
          const formatted = res.classes.map((c) => ({
            id: c._id,
            _id: c._id,
            className: c.className,
            classCode: c.classCode,
            subject: c.subject,
            topic: c.topic || 'Live Session',
            status: c.status || 'ended',
            isLive: c.status === 'active',
            studentsCount: c.students?.length || 0,
            unansweredDoubts: 0,
            totalGroups: 0,
          }));
          setClasses(formatted);
        }
      } catch (err) {
        console.error('Failed to load teacher classes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTeacherClasses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="teacher_home" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/15">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              Faculty Management Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] mb-3">
              Welcome, {user?.name || 'Professor'}
            </h1>
            <p className="text-sm sm:text-base text-emerald-50 mb-6 leading-relaxed">
              Eliminate repetitive classroom questions. Addressing one AI-grouped doubt automatically resolves it across all participating students.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('create_class')}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle size={16} /> Create New Class
              </button>
            </div>
          </div>
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Generate a unique 6-character code and start live doubt filtering.</p>
          </div>

          <div
            onClick={() => onNavigate('classwork')}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck size={22} />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Classwork & Assignments</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Post tasks, auto-evaluate submissions with AI, and upload study notes.</p>
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

          {isLoading ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-white/5">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-400">Loading teaching sessions from database...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900/40 border border-dashed border-gray-300 dark:border-white/10 space-y-3">
              <BookOpen size={36} className="mx-auto text-gray-400" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">No Teaching Sessions Yet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                You haven't created any classroom sessions in the database yet. Click below to create your first class.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('create_class')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle size={16} /> Create Your First Class
              </button>
            </div>
          ) : (
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
                          <Radio size={12} /> ACTIVE
                        </span>
                      ) : c.status === 'ended' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1">
                          <Clock size={12} /> Scheduled
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">{c.className}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.subject}</p>

                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 mb-4 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Topic:</span>
                        <strong className="text-gray-900 dark:text-white">{c.topic}</strong>
                      </div>
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
                        onNavigate(c.isLive ? 'teacher_dashboard' : 'class_summary');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {c.isLive ? 'Open Live Studio' : 'View Summary'} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
