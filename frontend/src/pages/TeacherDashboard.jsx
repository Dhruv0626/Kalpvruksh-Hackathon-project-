import { useState, useEffect } from 'react';
import {
  Radio,
  Users,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  BarChart3,
  LogOut,
  Copy,
  Check,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Monitor
} from 'lucide-react';
import Navbar from '../components/Navbar';
import VideoPanel from '../components/VideoPanel';
import CategoryBadge from '../components/CategoryBadge';
import PriorityBadge from '../components/PriorityBadge';
import AnswerBox from '../components/AnswerBox';
import { api } from '../services/api';

export default function TeacherDashboard({ user, activeClass, onLogout, onNavigate, onExitClass }) {
  const [liveClassData, setLiveClassData] = useState(activeClass || null);
  const [questionGroups, setQuestionGroups] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnswerGroup, setActiveAnswerGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  // Sync with incoming activeClass prop
  useEffect(() => {
    if (activeClass && activeClass.status !== 'ended') {
      setLiveClassData(activeClass);
    } else if (!activeClass || activeClass.status === 'ended') {
      setLiveClassData(null);
    }
  }, [activeClass]);

  const hasActiveClass = Boolean(
    liveClassData &&
    (liveClassData._id || liveClassData.id) &&
    liveClassData.status === 'active'
  );

  const currentClass = liveClassData || {
    id: '',
    className: 'Live Classroom Session',
    classCode: '',
    subject: 'General',
    topic: 'Live Q&A Session',
    instructor: user?.name || 'Faculty Instructor',
    students: [],
    studentsCount: 0,
  };

  // Periodic poll & initial DB verification
  useEffect(() => {
    let isMounted = true;

    async function syncClassState() {
      const classId = liveClassData?._id || liveClassData?.id || activeClass?._id || activeClass?.id;

      if (classId) {
        try {
          const resClass = await api.getClassById(classId);
          if (isMounted && resClass?.class) {
            if (resClass.class.status === 'ended') {
              setLiveClassData(null);
              if (onExitClass) onExitClass();
            } else {
              setLiveClassData(resClass.class);
              const resQuestions = await api.getClassQuestions(classId);
              if (isMounted && resQuestions?.groups) {
                setQuestionGroups(resQuestions.groups);
              }
            }
          }
        } catch (err) {
          console.error('Error fetching class data from DB:', err);
        } finally {
          if (isMounted) setLoadingQuestions(false);
        }
      } else {
        // If no class passed, check if teacher has any ongoing active class in database
        try {
          const res = await api.getClasses();
          if (isMounted && res?.classes) {
            const active = res.classes.find((c) => c.status === 'active');
            if (active) {
              setLiveClassData(active);
              const resQuestions = await api.getClassQuestions(active._id);
              if (isMounted && resQuestions?.groups) {
                setQuestionGroups(resQuestions.groups);
              }
            } else {
              setLiveClassData(null);
            }
          }
        } catch (err) {
          console.error('Error checking active classes:', err);
        } finally {
          if (isMounted) setLoadingQuestions(false);
        }
      }
    }

    syncClassState();
    const interval = setInterval(syncClassState, 3500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeClass, liveClassData?._id]);

  // Session timer ticker
  useEffect(() => {
    if (!hasActiveClass) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasActiveClass]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyCode = () => {
    if (currentClass?.classCode) {
      navigator.clipboard.writeText(currentClass.classCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleConfirmEndClass = async () => {
    setIsEnding(true);
    const classId = liveClassData?._id || liveClassData?.id || activeClass?._id || activeClass?.id;
    if (classId) {
      try {
        await api.endClass(classId);
      } catch (err) {
        console.error('Failed to end class in database:', err);
      }
    }
    setIsEnding(false);
    setShowEndModal(false);
    setLiveClassData(null);
    if (onExitClass) onExitClass();
    onNavigate('class_summary');
  };

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Submit Answer to a Question Group
  const handleSubmitAnswer = async (groupId, answerText) => {
    try {
      await api.answerQuestionGroup(groupId, answerText);
      const classId = activeClass?._id || activeClass?.id;
      if (classId) {
        const res = await api.getClassQuestions(classId);
        if (res?.groups) setQuestionGroups(res.groups);
      }
    } catch (err) {
      console.error('Failed to submit answer to database:', err);
    }
    setActiveAnswerGroup(null);
  };

  // Computed metrics
  const enrolledStudentsCount = currentClass.students?.length || 0;
  const totalQuestions = questionGroups.reduce((acc, g) => acc + (g.questions?.length || g.studentCount || 1), 0);
  const totalGroups = questionGroups.length;
  const answeredGroups = questionGroups.filter((g) => g.status === 'answered').length;
  const unansweredGroups = questionGroups.filter((g) => g.status !== 'answered').length;
  const classWideDoubt = questionGroups.find((g) => g.classWide && g.status !== 'answered');

  // Filter groups
  const filteredGroups = questionGroups.filter((group) => {
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      group.mainQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.questions?.some((q) => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeClass={hasActiveClass ? currentClass : null}
        currentPage="teacher_dashboard"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col justify-center">
        {!hasActiveClass ? (
          <div className="py-16 px-6 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <Radio size={36} className="opacity-75" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                No Active Live Session
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                You do not have a live classroom session running right now. Create a new lecture or select an existing session from your teaching dashboard.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('create_class')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle size={16} /> Create Live Class
              </button>
              <button
                type="button"
                onClick={() => onNavigate('teacher_home')}
                className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Header Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <Radio size={24} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Faculty Studio Live
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {currentClass.subject}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                    {currentClass.className}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Topic: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentClass.topic}</span>
                  </p>
                </div>
              </div>

              {/* Actions & Class Code */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-white/10 text-xs">
                  <span className="text-gray-400">Student Code:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{currentClass.classCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors cursor-pointer"
                    title="Copy enrollment code"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold">
                  <Clock size={14} />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEndModal(true)}
                  className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span>End Session for All</span>
                </button>
              </div>
            </div>

            {/* Attractive End Session Confirmation Modal */}
            {showEndModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                <div className="max-w-md w-full p-7 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-6 animate-slide-up">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-500/20 shadow-lg shadow-rose-500/10">
                    <LogOut size={30} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                      End Live Session for All?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      This will terminate the broadcast for all <strong>{enrolledStudentsCount} connected student{enrolledStudentsCount !== 1 ? 's' : ''}</strong> and compile the AI Question Analytics & Transcripts.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEndModal(false)}
                      disabled={isEnding}
                      className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      Cancel / Keep Live
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmEndClass}
                      disabled={isEnding}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isEnding ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Ending...</span>
                        </>
                      ) : (
                        <>
                          <LogOut size={16} />
                          <span>Yes, End Session</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Studio Stream + Quick Controls (Google Meet Style) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <VideoPanel
                  className={currentClass.className}
                  topic={currentClass.topic}
                  instructor={currentClass.instructor || user?.name}
                  studentCount={enrolledStudentsCount}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3.5">
                <div className="p-5 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Class Roster</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                      {enrolledStudentsCount} Joined
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {enrolledStudentsCount === 0 ? (
                      <p className="text-xs font-normal text-gray-400 py-2">
                        No students have entered the room yet. Share code <span className="font-mono font-bold text-emerald-500">{currentClass.classCode}</span> with students.
                      </p>
                    ) : (
                      <p className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                        {enrolledStudentsCount} student{enrolledStudentsCount > 1 ? 's' : ''} actively connected to live session.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
                    <span className="text-[11px] font-semibold text-gray-400">Total Doubts</span>
                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalQuestions}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
                    <span className="text-[11px] font-semibold text-gray-400">AI Groups</span>
                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{totalGroups}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
                    <span className="text-[11px] font-semibold text-gray-400">Answered</span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{answeredGroups}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
                    <span className="text-[11px] font-semibold text-gray-400">Unresolved</span>
                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{unansweredGroups}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 dark:text-white">{currentClass.students?.length || currentClass.studentsCount || 0}</div>
                  <div className="text-[11px] font-semibold text-gray-400">Enrolled Students</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 dark:text-white">{totalQuestions}</div>
                  <div className="text-[11px] font-semibold text-gray-400">Total Doubts</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{totalGroups}</div>
                  <div className="text-[11px] font-semibold text-gray-400">AI Groups</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{answeredGroups}</div>
                  <div className="text-[11px] font-semibold text-gray-400">Answered</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{unansweredGroups}</div>
                  <div className="text-[11px] font-semibold text-gray-400">Unanswered</div>
                </div>
              </div>
            </div>

            {/* CLASS-WIDE DOUBT BANNER */}
            {classWideDoubt && (
              <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500/40 dark:border-rose-500/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold tracking-wide uppercase">
                        Class-Wide Bottleneck
                      </span>
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <Users size={13} /> {classWideDoubt.studentCount} students affected
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {classWideDoubt.mainQuestion}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      AI detected high repetition across students. Submitting one response will resolve the doubt for all {classWideDoubt.studentCount} students.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAnswerGroup(classWideDoubt)}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Send size={16} /> Answer Class-Wide Doubt
                </button>
              </div>
            )}

            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 w-full sm:w-auto overflow-x-auto">
                {[
                  { id: 'all', label: 'All Doubts' },
                  { id: 'conceptual', label: 'Conceptual' },
                  { id: 'administrative', label: 'Administrative' },
                  { id: 'technical', label: 'Technical' },
                  { id: 'homework', label: 'Homework' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === tab.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doubts or keywords..."
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Question Groups List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Layers size={16} className="text-emerald-500" />
                  AI Synthesized Question Groups ({filteredGroups.length})
                </h2>
                <span className="text-[11px] text-gray-400">
                  Sorted by Priority: High → Low
                </span>
              </div>

              {filteredGroups.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 space-y-2">
                  <MessageSquare size={32} className="mx-auto text-gray-400" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No question groups match the selected filter.</p>
                  <p className="text-xs text-gray-400">Students doubts will automatically appear here once asked.</p>
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const isExpanded = !!expandedGroups[group.id];
                  const isAnswered = group.status === 'answered';

                  return (
                    <div
                      key={group.id}
                      className={`rounded-3xl bg-white dark:bg-gray-900/90 border transition-all duration-200 shadow-sm ${group.classWide && !isAnswered
                          ? 'border-red-500/40 bg-red-500/[0.02]'
                          : isAnswered
                            ? 'border-emerald-500/30'
                            : 'border-gray-200 dark:border-white/10 hover:border-emerald-500/30'
                        }`}
                    >
                      <div className="p-5 sm:p-6 space-y-4">
                        {/* Header line */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <CategoryBadge category={group.category} />
                            <PriorityBadge priority={group.priority} />
                            {group.classWide && (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Class-Wide Doubt
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                              <Users size={12} /> {group.studentCount || group.questions?.length || 1} Students
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isAnswered ? (
                              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                <CheckCircle2 size={14} /> Answered
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveAnswerGroup(group)}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Send size={13} /> Answer Group
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleGroupExpand(group.id)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Main Synthesized Question */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                            {group.mainQuestion}
                          </h3>
                        </div>

                        {/* Answer section if answered */}
                        {isAnswered && group.answer && (
                          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                Instructor Answer Broadcasted:
                              </span>
                              <span className="text-[10px] text-gray-400 font-normal">{group.answer.time}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                              {group.answer.text}
                            </p>
                          </div>
                        )}

                        {/* Expanded Individual Student Variations */}
                        {isExpanded && group.questions && group.questions.length > 0 && (
                          <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                              <Sparkles size={12} className="text-purple-400" />
                              Clustered Student Questions ({group.questions.length} variations):
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {group.questions.map((q) => (
                                <div
                                  key={q.id}
                                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 flex items-start gap-2.5 text-xs"
                                >
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                    Q
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">{q.text}</p>
                                    <span className="text-[10px] text-gray-400 mt-0.5 block">{q.studentName}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Answer Modal Triggered by Answer Group */}
      {activeAnswerGroup && (
        <AnswerBox
          group={activeAnswerGroup}
          onClose={() => setActiveAnswerGroup(null)}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )}
    </div>
  );
}
