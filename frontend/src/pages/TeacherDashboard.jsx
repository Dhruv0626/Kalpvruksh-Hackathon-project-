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
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CategoryBadge from '../components/CategoryBadge';
import PriorityBadge from '../components/PriorityBadge';
import AnswerBox from '../components/AnswerBox';

export default function TeacherDashboard({ user, activeClass, onLogout, onNavigate }) {
  const currentClass = activeClass || {
    id: 'cls_java101',
    className: 'Java & Object-Oriented Programming',
    classCode: 'JAVA101',
    subject: 'Computer Science',
    topic: 'Inheritance & Polymorphism in Java',
    instructor: user?.name || 'Faculty Instructor',
    studentsCount: 48,
  };

  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnswerGroup, setActiveAnswerGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({ 'grp_1': true, 'grp_2': true });
  const [elapsedSeconds, setElapsedSeconds] = useState(1420); // ~23 mins

  // Live Question Groups Clustered by AI
  const [questionGroups, setQuestionGroups] = useState([
    {
      id: 'grp_1',
      mainQuestion: 'What is inheritance and how does the extends keyword work?',
      category: 'conceptual',
      priority: 'high',
      studentCount: 14,
      classWide: true,
      status: 'unanswered',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      questions: [
        { id: 'q_1', text: 'What is inheritance in Java?', studentName: 'Student #104' },
        { id: 'q_2', text: 'Can you explain the extends keyword syntax?', studentName: 'Student #118' },
        { id: 'q_3', text: 'I do not understand how parent class variables get inherited.', studentName: 'Student #129' },
        { id: 'q_4', text: 'What does inheritance mean with super() constructor?', studentName: 'Student #132' },
      ],
    },
    {
      id: 'grp_2',
      mainQuestion: 'Difference between Method Overloading vs Method Overriding?',
      category: 'conceptual',
      priority: 'high',
      studentCount: 9,
      classWide: false,
      status: 'unanswered',
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
      questions: [
        { id: 'q_5', text: 'Is overloading compile time or runtime?', studentName: 'Student #105' },
        { id: 'q_6', text: 'Difference between overriding and overloading?', studentName: 'Student #112' },
        { id: 'q_7', text: 'Can we override private methods in child class?', studentName: 'Student #141' },
      ],
    },
    {
      id: 'grp_3',
      mainQuestion: 'When is Lab Assignment 3 on Polymorphism due for submission?',
      category: 'administrative',
      priority: 'low',
      studentCount: 4,
      classWide: false,
      status: 'answered',
      answer: {
        text: 'Lab Assignment 3 is due this Friday by 11:59 PM on the student portal.',
        teacher: user?.name || 'Professor',
        time: '6 mins ago',
      },
      createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
      questions: [
        { id: 'q_8', text: 'When do we have to submit assignment 3?', studentName: 'Student #102' },
        { id: 'q_9', text: 'Assignment deadline date please?', studentName: 'Student #109' },
      ],
    },
    {
      id: 'grp_4',
      mainQuestion: 'Code runner terminal gives "Cannot find symbol" error during compilation',
      category: 'technical',
      priority: 'medium',
      studentCount: 3,
      classWide: false,
      status: 'unanswered',
      createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
      questions: [
        { id: 'q_10', text: 'My compiler gives cannot find symbol error for Parent class.', studentName: 'Student #115' },
        { id: 'q_11', text: 'Compilation failed symbol not found in same package.', studentName: 'Student #122' },
      ],
    },
  ]);

  // Session timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentClass.classCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Submit Answer to a Question Group
  const handleSubmitAnswer = (groupId, answerText) => {
    setQuestionGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            status: 'answered',
            answer: {
              text: answerText,
              teacher: user?.name || 'Professor',
              time: 'Just now',
            },
          };
        }
        return g;
      })
    );
    setActiveAnswerGroup(null);
  };

  // Live Demo Simulation: Simulate incoming questions clustered into group
  const handleSimulateQuestion = () => {
    const newDoubts = [
      {
        mainQuestion: 'Why does multiple inheritance fail in Java with diamond problem?',
        category: 'conceptual',
        priority: 'high',
        studentCount: 5,
        classWide: false,
        questions: [
          { id: 'sim_1', text: 'Why multiple inheritance not allowed in Java?', studentName: 'Student #145' },
          { id: 'sim_2', text: 'What is the diamond problem in C++ vs Java?', studentName: 'Student #149' },
        ],
      },
    ];

    const pick = newDoubts[0];
    const newGroup = {
      id: 'grp_sim_' + Date.now(),
      mainQuestion: pick.mainQuestion,
      category: pick.category,
      priority: pick.priority,
      studentCount: pick.studentCount,
      classWide: false,
      status: 'unanswered',
      createdAt: new Date().toISOString(),
      questions: pick.questions,
    };

    setQuestionGroups((prev) => [newGroup, ...prev]);
  };

  // Computed metrics
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
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="teacher_dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
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
                  Live Session Active
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
              <span className="text-gray-400">Code:</span>
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
              onClick={handleSimulateQuestion}
              className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              title="Simulate student asking doubts for AI clustering"
            >
              <Sparkles size={14} />
              <span>Simulate Doubt</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('class_summary')}
              className="px-4 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>End Class & Summary</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{currentClass.studentsCount || 48}</div>
              <div className="text-[11px] font-semibold text-gray-400">Connected Students</div>
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

        {/* 🚨 CLASS-WIDE DOUBT BANNER */}
        {classWideDoubt && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/15 border-2 border-red-500/40 dark:border-red-500/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
                <ShieldAlert size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold tracking-wider uppercase">
                    🚨 Class-Wide Conceptual Doubt Detected
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Users size={13} /> {classWideDoubt.studentCount} students stuck here
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {classWideDoubt.mainQuestion}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  AI detected high repetition among multiple students. Answering this once will broadcast the solution to all {classWideDoubt.studentCount} students.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveAnswerGroup(classWideDoubt)}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
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
              { id: 'conceptual', label: '🧠 Conceptual' },
              { id: 'administrative', label: '📅 Administrative' },
              { id: 'technical', label: '🔧 Technical' },
              { id: 'homework', label: '📚 Homework' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
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
                  className={`rounded-3xl bg-white dark:bg-gray-900/90 border transition-all duration-200 shadow-sm ${
                    group.classWide && !isAnswered
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
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold">
                            🚨 Class-Wide Doubt
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
