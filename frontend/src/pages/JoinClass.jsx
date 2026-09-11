import { useState } from 'react';
import { LogIn, Radio, ArrowRight, BookOpen, Users, Sparkles, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function JoinClass({ user, onLogout, onNavigate, onSelectClass }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const activePublicClasses = [
    {
      id: 'cls_java101',
      className: 'Java & Object-Oriented Programming',
      classCode: 'JAVA101',
      subject: 'Computer Science',
      topic: 'Inheritance & Polymorphism in Java',
      instructor: 'Dr. Priya Mehta',
      studentsCount: 48,
    },
    {
      id: 'cls_dbms201',
      className: 'Database Management Systems',
      classCode: 'DBMS201',
      subject: 'Computer Science',
      topic: 'Normalization & BCNF Rules',
      instructor: 'Prof. Rajesh Kumar',
      studentsCount: 36,
    },
  ];

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a valid class code');
      return;
    }

    const matched = activePublicClasses.find(
      (c) => c.classCode.toLowerCase() === code.trim().toLowerCase()
    ) || {
      id: 'cls_' + code.toUpperCase(),
      className: `Live Course (${code.toUpperCase()})`,
      classCode: code.toUpperCase(),
      subject: 'Computer Science',
      topic: 'Live Q&A Lecture',
      instructor: 'Faculty Instructor',
      studentsCount: 32,
    };

    if (onSelectClass) onSelectClass(matched);
    onNavigate('live_class');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="join_class" />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8 flex flex-col justify-center">
        {/* Join Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6 animate-slide-up max-w-xl mx-auto w-full">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <LogIn size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
              Join Live Classroom
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Enter the unique 6-character code provided by your course instructor.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleJoinByCode} className="space-y-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Enter Class Code</label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="e.g. JAVA101"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-mono font-bold text-base text-center tracking-widest uppercase focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio size={16} /> Enter Live Classroom
            </button>
          </form>
        </div>

        {/* Or Select from Active Courses */}
        <div className="space-y-4 max-w-2xl mx-auto w-full">
          <div className="text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Or Choose from Ongoing Live Sessions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePublicClasses.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  if (onSelectClass) onSelectClass(c);
                  onNavigate('live_class');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 hover:border-indigo-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300">
                      {c.classCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse flex items-center gap-1">
                      <Radio size={10} /> LIVE
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {c.className}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Topic: {c.topic}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {c.studentsCount} Students
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                    Join <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
