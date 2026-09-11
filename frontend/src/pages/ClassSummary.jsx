import { useState, useEffect } from 'react';
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
import { api } from '../services/api';

export default function ClassSummary({ user, activeClass, onLogout, onNavigate }) {
  const [selectedClass, setSelectedClass] = useState(activeClass || null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user's classes list
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await api.getClasses();
        if (res?.classes && res.classes.length > 0) {
          setAvailableClasses(res.classes);
          if (!activeClass && !selectedClass) {
            setSelectedClass(res.classes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load classes for summary:', err);
      }
    }
    loadClasses();
  }, [activeClass]);

  useEffect(() => {
    if (activeClass) {
      setSelectedClass(activeClass);
    }
  }, [activeClass]);

  const targetClass = selectedClass || activeClass;
  const hasTargetClass = Boolean(targetClass && (targetClass._id || targetClass.id));

  const currentClass = targetClass || {
    id: '',
    className: 'Class Session Summary',
    classCode: '',
    subject: 'General',
    topic: 'Session Wrap-up',
    instructor: user?.name || 'Instructor',
    studentsCount: 0,
  };

  // Analytics Data state loaded directly from MongoDB
  const [summaryData, setSummaryData] = useState({
    totalQuestions: 0,
    questionGroups: 0,
    repeatedQuestionsFiltered: 0,
    answeredGroups: 0,
    unansweredGroups: 0,
    efficiencyGain: '0%',
    durationMinutes: 0,
    mostConfusingTopic: null,
    categoryStats: [
      { category: 'conceptual', label: 'Conceptual', count: 0, percentage: 0 },
      { category: 'technical', label: 'Technical', count: 0, percentage: 0 },
      { category: 'administrative', label: 'Administrative', count: 0, percentage: 0 },
      { category: 'homework', label: 'Homework', count: 0, percentage: 0 },
    ],
    transcripts: [],
  });

  useEffect(() => {
    async function loadLiveSummary() {
      const classId = targetClass?._id || targetClass?.id;
      if (classId) {
        setLoading(true);
        try {
          const res = await api.getClassSummary(classId);
          if (res?.summary) {
            setSummaryData((prev) => ({
              ...prev,
              ...res.summary,
            }));
          }
          if (res?.class) {
            setSelectedClass((prev) => ({
              ...prev,
              ...res.class,
            }));
          }
        } catch (err) {
          console.error('Failed to load class summary:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    if (hasTargetClass) {
      loadLiveSummary();
    } else {
      setLoading(false);
    }
  }, [targetClass?._id, hasTargetClass]);

  const handleExport = () => {
    setDownloaded(true);
    try {
      const headers = ['Index', 'Category', 'Priority', 'Students Affected', 'Question Cluster', 'Instructor Answer', 'Status'];
      const rows = summaryData.transcripts.map((t, idx) => [
        idx + 1,
        t.category || 'General',
        t.priority || 'Medium',
        t.studentCount || 1,
        `"${(t.mainQuestion || '').replace(/"/g, '""')}"`,
        `"${(t.answer || 'Unresolved').replace(/"/g, '""')}"`,
        t.status || 'Pending',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        `EduNova Class Analytics Report - ${currentClass.className} (${currentClass.classCode})\n` +
        `Instructor: ${currentClass.instructor} | Topic: ${currentClass.topic}\n` +
        `Total Doubts: ${summaryData.totalQuestions} | AI Groups: ${summaryData.questionGroups} | Efficiency: ${summaryData.efficiencyGain}\n\n` +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${(currentClass.className || 'Lecture').replace(/\s+/g, '_')}_Summary_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Export CSV error:', e);
    }
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
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeClass={hasTargetClass ? currentClass : null}
        currentPage="class_summary"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col justify-center">
        {!hasTargetClass ? (
          <div className="py-16 px-6 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <FileText size={36} className="opacity-75" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
                No Session Summary Selected
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Select a class session from your dashboard or finish a live lecture to review its post-class AI question analytics, confusion bottlenecks, and transcripts.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={returnHome}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={returnHome}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            {availableClasses.length > 1 && (
              <select
                value={targetClass?._id || targetClass?.id || ''}
                onChange={(e) => {
                  const found = availableClasses.find((c) => (c._id || c.id) === e.target.value);
                  if (found) setSelectedClass(found);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
              >
                {availableClasses.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.className} ({c.classCode}) {c.status === 'active' ? '• LIVE' : '• Ended'}
                  </option>
                ))}
              </select>
            )}
          </div>

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
                Post-Class Analytics
              </span>
              {currentClass.classCode && (
                <span className="text-xs text-gray-400">
                  Session Code: <strong className="text-gray-700 dark:text-gray-300">{currentClass.classCode}</strong>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-gray-900 dark:text-white">
              {currentClass.className}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Topic: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentClass.topic}</span> • Instructor: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentClass.instructor}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
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
            <p className="text-[11px] text-gray-400">Raw questions submitted</p>
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
              <TrendingUp size={18} className="text-emerald-500" />
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
            <p className="text-[11px] text-gray-400">{summaryData.unansweredGroups} doubts remaining</p>
          </div>
        </div>

        {/* Most Confusing Topic & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Confusing Concept Highlight Box */}
          {summaryData.mostConfusingTopic ? (
            <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Primary Conceptual Bottleneck
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
                  <PriorityBadge priority={summaryData.mostConfusingTopic.severity || 'medium'} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {summaryData.mostConfusingTopic.aiInsight}
                </p>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">No Confusion Clusters Detected</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  When multiple students ask related doubts on the same concept, AI will automatically highlight the primary conceptual bottleneck here.
                </p>
              </div>
            </div>
          )}

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
            {summaryData.transcripts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-white/10">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No questions recorded in this session yet</p>
                <p className="text-xs text-gray-400">
                  Questions asked and clustered during the live class will appear here with instructor answers.
                </p>
              </div>
            ) : (
              summaryData.transcripts.map((t, idx) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </main>
</div>
  );
}
