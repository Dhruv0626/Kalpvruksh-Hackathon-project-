import { useState } from 'react';
import {
  BookOpen,
  Radio,
  LogIn,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Zap,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';

export default function StudentHome({ user, onLogout, onNavigate, onSelectClass }) {
  const [classCodeInput, setClassCodeInput] = useState('');

  // Sample enrolled classes
  const [classes] = useState([
    {
      id: 'cls_java101',
      className: 'Java & Object-Oriented Programming',
      classCode: 'JAVA101',
      subject: 'Computer Science',
      topic: 'Inheritance & Polymorphism',
      instructor: 'Dr. Priya Mehta',
      isLive: true,
      studentsCount: 48,
      activeDoubtsCount: 14,
    },
    {
      id: 'cls_dbms201',
      className: 'Database Management Systems',
      classCode: 'DBMS201',
      subject: 'Computer Science',
      topic: 'Relational Algebra & Normalization',
      instructor: 'Prof. Rajesh Kumar',
      isLive: false,
      studentsCount: 52,
      activeDoubtsCount: 0,
    },
    {
      id: 'cls_os301',
      className: 'Operating Systems & Concurrency',
      classCode: 'OS301',
      subject: 'Computer Science',
      topic: 'Process Scheduling & Semaphores',
      instructor: 'Dr. Anand Verma',
      isLive: false,
      studentsCount: 60,
      activeDoubtsCount: 0,
    },
  ]);

  // Recent Doubts Answered
  const [recentAnswers] = useState([
    {
      question: 'What is inheritance in Java?',
      answer: 'Inheritance is a mechanism where one class acquires the properties and behaviors of a parent class using the extends keyword.',
      teacher: 'Dr. Priya Mehta',
      category: 'conceptual',
      time: '15 mins ago',
    },
    {
      question: 'When is the OOP Assignment 2 due?',
      answer: 'The assignment submission portal is open until Friday, 11:59 PM.',
      teacher: 'Dr. Priya Mehta',
      category: 'administrative',
      time: '1 hour ago',
    },
  ]);

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;
    const foundClass = classes.find(
      (c) => c.classCode.toLowerCase() === classCodeInput.trim().toLowerCase()
    ) || {
      id: 'cls_' + classCodeInput.toUpperCase(),
      className: `Live Session (${classCodeInput.toUpperCase()})`,
      classCode: classCodeInput.toUpperCase(),
      subject: 'Computer Science',
      topic: 'Live Q&A Session',
      instructor: 'Faculty Instructor',
      isLive: true,
      studentsCount: 30,
    };

    if (onSelectClass) onSelectClass(foundClass);
    onNavigate('live_class');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="student_home" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/20">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              AI-Powered Live Classroom Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] mb-3">
              Hello, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 mb-6 leading-relaxed">
              Ask doubts during live lectures without spamming chat. EduNova AI organizes, categorizes, and groups similar questions in real-time.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('join_class')}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn size={16} /> Join Live Class
              </button>
              <button
                type="button"
                onClick={() => onNavigate('class_summary')}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <BookOpen size={16} /> View Class Summaries
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>

        {/* Quick Join via Code Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LogIn size={18} className="text-indigo-600 dark:text-indigo-400" /> Have a Class Code?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Enter your instructor's 6-character code (e.g. <strong>JAVA101</strong>) to join live.
            </p>
          </div>

          <form onSubmit={handleQuickJoin} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              placeholder="e.g. JAVA101"
              value={classCodeInput}
              onChange={(e) => setClassCodeInput(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-mono uppercase font-bold text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-48"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              Enter
            </button>
          </form>
        </div>

        {/* Enrolled Classes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Your Classes & Live Sessions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Join active lectures or review completed subjects.</p>
            </div>
            <span className="text-xs font-semibold text-gray-500">{classes.length} Courses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {classes.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  c.isLive
                    ? 'bg-white dark:bg-gray-900 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                    : 'bg-white dark:bg-gray-900/70 border-gray-200 dark:border-white/10 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-xs font-bold">
                      {c.classCode}
                    </span>
                    {c.isLive ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold animate-pulse flex items-center gap-1">
                        <Radio size={12} /> LIVE NOW
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Scheduled</span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">{c.className}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Instructor: {c.instructor}</p>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 mb-4 text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Active Topic:</span>
                    <strong className="text-gray-900 dark:text-white">{c.topic}</strong>
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
                      onNavigate('live_class');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      c.isLive
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{c.isLive ? 'Join Lecture' : 'View Class'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Answer Feed from Instructors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" /> Instructor Answers & Clarifications
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recently resolved doubts across your active courses.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAnswers.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <CategoryBadge category={item.category} />
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock size={11} /> {item.time}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Doubt:</h4>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">"{item.question}"</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    Answer from {item.teacher}:
                  </span>
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
