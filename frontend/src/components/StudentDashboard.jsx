import { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Zap,
  TrendingUp,
  Award,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  MessageSquare,
  Sparkles,
  Send,
  Upload,
  AlertCircle,
  Menu,
  X,
  PlayCircle
} from 'lucide-react';

export default function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'assignments' | 'schedule' | 'ai'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('edunova-theme') || 'dark');

  // AI Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Study Copilot. How can I help you with your courses or assignments today?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Student Courses Data
  const [courses] = useState([
    {
      id: 'CS301',
      title: 'Data Structures & Algorithms',
      instructor: 'Dr. Priya Mehta',
      progress: 74,
      totalModules: 12,
      completedModules: 9,
      nextLecture: 'Graph Algorithms & Shortest Path',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'CS302',
      title: 'Database Management Systems',
      instructor: 'Prof. Rajesh Kumar',
      progress: 60,
      totalModules: 10,
      completedModules: 6,
      nextLecture: 'Normalization & BCNF Form',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'CS303',
      title: 'Operating Systems & Concurrency',
      instructor: 'Dr. Anand Verma',
      progress: 85,
      totalModules: 14,
      completedModules: 12,
      nextLecture: 'Deadlocks & Resource Allocation',
      color: 'from-violet-500 to-pink-600',
    },
    {
      id: 'CS304',
      title: 'Artificial Intelligence & ML',
      instructor: 'Dr. Sunita Rao',
      progress: 45,
      totalModules: 15,
      completedModules: 7,
      nextLecture: 'Neural Networks & Backpropagation',
      color: 'from-emerald-500 to-teal-600',
    },
  ]);

  // Today's Schedule
  const [schedule] = useState([
    {
      time: '10:00 AM - 11:30 AM',
      subject: 'Data Structures & Algorithms',
      type: 'Live Lecture',
      room: 'Virtual Room A-102',
      status: 'Live Now',
      isLive: true,
    },
    {
      time: '01:00 PM - 02:30 PM',
      subject: 'Database Management Systems',
      type: 'Lab Session',
      room: 'Lab 3 / Cloud IDE',
      status: 'Upcoming',
      isLive: false,
    },
    {
      time: '03:00 PM - 04:00 PM',
      subject: 'Operating Systems',
      type: 'Discussion & Q&A',
      room: 'Virtual Room B-201',
      status: 'Upcoming',
      isLive: false,
    },
  ]);

  // Assignments Data
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Implement Dijkstra and A* Search Algorithm',
      course: 'Data Structures & Algorithms',
      dueDate: 'Tomorrow, 11:59 PM',
      status: 'Pending',
      urgent: true,
    },
    {
      id: 2,
      title: 'SQL Schema Design for E-Commerce Platform',
      course: 'Database Management Systems',
      dueDate: 'In 3 days',
      status: 'Pending',
      urgent: false,
    },
    {
      id: 3,
      title: 'Multithreading and Synchronization in C++',
      course: 'Operating Systems',
      dueDate: 'Submitted on 10 Sep',
      status: 'Submitted',
      urgent: false,
    },
  ]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('edunova-theme', nextTheme);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponse = `Here is an explanation for "${userText}": In computer science, this concept involves structuring operations and state transitions efficiently. Break it into three parts: 1) Base case, 2) Recursive or iterative step, and 3) Memory boundary. Would you like a code example or practice quiz questions on this?`;
      if (userText.toLowerCase().includes('dijkstra')) {
        aiResponse = "Dijkstra's Algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue (Min-Heap) to achieve an optimal O((V + E) log V) time complexity.";
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: aiResponse }]);
      setIsAiTyping(false);
    }, 900);
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">EduNova</h2>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Student Portal</span>
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={18} /> Overview
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('courses');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen size={18} /> My Courses
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('assignments');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText size={18} /> Assignments
              <span className="ml-auto text-[10px] bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                2 Due
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('schedule');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar size={18} /> Class Schedule
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('ai');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Zap size={18} className="text-amber-500" /> AI Study Copilot
            </button>
          </nav>
        </div>

        {/* User Card & Logout in Sidebar */}
        <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200 dark:border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user?.name || 'Student User'}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'student@edunova.edu'}
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
                placeholder="Search courses, assignments, topics..."
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
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 cursor-pointer"
              >
                <Bell size={18} />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/10">
              <div className="text-right">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{user?.name || 'Aarav Sharma'}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{user?.departmentOrGrade || 'Computer Science'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* ================= TAB CONTENTS ================= */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl p-7 md:p-9 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/15">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider uppercase mb-3">
                    Semester 5 • Active Session
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] mb-2">
                    Welcome back, {user?.name || 'Student'}! 🚀
                  </h1>
                  <p className="text-sm md:text-base text-indigo-100 mb-6 leading-relaxed">
                    You have <strong className="text-white">1 live class</strong> happening right now and{' '}
                    <strong className="text-white">2 assignments due this week</strong>.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('schedule')}
                      className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs md:text-sm shadow-md hover:bg-indigo-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <PlayCircle size={17} /> Join Live Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ai')}
                      className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Zap size={17} className="text-amber-300" /> Ask AI Copilot
                    </button>
                  </div>
                </div>

                {/* Ambient Decorative Shapes */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-20 w-60 h-60 rounded-full bg-pink-500/20 blur-xl pointer-events-none" />
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Enrolled Courses</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <BookOpen size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">4</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">All in progress</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Attendance</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">92%</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Above requirement</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pending Tasks</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">2 Due</h3>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Next due tomorrow</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Academic Score</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Award size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Grade A</h3>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">Dean's List standing</p>
                </div>
              </div>

              {/* Two Column Section: Live Schedule + Active Courses */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Courses (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white">My Active Courses</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {c.id}
                            </span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{c.progress}%</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{c.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{c.instructor}</p>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {c.completedModules}/{c.totalModules} Modules
                          </span>
                          <button
                            type="button"
                            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Continue →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule (1 col) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 dark:text-white">Today's Schedule</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">3 Sessions</span>
                  </div>

                  <div className="space-y-3">
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          item.isLive
                            ? 'bg-indigo-500/10 border-indigo-500/30'
                            : 'bg-white dark:bg-gray-900/80 border-gray-200 dark:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Clock size={13} /> {item.time}
                          </span>
                          {item.isLive ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                              ● LIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                              {item.type}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{item.subject}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.room}</span>
                          {item.isLive && (
                            <button
                              type="button"
                              onClick={() => alert(`Launching virtual lecture: ${item.subject}`)}
                              className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Video size={13} /> Join
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Registered Courses</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Access curriculum syllabus, recorded sessions, and lecture notes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
                          {c.id}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.progress}% Completed</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Instructor: {c.instructor}</p>

                      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 mb-4">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">Next Topic:</span>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{c.nextLecture}</p>
                      </div>

                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{c.completedModules} of {c.totalModules} modules completed</span>
                      <button
                        type="button"
                        onClick={() => alert(`Opening coursework for ${c.title}`)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                      >
                        Open Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Assignments & Submissions</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Track deadlines, submit projects, and review faculty evaluations.</p>
              </div>

              <div className="space-y-4">
                {assignments.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          task.status === 'Submitted'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : task.urgent
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {task.status === 'Submitted' ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.course}</p>
                        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 block mt-1">
                          Deadline: {task.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          task.status === 'Submitted'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : task.urgent
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {task.status}
                      </span>
                      {task.status !== 'Submitted' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAssignments((prev) =>
                              prev.map((item) => (item.id === task.id ? { ...item, status: 'Submitted' } : item))
                            );
                            alert(`Assignment "${task.title}" submitted successfully!`);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload size={14} /> Submit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Class Timetable & Live Lectures</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Weekly schedule of virtual lectures, lab sessions, and seminars.</p>
              </div>

              <div className="space-y-3">
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{item.subject}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.time} • {item.room}</p>
                      </div>
                    </div>
                    {item.isLive ? (
                      <button
                        type="button"
                        onClick={() => alert(`Connecting to ${item.subject}...`)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 animate-pulse"
                      >
                        <Video size={15} /> Join Live Now
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Upcoming
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI STUDY COPILOT TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="text-amber-500" /> AI Study Copilot
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ask questions about any topic, get concept summaries, homework debugging, and practice quiz questions.
                </p>
              </div>

              {/* Chat Window */}
              <div className="h-[460px] rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 flex flex-col justify-between overflow-hidden shadow-lg">
                {/* Messages Stream */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                          <Sparkles size={16} />
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl max-w-lg text-xs md:text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-white/10'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex gap-3 items-center text-xs text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <span>Copilot is analyzing your question...</span>
                    </div>
                  )}
                </div>

                {/* Prompt Suggestions */}
                <div className="px-5 py-2 border-t border-gray-100 dark:border-gray-800/80 flex gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setInputQuery("Explain Dijkstra's Algorithm in DSA")}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap cursor-pointer"
                  >
                    💡 Dijkstra's Algorithm
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputQuery('What is BCNF Normalization in DBMS?')}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap cursor-pointer"
                  >
                    💡 BCNF Normalization
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputQuery('How to prevent deadlocks in Operating Systems?')}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap cursor-pointer"
                  >
                    💡 Deadlock Prevention
                  </button>
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask any study question or concept..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
