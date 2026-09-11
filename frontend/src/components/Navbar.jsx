import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Radio,
  BookOpen,
  Users,
  Home,
  PlusCircle,
  LogIn,
  FileText
} from 'lucide-react';

export default function Navbar({ user, onLogout, activeClass, onNavigate, currentPage }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('edunova-theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('edunova-theme', nextTheme);
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 sm:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Class Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(isTeacher ? 'teacher_home' : 'student_home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                isTeacher
                  ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-emerald-500/20'
                  : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-indigo-500/20'
              }`}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white font-['Outfit']">
                EduNova
              </h1>
              <span
                className={`hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider ${
                  isTeacher ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {isTeacher ? 'Faculty Portal' : 'Student Portal'}
              </span>
            </div>
          </button>

          {/* Active Live Class Badge in Header */}
          {activeClass && (
            <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-gray-200 dark:border-white/10">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 text-[11px] font-bold animate-pulse">
                <Radio size={12} /> LIVE
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {activeClass.className || activeClass.subject || 'Live Class'}
              </span>
              {activeClass.classCode && (
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-mono text-gray-500">
                  Code: {activeClass.classCode}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center Quick Navigation */}
        <div className="hidden lg:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(isTeacher ? 'teacher_home' : 'student_home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'student_home' || currentPage === 'teacher_home'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Home size={14} /> Home
          </button>

          {isTeacher ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('create_class')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'create_class'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <PlusCircle size={14} /> Create Class
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('teacher_dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'teacher_dashboard'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users size={14} /> Live Organizer
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('join_class')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'join_class'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <LogIn size={14} /> Join Class
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('live_class')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentPage === 'live_class'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Radio size={14} /> Live Classroom
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('classwork')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'classwork'
                ? isTeacher ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText size={14} /> Classwork & Tasks
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('class_summary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'class_summary'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} /> Summary Report
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 transition-transform active:scale-95 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-white/10">
            <div className="text-right hidden sm:block">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h4>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {isTeacher ? (user?.teacherId ? `ID: ${user.teacherId}` : 'Faculty') : 'Student'}
              </span>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow ${
                isTeacher ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
              }`}
            >
              {user?.name ? user.name[0].toUpperCase() : isTeacher ? 'T' : 'S'}
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
