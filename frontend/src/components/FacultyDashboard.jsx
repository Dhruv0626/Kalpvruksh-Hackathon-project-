import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  TrendingUp,
  Users,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Plus,
  ShieldCheck,
  Award,
  BarChart3,
  Check,
  FileCheck,
  IdCard,
  Menu,
  X,
  PlayCircle
} from 'lucide-react';

export default function FacultyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'batches' | 'grading' | 'create_assessment' | 'attendance'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('edunova-theme') || 'dark');

  // New Assignment Modal / Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    batch: 'CS-3A',
    dueDate: '',
    totalPoints: '100',
    description: '',
  });

  // Active Batches Data
  const [batches] = useState([
    {
      id: 'CS-3A',
      courseName: 'Data Structures & Algorithms',
      studentsCount: 64,
      progress: 68,
      nextLecture: 'Graph Shortest Paths (10:00 AM)',
      room: 'Virtual Room A-102',
    },
    {
      id: 'CS-3B',
      courseName: 'Advanced Database Systems',
      studentsCount: 58,
      progress: 52,
      nextLecture: 'Query Optimization & Indexing (02:00 PM)',
      room: 'Virtual Room B-201',
    },
    {
      id: 'AI-2A',
      courseName: 'Foundations of Machine Learning',
      studentsCount: 72,
      progress: 80,
      nextLecture: 'Support Vector Machines (Tomorrow)',
      room: 'Virtual Room A-105',
    },
  ]);

  // Submissions To Grade
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNumber: 'CS2026-042',
      assignment: 'Dijkstra and A* Search Algorithm in C++',
      batch: 'CS-3A',
      submittedAt: 'Today at 09:14 AM',
      status: 'Pending Review',
      score: null,
    },
    {
      id: 2,
      studentName: 'Ananya Iyer',
      rollNumber: 'CS2026-018',
      assignment: 'Dijkstra and A* Search Algorithm in C++',
      batch: 'CS-3A',
      submittedAt: 'Yesterday at 11:30 PM',
      status: 'Pending Review',
      score: null,
    },
    {
      id: 3,
      studentName: 'Rohan Verma',
      rollNumber: 'CS2026-089',
      assignment: 'SQL Optimization & Indexing Lab',
      batch: 'CS-3B',
      submittedAt: '10 Sep at 04:20 PM',
      status: 'Graded',
      score: '96/100',
    },
  ]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('edunova-theme', nextTheme);
  };

  const handleGradeSubmission = (id, score) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'Graded', score: `${score}/100` } : sub))
    );
    alert(`Graded submission #${id} with ${score}/100 points!`);
  };

  const handleCreateAssignmentSubmit = (e) => {
    e.preventDefault();
    alert(`New assignment "${newAssignment.title}" published successfully to batch ${newAssignment.batch}!`);
    setNewAssignment({
      title: '',
      batch: 'CS-3A',
      dueDate: '',
      totalPoints: '100',
      description: '',
    });
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 z-50 flex flex-col justify-between p-5 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">EduNova</h2>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Faculty Suite</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={18} /> Overview
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('batches');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'batches'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users size={18} /> My Batches
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('grading');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'grading'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileCheck size={18} /> Evaluation Queue
              <span className="ml-auto text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                2 Pending
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('create_assessment');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'create_assessment'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Plus size={18} /> Create Assignment
            </button>
          </nav>
        </div>

        {/* User Card & Logout in Sidebar */}
        <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200 dark:border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user?.name || 'Faculty Member'}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {user?.teacherId ? `ID: ${user.teacherId}` : user?.email || 'faculty@edunova.edu'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 w-64 md:w-80">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search students, submissions, batches..."
                className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full placeholder-gray-400 text-xs"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 transition-transform active:scale-95 cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-emerald-600" />}
            </button>

            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 cursor-pointer"
              >
                <Bell size={18} />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/10">
              <div className="text-right">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{user?.name || 'Dr. Priya Mehta'}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{user?.departmentOrGrade || 'Faculty of CS & AI'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'T'}
              </div>
            </div>
          </div>
        </header>

        {/* ================= TAB CONTENTS ================= */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Faculty Welcome Hero */}
              <div className="relative overflow-hidden rounded-3xl p-7 md:p-9 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/15">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider uppercase mb-3">
                    Faculty Dashboard • Active Academic Term
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] mb-2">
                    Welcome, {user?.name || 'Professor'} 🎓
                  </h1>
                  <p className="text-sm md:text-base text-emerald-50 mb-6 leading-relaxed">
                    You have <strong className="text-white">3 active batches</strong> with 194 total students and{' '}
                    <strong className="text-white">2 submissions awaiting your review</strong>.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => alert('Starting live virtual classroom for Batch CS-3A...')}
                      className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs md:text-sm shadow-md hover:bg-emerald-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <PlayCircle size={17} /> Start Live Lecture
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('create_assessment')}
                      className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plus size={17} /> Create Assessment
                    </button>
                  </div>
                </div>

                {/* Ambient Decorative Shapes */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-xl pointer-events-none" />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Assigned Batches</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <BookOpen size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">3</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">CS-3A, CS-3B, AI-2A</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Enrolled Students</span>
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">194</h3>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">Total active students</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">To Grade</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <FileCheck size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">2 Pending</h3>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Review & score</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Faculty ID</span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <IdCard size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-['Outfit'] text-gray-900 dark:text-white font-mono">
                    {user?.teacherId || 'TCH-2026'}
                  </h3>
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-1">Verified Instructor</p>
                </div>
              </div>

              {/* Batches Overview Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white">Active Course Batches</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('batches')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Manage Batches <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                            Batch {batch.id}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Users size={13} /> {batch.studentsCount} Students
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">{batch.courseName}</h4>

                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 mb-4">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">Next Lecture:</span>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{batch.nextLecture}</p>
                          <span className="text-[10px] text-gray-400">{batch.room}</span>
                        </div>

                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${batch.progress}%` }} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">{batch.progress}% Syllabus covered</span>
                        <button
                          type="button"
                          onClick={() => alert(`Starting lecture for ${batch.id}`)}
                          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Video size={13} /> Start Class
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions to Evaluate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white">Recent Submissions for Evaluation</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('grading')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    View All Submissions <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            sub.status === 'Graded'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{sub.studentName}</h4>
                            <span className="text-[11px] font-mono text-gray-400">({sub.rollNumber})</span>
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                              {sub.batch}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{sub.assignment}</p>
                          <span className="text-[10px] text-gray-400">Submitted: {sub.submittedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {sub.status === 'Graded' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Score: {sub.score}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleGradeSubmission(sub.id, 95)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check size={14} /> Quick Grade (95%)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* BATCHES TAB */}
          {activeTab === 'batches' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Assigned Student Batches</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage course syllabus, publish study resources, and monitor student progress.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                        Batch {b.id}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{b.studentsCount} Students</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{b.courseName}</h3>

                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Class Location:</span>
                        <span className="font-semibold">{b.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Session:</span>
                        <span className="font-semibold">{b.nextLecture}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                      <button
                        type="button"
                        onClick={() => alert(`Starting lecture for ${b.id}`)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Start Lecture
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Viewing student roster for ${b.id}`)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer"
                      >
                        Roster
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRADING / EVALUATION TAB */}
          {activeTab === 'grading' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Submission Evaluation Queue</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Review student code, assign marks, and provide qualitative feedback.</p>
              </div>

              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-gray-900 dark:text-white">{sub.studentName}</h4>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">({sub.rollNumber})</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          {sub.batch}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{sub.assignment}</p>
                      <span className="text-[11px] text-gray-400">Submitted: {sub.submittedAt}</span>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      {sub.status === 'Graded' ? (
                        <span className="px-4 py-1.5 rounded-xl font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Grade: {sub.score}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub.id, 90)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Score 90%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub.id, 100)}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Score 100%
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE ASSESSMENT TAB */}
          {activeTab === 'create_assessment' && (
            <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="text-emerald-500" /> Create New Assessment
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Publish a new coursework assignment or quiz for your student batches.
                </p>
              </div>

              <form onSubmit={handleCreateAssignmentSubmit} className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graph Traversal & Dijkstra Algorithm Implementation"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target Batch</label>
                    <select
                      value={newAssignment.batch}
                      onChange={(e) => setNewAssignment({ ...newAssignment, batch: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="CS-3A">Batch CS-3A (Data Structures)</option>
                      <option value="CS-3B">Batch CS-3B (Database Systems)</option>
                      <option value="AI-2A">Batch AI-2A (Machine Learning)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Total Score Points</label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      value={newAssignment.totalPoints}
                      onChange={(e) => setNewAssignment({ ...newAssignment, totalPoints: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Description & Instructions</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details on project requirements, input test cases, submission formats..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                >
                  Publish Assessment to Batch
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
