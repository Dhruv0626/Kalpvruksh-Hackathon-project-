import { useState } from 'react';
import {
  FileText,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Users,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Download,
  Share2,
  ArrowLeft,
  ChevronRight,
  Layers,
  BookOpen,
  PieChart,
  BrainCircuit,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CategoryBadge from '../components/CategoryBadge';
import PriorityBadge from '../components/PriorityBadge';

export default function ClassSummary({ user, activeClass, onLogout, onNavigate }) {
  const [downloaded, setDownloaded] = useState(false);

  const currentClass = activeClass || {
    id: 'cls_java101',
    className: 'Java & Object-Oriented Programming',
    classCode: 'JAVA101',
    subject: 'Computer Science',
    topic: 'Inheritance & Polymorphism in Java',
    instructor: user?.name || 'Dr. Priya Mehta',
    studentsCount: 48,
  };

  // Mock Comprehensive Analytics Data based on README spec
  const summaryData = {
    totalQuestions: 42,
    questionGroups: 8,
    repeatedQuestionsFiltered: 34,
    answeredGroups: 7,
    unansweredGroups: 1,
    efficiencyGain: '81%', // Teacher answered 8 times instead of 42 times!
    durationMinutes: 45,
    mostConfusingTopic: {
      title: 'Inheritance & Polymorphism (extends vs implements)',
      studentsAffected: 16,
      category: 'conceptual',
      severity: 'high',
      aiInsight:
        '38% of all lecture questions focused on the difference between method overriding in inheritance vs interface implementation. A 5-minute dedicated recap is recommended for the next lecture.',
    },
    categoryStats: [
      { category: 'conceptual', label: '🧠 Conceptual', count: 24, percentage: 57 },
      { category: 'technical', label: '🔧 Technical', count: 8, percentage: 19 },
      { category: 'administrative', label: '📅 Administrative', count: 6, percentage: 14 },
      { category: 'homework', label: '📚 Homework', count: 4, percentage: 10 },
    ],
    transcripts: [
      {
        id: 't_1',
        mainQuestion: 'What is inheritance and how does the extends keyword work?',
        category: 'conceptual',
        priority: 'high',
        studentCount: 14,
        classWide: true,
        status: 'answered',
        answer:
          'Inheritance allows a child class to inherit fields and methods from a parent class using the "extends" keyword. It enables code reuse and polymorphism.',
      },
      {
        id: 't_2',
        mainQuestion: 'Difference between Method Overloading vs Method Overriding?',
        category: 'conceptual',
        priority: 'high',
        studentCount: 9,
        classWide: false,
        status: 'answered',
        answer:
          'Overloading is compile-time (same method name, different parameter lists). Overriding is runtime (subclass provides specific implementation of parent method).',
      },
      {
        id: 't_3',
        mainQuestion: 'When is Lab Assignment 3 on Polymorphism due for submission?',
        category: 'administrative',
        priority: 'low',
        studentCount: 4,
        classWide: false,
        status: 'answered',
        answer: 'Lab Assignment 3 is due this Friday by 11:59 PM on the student portal.',
      },
      {
        id: 't_4',
        mainQuestion: 'Code runner terminal gives "Cannot find symbol" error during compilation',
        category: 'technical',
        priority: 'medium',
        studentCount: 3,
        classWide: false,
        status: 'answered',
        answer: 'Ensure both class files are saved in the same directory and compile with javac *.java.',
      },
      {
        id: 't_5',
        mainQuestion: 'Is multiple inheritance possible using interfaces in Java?',
        category: 'conceptual',
        priority: 'medium',
        studentCount: 5,
        classWide: false,
        status: 'answered',
        answer: 'Yes, Java supports multiple inheritance through interfaces using the "implements" keyword.',
      },
      {
        id: 't_6',
        mainQuestion: 'Will the slides for OOP concepts be uploaded after class?',
        category: 'administrative',
        priority: 'low',
        studentCount: 2,
        classWide: false,
        status: 'answered',
        answer: 'Yes, full lecture slides will be shared in the LMS resources tab.',
      },
      {
        id: 't_7',
        mainQuestion: 'What is the default super() constructor behavior when not specified?',
        category: 'conceptual',
        priority: 'medium',
        studentCount: 5,
        classWide: false,
        status: 'unanswered',
        answer: null,
      },
    ],
  };

  const handleExport = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const returnHome = () => {
    if (user?.role === 'teacher') {
      onNavigate('teacher_home');
    } else {
      onNavigate('student_home');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="class_summary" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={returnHome}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {downloaded ? <Check size={14} /> : <Download size={14} />}
              <span>{downloaded ? 'Report Exported!' : 'Export Summary (PDF/CSV)'}</span>
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Post-Class AI Analytics
              </span>
              <span className="text-xs text-gray-400">
                Session Code: <strong className="text-gray-700 dark:text-gray-300">{currentClass.classCode}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
              {currentClass.className}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Topic: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentClass.topic}</span> • Instructor: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentClass.instructor}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{summaryData.efficiencyGain}</div>
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Efficiency Gain</div>
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{summaryData.durationMinutes}m</div>
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Lecture Duration</div>
            </div>
          </div>
        </div>

        {/* 4 Core Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Total Doubts</span>
              <MessageSquare size={18} className="text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {summaryData.totalQuestions}
            </div>
            <p className="text-[11px] text-gray-400">Raw questions asked</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">AI Groups Clustered</span>
              <Layers size={18} className="text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {summaryData.questionGroups}
            </div>
            <p className="text-[11px] text-gray-400">Unique core concepts</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Repeated Doubts Saved</span>
              <Sparkles size={18} className="text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {summaryData.repeatedQuestionsFiltered}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Filtered duplicate questions
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Resolution Rate</span>
              <CheckCircle2 size={18} className="text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {summaryData.answeredGroups}/{summaryData.questionGroups}
            </div>
            <p className="text-[11px] text-gray-400">{summaryData.unansweredGroups} doubt remaining</p>
          </div>
        </div>

        {/* Most Confusing Topic & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Confusing Concept Highlight Box */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-purple-500/10 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <BrainCircuit size={20} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  🔥 Most Confusing Concept
                </span>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  {summaryData.mostConfusingTopic.title}
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-amber-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Affected Students: <strong className="text-amber-600 dark:text-amber-400">{summaryData.mostConfusingTopic.studentsAffected} students</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-[11px]">
                  Priority: High
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {summaryData.mostConfusingTopic.aiInsight}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PieChart size={16} className="text-emerald-500" />
                Doubt Category Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              {summaryData.categoryStats.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="text-gray-400 font-medium">{item.count} doubts ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Q&A Transcript Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold font-['Outfit'] text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" />
              Complete Session Q&A Transcript
            </h2>
            <span className="text-xs text-gray-400">
              {summaryData.transcripts.length} Clustered Question Records
            </span>
          </div>

          <div className="space-y-3">
            {summaryData.transcripts.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                      #{idx + 1}
                    </span>
                    <CategoryBadge category={t.category} />
                    <PriorityBadge priority={t.priority} />
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      <Users size={11} /> {t.studentCount} Students
                    </span>
                  </div>

                  <div>
                    {t.status === 'answered' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Answered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                        <Clock size={12} /> Unresolved
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {t.mainQuestion}
                </h4>

                {t.answer ? (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                    <strong className="text-emerald-700 dark:text-emerald-300 block mb-0.5">
                      Teacher Answer:
                    </strong>
                    {t.answer}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    Will be addressed in follow-up resources or next lecture.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
